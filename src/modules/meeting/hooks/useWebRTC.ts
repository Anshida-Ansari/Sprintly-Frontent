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

export function useWebRTC(roomId: string, userId: string) {
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});

	const peers = useRef<Record<string, PeerConnection>>({});
	const socketRef = useRef<any>(null); 
	const localStreamRef = useRef<MediaStream | null>(null);

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
					stream.getTracks().forEach(track => track.stop());
				}
			} catch (err) {
				console.error("Error accessing media devices:", err);
			}
		};

		initMedia();

		return () => {
			isMounted = false;
			if (localStreamRef.current) {
				localStreamRef.current.getTracks().forEach((track) => track.stop());
				localStreamRef.current = null;
			}
		};
	}, []); 
	useEffect(() => {
		if (!roomId || !userId || !localStream) return;

		if (socketRef.current) return;

		socket.connect();
		socketRef.current = socket;

		const createPeerConnection = (targetSocketId: string, stream: MediaStream, isInitiator: boolean) => {
			if (peers.current[targetSocketId]) {
				console.warn(`[WebRTC] Peer connection for ${targetSocketId} already exists`);
				return peers.current[targetSocketId].connection;
			}

			console.log(`[WebRTC] Creating peer connection for ${targetSocketId}, initiator: ${isInitiator}`);
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
				console.log(`[WebRTC] Received remote stream from ${targetSocketId}`);
				setRemoteStreams((prev) => ({
					...prev,
					[targetSocketId]: event.streams[0],
				}));
			};

			pc.onnegotiationneeded = async () => {
				if (!isInitiator) return;
				try {
					const offer = await pc.createOffer();
					await pc.setLocalDescription(offer);
					socket.emit("offer", { roomId, to: targetSocketId, offer });
				} catch (err) {
					console.error("Error sending offer:", err);
				}
			};

			peers.current[targetSocketId] = {
				connection: pc,
				socketId: targetSocketId,
			};

			return pc;
		};

		socket.emit("join-room", roomId, userId);

		
		socket.on("user-joined", async ({ socketId }: { socketId: string }) => {
			console.log(`[Socket] User joined: ${socketId} (Waiting for their offer)`);
			
		});

		//
		socket.on("existing-users", (users: { socketId: string }[]) => {
			console.log(`[Socket] Existing users:`, users);
			users.forEach(async (user) => {
				const pc = createPeerConnection(user.socketId, localStream, true);
				try {
					const offer = await pc.createOffer();
					await pc.setLocalDescription(offer);
					socket.emit("offer", { roomId, to: user.socketId, offer });
				} catch (err) {
					console.error("[WebRTC] Error creating offer for existing user:", err);
				}
			});
		});

		socket.on("offer", async ({ from, offer }) => {
			console.log(`[Socket] Received offer from ${from}`);
			const pc = createPeerConnection(from, localStream, false);
			try {
				await pc.setRemoteDescription(new RTCSessionDescription(offer));
				const answer = await pc.createAnswer();
				await pc.setLocalDescription(answer);
				socket.emit("answer", { roomId, to: from, answer });
			} catch (err) {
				console.error("[WebRTC] Error handling offer:", err);
			}
		});

		socket.on("answer", async ({ from, answer }) => {
			console.log(`[Socket] Received answer from ${from}`);
			const pc = peers.current[from]?.connection;
			if (pc) {
				try {
					await pc.setRemoteDescription(new RTCSessionDescription(answer));
				} catch (err) {
					console.error("[WebRTC] Error setting remote description (answer):", err);
				}
			}
		});

		socket.on("ice-candidate", async ({ from, candidate }) => {
			const pc = peers.current[from]?.connection;
			if (pc) {
				try {
					await pc.addIceCandidate(new RTCIceCandidate(candidate));
				} catch (err) {
					console.error("[WebRTC] Error adding ICE candidate:", err);
				}
			}
		});

		socket.on("user-left", (socketId: string) => {
			console.log(`[Socket] User left: ${socketId}`);
			if (peers.current[socketId]) {
				peers.current[socketId].connection.close();
				delete peers.current[socketId];
				setRemoteStreams((prev) => {
					const next = { ...prev };
					delete next[socketId];
					return next;
				});
			}
		});

		return () => {
			socket.off("user-joined");
			socket.off("existing-users");
			socket.off("offer");
			socket.off("answer");
			socket.off("ice-candidate");
			socket.off("user-left");

			Object.values(peers.current).forEach((p) => p.connection.close());
			peers.current = {};

			socket.disconnect();
			socketRef.current = null;
		};
	}, [roomId, userId, localStream]);

	return { localStream, remoteStreams };
}
