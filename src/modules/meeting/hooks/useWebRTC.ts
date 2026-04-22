import { useEffect, useRef, useState } from "react";
import { socket } from "../../../lib/socket";

interface PeerConnection {
	connection: RTCPeerConnection;
	socketId: string;
}

const configuration = {
	iceServers: [
		{ urls: "stun:stun.l.google.com:19302" },
		{ urls: "stun:stun1.l.google.com:19302" },
	],
};

export function useWebRTC(roomId: string, userId: string, userName: string) {
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStreams, setRemoteStreams] = useState<
		Record<string, MediaStream>
	>({});
	const [remoteUsers, setRemoteUsers] = useState<
		Record<string, { socketId: string; userName: string }>
	>({});
	const [remoteCameraOff, setRemoteCameraOff] = useState<
		Record<string, boolean>
	>({});
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [messages, setMessages] = useState<any[]>([]);
	const [activeSpeaker] = useState<string | null>(null);
	const [isMeetingEnded, setIsMeetingEnded] = useState(false);

	const peers = useRef<Record<string, PeerConnection>>({});
	const candidateQueue = useRef<Record<string, RTCIceCandidateInit[]>>({});
	const socketRef = useRef<any>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const screenStreamRef = useRef<MediaStream | null>(null);

	useEffect(() => {
		let isMounted = true;

		const initMedia = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				if (isMounted) {
					setLocalStream(stream);
					localStreamRef.current = stream;
				} else {
					stream.getTracks().forEach((track) => {
						track.stop();
					});
				}
			} catch (err) {
				console.error("Error accessing media devices:", err);
			}
		};

		initMedia();

		return () => {
			isMounted = false;
			if (localStreamRef.current) {
				for (const track of localStreamRef.current.getTracks()) {
					track.stop();
				}
				localStreamRef.current = null;
			}
			if (screenStreamRef.current) {
				for (const track of screenStreamRef.current.getTracks()) {
					track.stop();
				}
				screenStreamRef.current = null;
			}
		};
	}, []);

	// CRITICAL FIX: This effect runs ONCE when localStream is ready and never re-runs.
	// remoteStreams is NOT in the dependency array because adding it would cause the effect
	// to re-run on every new peer joining, re-registering all socket listeners and
	// breaking multi-peer connections (the root cause of the "empty boxes" bug).
	useEffect(() => {
		if (!roomId || !userId || !localStream) return;
		if (socketRef.current) return;

		socket.connect();
		socketRef.current = socket;

		const createPeerConnection = (
			targetSocketId: string,
			stream: MediaStream,
		) => {
			if (peers.current[targetSocketId]) {
				return peers.current[targetSocketId].connection;
			}

			const pc = new RTCPeerConnection(configuration);

			stream.getTracks().forEach((track) => {
				pc.addTrack(track, stream);
			});

			pc.onicecandidate = (event) => {
				if (event.candidate) {
					socket.emit("ice-candidate", {
						roomId,
						to: targetSocketId,
						candidate: event.candidate,
					});
				}
			};

			pc.ontrack = (event) => {
				console.log(`[WebRTC] Got track from ${targetSocketId}`);
				setRemoteStreams((prev) => ({
					...prev,
					[targetSocketId]: event.streams[0],
				}));
			};

			peers.current[targetSocketId] = {
				connection: pc,
				socketId: targetSocketId,
			};

			return pc;
		};

		socket.emit("join-room", roomId, userId, userName);

		socket.on(
			"user-joined",
			({
				socketId,
				userName: joinedName,
			}: {
				socketId: string;
				userName?: string;
			}) => {
				console.log(`[Socket] user-joined: ${socketId} - ${joinedName}`);
				if (joinedName) {
					setRemoteUsers((prev) => ({
						...prev,
						[socketId]: { socketId, userName: joinedName },
					}));
				}
			},
		);

		socket.on(
			"existing-users",
			(users: { socketId: string; userName?: string }[]) => {
				console.log(
					`[Socket] existing-users:`,
					users.map((u) => u.socketId),
				);
				const usersMap: Record<string, any> = {};
				users.forEach(async (user) => {
					if (user.userName) {
						usersMap[user.socketId] = {
							socketId: user.socketId,
							userName: user.userName,
						};
					}
					const pc = createPeerConnection(user.socketId, localStream);
					try {
						const offer = await pc.createOffer();
						await pc.setLocalDescription(offer);
						socket.emit("offer", { roomId, to: user.socketId, offer });
					} catch (err) {
						console.error("[WebRTC] Error creating offer:", err);
					}
				});
				if (Object.keys(usersMap).length > 0) {
					setRemoteUsers((prev) => ({ ...prev, ...usersMap }));
				}
			},
		);

		socket.on(
			"offer",
			async ({
				from,
				offer,
			}: {
				from: string;
				offer: RTCSessionDescriptionInit;
			}) => {
				console.log(`[Socket] offer from ${from}`);
				const pc = createPeerConnection(from, localStream);
				try {
					await pc.setRemoteDescription(new RTCSessionDescription(offer));

					// Process queued ICE candidates
					if (candidateQueue.current[from]) {
						candidateQueue.current[from].forEach(async (candidate) => {
							try {
								await pc.addIceCandidate(new RTCIceCandidate(candidate));
							} catch (e) {
								console.error("[WebRTC] Error adding queued ICE candidate:", e);
							}
						});
						candidateQueue.current[from] = [];
					}

					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);
					socket.emit("answer", { roomId, to: from, answer });
				} catch (err) {
					console.error("[WebRTC] Error handling offer:", err);
				}
			},
		);

		socket.on(
			"answer",
			async ({
				from,
				answer,
			}: {
				from: string;
				answer: RTCSessionDescriptionInit;
			}) => {
				console.log(`[Socket] answer from ${from}`);
				const pc = peers.current[from]?.connection;
				if (pc) {
					try {
						await pc.setRemoteDescription(new RTCSessionDescription(answer));

						// Process queued ICE candidates
						if (candidateQueue.current[from]) {
							candidateQueue.current[from].forEach(async (candidate) => {
								try {
									await pc.addIceCandidate(new RTCIceCandidate(candidate));
								} catch (e) {
									console.error(
										"[WebRTC] Error adding queued ICE candidate:",
										e,
									);
								}
							});
							candidateQueue.current[from] = [];
						}
					} catch (err) {
						console.error("[WebRTC] Error setting remote description:", err);
					}
				}
			},
		);

		socket.on(
			"ice-candidate",
			async ({
				from,
				candidate,
			}: {
				from: string;
				candidate: RTCIceCandidateInit;
			}) => {
				const pc = peers.current[from]?.connection;
				if (pc) {
					if (pc.remoteDescription) {
						try {
							await pc.addIceCandidate(new RTCIceCandidate(candidate));
						} catch (err) {
							console.error("[WebRTC] Error adding ICE candidate:", err);
						}
					} else {
						console.log(`[WebRTC] Queuing ICE candidate from ${from}`);
						if (!candidateQueue.current[from])
							candidateQueue.current[from] = [];
						candidateQueue.current[from].push(candidate);
					}
				}
			},
		);

		socket.on("user-left", (socketId: string) => {
			console.log(`[Socket] user-left: ${socketId}`);
			if (peers.current[socketId]) {
				peers.current[socketId].connection.close();
				delete peers.current[socketId];
				setRemoteStreams((prev) => {
					const next = { ...prev };
					delete next[socketId];
					return next;
				});
				setRemoteUsers((prev) => {
					const next = { ...prev };
					delete next[socketId];
					return next;
				});
			}
		});

		socket.on("receive-chat-message", (payload: any) => {
			setMessages((prev) => [...prev, payload]);
		});

		socket.on(
			"peer-camera-toggle",
			({ from, isOn }: { from: string; isOn: boolean }) => {
				setRemoteCameraOff((prev) => ({ ...prev, [from]: !isOn }));
			},
		);

		socket.on("meeting-ended", () => {
			setIsMeetingEnded(true);
		});

		socket.on("kicked", () => {
			setIsMeetingEnded(true);
		});

		return () => {
			socket.off("user-joined");
			socket.off("existing-users");
			socket.off("offer");
			socket.off("answer");
			socket.off("ice-candidate");
			socket.off("user-left");
			socket.off("receive-chat-message");
			socket.off("peer-camera-toggle");
			socket.off("meeting-ended");
			socket.off("kicked");

			Object.values(peers.current).forEach((p) => {
				p.connection.close();
			});
			peers.current = {};

			socket.disconnect();
			socketRef.current = null;
		};
	}, [roomId, userId, localStream, userName]);

	const toggleScreenShare = async () => {
		try {
			if (!isScreenSharing) {
				const stream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
				});
				screenStreamRef.current = stream;
				const videoTrack = stream.getVideoTracks()[0];

				Object.values(peers.current).forEach((peer) => {
					const sender = peer.connection
						.getSenders()
						.find((s) => s.track?.kind === "video");
					if (sender) sender.replaceTrack(videoTrack);
				});

				videoTrack.onended = () => {
					stopScreenShare();
				};

				setIsScreenSharing(true);
			} else {
				stopScreenShare();
			}
		} catch (err) {
			console.error("Error toggling screen share:", err);
		}
	};

	const stopScreenShare = () => {
		if (screenStreamRef.current) {
			for (const track of screenStreamRef.current.getTracks()) {
				track.stop();
			}
			screenStreamRef.current = null;
		}
		if (localStreamRef.current) {
			const videoTrack = localStreamRef.current.getVideoTracks()[0];
			Object.values(peers.current).forEach((peer) => {
				const sender = peer.connection
					.getSenders()
					.find((s) => s.track?.kind === "video");
				if (sender) sender.replaceTrack(videoTrack);
			});
		}
		setIsScreenSharing(false);
	};

	const sendMessage = (message: string) => {
		if (socketRef.current && message.trim()) {
			socket.emit("send-chat-message", { roomId, message, userName });
			setMessages((prev) => [
				...prev,
				{ senderId: "me", userName: "You", message, timestamp: new Date() },
			]);
		}
	};

	const endMeetingSocket = (meetingRoomId: string) => {
		if (socketRef.current) {
			socket.emit("end-meeting", {
				roomId: meetingRoomId,
				meetingId: meetingRoomId,
			});
		}
	};

	const emitCameraToggle = (isOn: boolean) => {
		if (socketRef.current) {
			socket.emit("camera-toggle", { roomId, isOn });
		}
	};

	return {
		localStream,
		remoteStreams,
		remoteUsers,
		remoteCameraOff,
		isScreenSharing,
		toggleScreenShare,
		messages,
		sendMessage,
		activeSpeaker,
		isMeetingEnded,
		endMeetingSocket,
		emitCameraToggle,
	};
}
