import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
			className={`relative bg-gray-800 rounded-[32px] overflow-hidden border border-gray-700 ${isLocal ? "border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20" : ""}`}
		>
			<video
				ref={videoRef}
				autoPlay
				muted={isLocal}
				playsInline
				className={`w-full h-full object-cover ${isLocal ? "mirror" : ""}`}
			/>
			<div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl">
				{isLocal && (
					<div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
				)}
				<span className="font-bold text-sm">{label}</span>
			</div>
		</div>
	);
};

export default function MeetingRoom() {
	const navigate = useNavigate();
	const { roomId } = useParams<{ roomId: string }>();
	const user = UserAuth((state) => state.user);
	const { localStream, remoteStreams } = useWebRTC(
		roomId || "default",
		user?.id || "anonymous",
	);

	const [isMicOn, setIsMicOn] = useState(true);
	const [isCameraOn, setIsCameraOn] = useState(true);

	const toggleMic = () => {
		if (localStream) {
			localStream
				.getAudioTracks()
				.forEach((track) => (track.enabled = !isMicOn));
			setIsMicOn(!isMicOn);
		}
	};

	const toggleCamera = () => {
		if (localStream) {
			localStream
				.getVideoTracks()
				.forEach((track) => (track.enabled = !isCameraOn));
			setIsCameraOn(!isCameraOn);
		}
	};

	const handleEndCall = () => {
		// Stop all tracks
		if (localStream) {
			localStream.getTracks().forEach((track) => track.stop());
		}

		// Navigate based on role (assuming role is available in user object, otherwise default to /)
		// Adjust this logic if role property is named differently or nested
		if (user?.role === "admin") {
			navigate("/admin/meetings");
		} else if (user?.role === "superadmin") {
			navigate("/superadmin/dashboard");
		} else {
			navigate("/developers/dashboard");
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-black">Meeting Room</h1>
					<p className="text-gray-400 font-bold">Room ID: {roomId}</p>
				</div>
				<div className="flex gap-4">
					{/* Participants Count */}
					<div className="bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 font-bold">
						{Object.keys(remoteStreams).length + 1} Participants
					</div>
				</div>
			</div>

			<div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
				{/* Local Video */}
				{localStream && (
					<VideoPlayer
						stream={localStream}
						isLocal={true}
						label={`You (${user?.name || "Me"})`}
					/>
				)}

				{/* Remote Videos */}
				{Object.entries(remoteStreams).map(([socketId, stream]) => (
					<VideoPlayer
						key={socketId}
						stream={stream}
						label={`Participant ${socketId.slice(0, 4)}`}
					/>
				))}

				{/* Placeholder if alone */}
				{Object.keys(remoteStreams).length === 0 && (
					<div className="flex items-center justify-center bg-gray-800/50 rounded-[32px] border-2 border-dashed border-gray-700">
						<div className="text-center">
							<p className="text-gray-500 font-bold">
								Waiting for others to join...
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Controls Bar */}
			<div className="mt-8 flex justify-center items-center gap-6">
				<button
					onClick={toggleMic}
					className={`p-5 rounded-3xl transition-all scale-100 active:scale-90 ${isMicOn ? "bg-gray-800 hover:bg-gray-700" : "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30"}`}
				>
					{isMicOn ? <Mic size={28} /> : <MicOff size={28} />}
				</button>

				<button
					onClick={toggleCamera}
					className={`p-5 rounded-3xl transition-all scale-100 active:scale-90 ${isCameraOn ? "bg-gray-800 hover:bg-gray-700" : "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30"}`}
				>
					{isCameraOn ? <Camera size={28} /> : <CameraOff size={28} />}
				</button>

				<button
					onClick={handleEndCall}
					className="p-5 bg-rose-600 hover:bg-rose-700 rounded-3xl transition-all scale-100 active:scale-90 shadow-xl shadow-rose-900/20"
				>
					<PhoneOff size={28} />
				</button>
			</div>

			<style>{`
        .mirror {
          transform: rotateY(180deg);
        }
      `}</style>
		</div>
	);
}
