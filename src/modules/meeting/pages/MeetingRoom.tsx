import {
	Camera,
	CameraOff,
	MessageSquare,
	Mic,
	MicOff,
	Monitor,
	PhoneOff,
	Send,
	Users,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buildPath, ROUTES } from "../../../constants/routes";
import { meetingService } from "../../admin/services/meeting.service";
import { UserAuth } from "../../auth/store/store";
import { useWebRTC } from "../hooks/useWebRTC";

const VideoPlayer = ({
	stream,
	isLocal = false,
	label,
}: {
	stream: MediaStream | null;
	isLocal?: boolean;
	label: string;
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<div
			className={`relative bg-gray-900 rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl transition-all duration-300 ${
				isLocal
					? "ring-2 ring-indigo-500 ring-offset-4 ring-offset-gray-900"
					: "hover:border-indigo-500/50"
			}`}
		>
			{stream ? (
				<video
					ref={videoRef}
					autoPlay
					muted={isLocal}
					playsInline
					className={`w-full h-full object-contain ${isLocal ? "mirror" : ""}`}
				/>
			) : (
				<div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gray-800">
					<div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-400">
						{label.charAt(0).toUpperCase()}
					</div>
				</div>
			)}
			<div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 z-10">
				<div
					className={`w-2 h-2 rounded-full ${isLocal ? "bg-indigo-500" : "bg-emerald-500"}`}
				/>
				<span className="text-xs font-medium text-white/90 truncate max-w-[150px]">
					{label}
				</span>
			</div>
		</div>
	);
};

export default function MeetingRoom() {
	const navigate = useNavigate();
	const { roomId } = useParams<{ roomId: string }>();
	const user = UserAuth((state) => state.user);

	const {
		localStream,
		remoteStreams,
		remoteUsers,
		remoteCameraOff,
		isScreenSharing,
		toggleScreenShare,
		messages,
		sendMessage,
		isMeetingEnded,
		endMeetingSocket,
		emitCameraToggle,
	} = useWebRTC(
		roomId || "default",
		user?.id || "anonymous",
		user?.name || "Anonymous",
	);

	const [isMicOn, setIsMicOn] = useState(true);
	const [isCameraOn, setIsCameraOn] = useState(true);
	const [showChat, setShowChat] = useState(false);
	const [showParticipants, setShowParticipants] = useState(false);
	const [chatInput, setChatInput] = useState("");
	const [timer, setTimer] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const formatTime = (seconds: number) => {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		return `${h > 0 ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
	};

	const toggleMic = () => {
		if (localStream) {
			localStream
				.getAudioTracks()
				.forEach((track) => (track.enabled = !isMicOn));
			setIsMicOn((prev) => !prev);
		}
	};

	const toggleCamera = () => {
		if (localStream) {
			const newState = !isCameraOn;
			localStream
				.getVideoTracks()
				.forEach((track) => (track.enabled = newState));
			setIsCameraOn(newState);
			emitCameraToggle(newState); // tell peers
		}
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (chatInput.trim()) {
			sendMessage(chatInput);
			setChatInput("");
		}
	};

	const getDashboardPath = () => {
		if (user?.role === "admin") return buildPath.admin(ROUTES.ADMIN.MEETINGS);
		if (user?.role === "lead") return buildPath.admin(ROUTES.ADMIN.MEETINGS);
		return buildPath.developer(ROUTES.DEVELOPER.MEETINGS);
	};

	const handleLeave = () => {
		if (localStream) {
			localStream.getTracks().forEach((track) => track.stop());
		}
		navigate(getDashboardPath());
	};

	const handleEndMeeting = async () => {
		if (
			!window.confirm("Are you sure you want to end the meeting for everyone?")
		)
			return;

		// 1. Emit socket event to kick everyone
		endMeetingSocket(roomId || "default");

		// 2. Update the meeting status to COMPLETED in the database
		if (roomId) {
			try {
				await meetingService.updateMeetingStatus(roomId, "COMPLETED");
				console.log("[Meeting] Status updated to COMPLETED");
			} catch (error) {
				console.error("[Meeting] Failed to update status:", error);
			}
		}

		// 3. Navigate away
		handleLeave();
	};

	// "Meeting Ended" screen — shown when kicked or meeting-ended socket event fires
	if (isMeetingEnded) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
				<div className="max-w-md w-full bg-gray-800 rounded-[40px] p-12 text-center border border-gray-700 shadow-2xl">
					<div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
						<PhoneOff size={40} />
					</div>
					<h1 className="text-3xl font-black text-white mb-4">Meeting Ended</h1>
					<p className="text-gray-400 font-medium mb-8">
						The meeting has concluded. You can now return to the meetings page.
					</p>
					<button
						onClick={() => navigate(getDashboardPath())}
						className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all"
					>
						Back to Meetings
					</button>
				</div>
			</div>
		);
	}

	const remoteCount = Object.keys(remoteStreams).length;

	return (
		<div className="h-screen bg-[#0a0a0c] text-white flex flex-col overflow-hidden">
			{/* Top Bar */}
			<div className="h-16 px-6 flex items-center justify-between bg-black/20 backdrop-blur-xl border-b border-white/5 flex-shrink-0">
				<div className="flex items-center gap-3">
					<div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20">
						<div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
					</div>
					<div>
						<h1 className="text-sm font-black tracking-tight">Meeting Room</h1>
						<div className="flex items-center gap-2">
							<span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/10 uppercase tracking-wider">
								Live
							</span>
							<span className="text-[10px] font-medium text-white/40 tabular-nums">
								{formatTime(timer)}
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-[11px] font-bold text-white/50">
					{remoteCount + 1} participants
					<span className="text-white/20 mx-1">·</span>
					Room:{" "}
					<span className="text-white/80 font-mono ml-1">
						{(roomId || "").slice(0, 8)}
					</span>
				</div>
			</div>

			<div className="flex-1 flex overflow-hidden">
				{/* Main Video Area */}
				<div className="flex-1 p-4 flex flex-col overflow-hidden">
					<div
						className={`flex-1 grid gap-4 ${
							remoteCount === 0
								? "grid-cols-1"
								: remoteCount === 1
									? "grid-cols-2"
									: remoteCount === 2
										? "grid-cols-2 md:grid-cols-3"
										: "grid-cols-2 lg:grid-cols-4"
						}`}
					>
						{localStream && (
							<VideoPlayer
								stream={isCameraOn ? localStream : null}
								isLocal={true}
								label={`You (${user?.name || "Me"})`}
							/>
						)}

						{Object.entries(remoteStreams).map(([socketId, stream]) => (
							<VideoPlayer
								key={socketId}
								stream={remoteCameraOff[socketId] ? null : stream}
								label={remoteUsers[socketId]?.userName || `Participant`}
							/>
						))}

						{/* Show waiting message only when alone */}
						{remoteCount === 0 && localStream && (
							<div className="flex flex-col items-center justify-center bg-white/[0.03] rounded-3xl border border-white/5 border-dashed min-h-[200px]">
								<Users size={28} className="text-white/20 mb-3" />
								<p className="text-white/30 font-bold text-sm">
									Waiting for others to join...
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Right Side Panel */}
				{(showChat || showParticipants) && (
					<div className="w-80 border-l border-white/5 bg-[#111115] flex flex-col flex-shrink-0">
						<div className="p-4 border-b border-white/5 flex items-center justify-between">
							<h3 className="font-black text-base">
								{showChat ? "Room Chat" : `Participants (${remoteCount + 1})`}
							</h3>
							<button
								onClick={() => {
									setShowChat(false);
									setShowParticipants(false);
								}}
								className="p-1.5 hover:bg-white/5 rounded-lg transition-all"
							>
								<X size={18} />
							</button>
						</div>

						{showChat ? (
							<>
								<div className="flex-1 overflow-y-auto p-4 space-y-4">
									{messages.length === 0 && (
										<p className="text-white/20 text-sm text-center mt-8">
											No messages yet
										</p>
									)}
									{messages.map((msg, i) => (
										<div
											key={i}
											className={`flex flex-col ${msg.senderId === "me" ? "items-end" : "items-start"}`}
										>
											<div className="flex items-center gap-2 mb-1 px-0.5">
												<span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
													{msg.userName}
												</span>
												<span className="text-[10px] text-white/20 tabular-nums">
													{new Date(msg.timestamp).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
											<div
												className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
													msg.senderId === "me"
														? "bg-indigo-600 text-white rounded-tr-sm"
														: "bg-white/5 text-white/80 rounded-tl-sm border border-white/5"
												}`}
											>
												{msg.message}
											</div>
										</div>
									))}
								</div>
								<form
									onSubmit={handleSendMessage}
									className="p-3 border-t border-white/5"
								>
									<div className="relative">
										<input
											type="text"
											value={chatInput}
											onChange={(e) => setChatInput(e.target.value)}
											placeholder="Send a message..."
											className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-4 pr-12 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
										/>
										<button
											type="submit"
											className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
										>
											<Send size={16} />
										</button>
									</div>
								</form>
							</>
						) : (
							<div className="flex-1 overflow-y-auto p-4 space-y-2">
								{/* Local user */}
								<div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
									<div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
										{user?.name?.charAt(0).toUpperCase()}
									</div>
									<div className="min-w-0">
										<p className="text-sm font-bold truncate">
											{user?.name} (You)
										</p>
										<p className="text-[10px] text-white/30 uppercase tracking-widest">
											{user?.role}
										</p>
									</div>
								</div>
								{Object.keys(remoteStreams).map((socketId) => (
									<div
										key={socketId}
										className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all"
									>
										<div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center font-bold text-sm text-white/40 flex-shrink-0">
											{(remoteUsers[socketId]?.userName || "P")
												.charAt(0)
												.toUpperCase()}
										</div>
										<div className="min-w-0">
											<p className="text-sm font-bold truncate">
												{remoteUsers[socketId]?.userName || "Participant"}
											</p>
											<p className="text-[10px] text-white/30 font-mono">
												{socketId.slice(0, 8)}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>

			{/* Control Bar */}
			<div className="h-24 flex items-center justify-center flex-shrink-0">
				<div className="flex items-center gap-3 bg-[#1a1a20] border border-white/10 px-6 py-3 rounded-[28px] shadow-2xl">
					{/* Mic */}
					<button
						onClick={toggleMic}
						title={isMicOn ? "Mute" : "Unmute"}
						className={`p-3.5 rounded-2xl transition-all ${
							isMicOn
								? "bg-white/5 hover:bg-white/10 text-white/80"
								: "bg-rose-500 text-white"
						}`}
					>
						{isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
					</button>

					{/* Camera */}
					<button
						onClick={toggleCamera}
						title={isCameraOn ? "Turn off camera" : "Turn on camera"}
						className={`p-3.5 rounded-2xl transition-all ${
							isCameraOn
								? "bg-white/5 hover:bg-white/10 text-white/80"
								: "bg-rose-500 text-white"
						}`}
					>
						{isCameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
					</button>

					<div className="w-px h-6 bg-white/10" />

					{/* Screen Share */}
					<button
						onClick={toggleScreenShare}
						title="Share screen"
						className={`p-3.5 rounded-2xl transition-all ${
							isScreenSharing
								? "bg-indigo-600 text-white"
								: "bg-white/5 hover:bg-white/10 text-white/50"
						}`}
					>
						<Monitor size={20} />
					</button>

					{/* Chat */}
					<button
						onClick={() => {
							setShowChat((prev) => !prev);
							setShowParticipants(false);
						}}
						title="Chat"
						className={`p-3.5 rounded-2xl transition-all ${
							showChat
								? "bg-indigo-600 text-white"
								: "bg-white/5 hover:bg-white/10 text-white/50"
						}`}
					>
						<MessageSquare size={20} />
					</button>

					{/* Participants */}
					<button
						onClick={() => {
							setShowParticipants((prev) => !prev);
							setShowChat(false);
						}}
						title="Participants"
						className={`p-3.5 rounded-2xl transition-all ${
							showParticipants
								? "bg-indigo-600 text-white"
								: "bg-white/5 hover:bg-white/10 text-white/50"
						}`}
					>
						<Users size={20} />
					</button>

					<div className="w-px h-6 bg-white/10" />

					{/* Leave */}
					<button
						onClick={handleLeave}
						className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-rose-400 font-bold rounded-2xl transition-all border border-white/5 text-sm"
					>
						Leave
					</button>

					{/* End for all — only admin/lead */}
					{(user?.role === "admin" || user?.role === "lead") && (
						<button
							onClick={handleEndMeeting}
							className="px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all text-sm"
						>
							End for all
						</button>
					)}
				</div>
			</div>

			<style>{`
        .mirror {
          transform: rotateY(180deg);
        }
      `}</style>
		</div>
	);
}
