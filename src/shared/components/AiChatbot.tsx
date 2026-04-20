import type React from "react";
import { useEffect, useRef, useState } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { aiService } from "../service/ai.service";

interface Message {
	id: string;
	role: "user" | "assistant";
	text: string;
	timestamp: Date;
}

const QUICK_QUESTIONS = [
	"What is a project?",
	"What is a sprint?",
	"What is a user story?",
	"How do I create a task?",
	"What should I do next?",
];

const uid = () => Math.random().toString(36).slice(2, 10);

const BotAvatar = () => (
	<div
		style={{
			width: 32,
			height: 32,
			borderRadius: "50%",
			background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: 0,
			boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
		}}
	>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path
				d="M12 2a2 2 0 0 1 2 2v1h2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h2V4a2 2 0 0 1 2-2zm-1 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-4 3h4v1H11v-1z"
				fill="white"
			/>
		</svg>
	</div>
);

const TypingIndicator = () => (
	<div
		style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}
	>
		{[0, 1, 2].map((i) => (
			<div
				key={i}
				style={{
					width: 7,
					height: 7,
					borderRadius: "50%",
					background: "#6366f1",
					animation: "chatBounce 1.2s ease-in-out infinite",
					animationDelay: `${i * 0.2}s`,
					opacity: 0.7,
				}}
			/>
		))}
	</div>
);

export const AiChatbot: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: uid(),
			role: "assistant",
			text: "👋 Hi! I'm your Sprintly AI assistant. Ask me anything about projects, sprints, user stories, or tasks!",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const getProjectIdFromUrl = () => {
		const patterns = [
			"/admin/projects/:projectId",
			"/developers/projects/:projectId",
		];
		for (const pattern of patterns) {
			const match = matchPath({ path: pattern, end: false }, location.pathname);
			if (match?.params.projectId) {
				return match.params.projectId;
			}
		}
		return undefined;
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);
	useEffect(() => {
		if (open) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [open]);

	const sendMessage = async (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || loading) return;

		const userMsg: Message = {
			id: uid(),
			role: "user",
			text: trimmed,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setLoading(true);
		const projectId = getProjectIdFromUrl();

		try {
			const reply = await aiService.chat(trimmed, projectId);
			const botMsg: Message = {
				id: uid(),
				role: "assistant",
				text: reply,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, botMsg]);
		} catch {
			const errMsg: Message = {
				id: uid(),
				role: "assistant",
				text: "Sorry, I couldn't process that. Please try again in a moment.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errMsg]);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		sendMessage(input);
	};

	return (
		<>
			{/* Keyframe injection */}
			<style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
        }
        .chat-msg-user { animation: chatSlideUp 0.2s ease; }
        .chat-msg-bot  { animation: chatSlideUp 0.25s ease; }
        .chat-input-wrapper:focus-within { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .quick-pill:hover { background: #6366f1 !important; color: #fff !important; transform: translateY(-1px); }
        .chat-send-btn:hover:not(:disabled) { background: #4f46e5 !important; }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

			{/* ── Floating Toggle Button ── */}
			<button
				id="ai-chatbot-toggle"
				onClick={() => setOpen((v) => !v)}
				title="Open AI Assistant"
				style={{
					position: "fixed",
					bottom: 28,
					right: 28,
					width: 56,
					height: 56,
					borderRadius: "50%",
					background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
					border: "none",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
					zIndex: 9999,
					transition: "transform 0.2s, box-shadow 0.2s",
					animation: open ? "none" : "chatPulse 2.5s ease-in-out infinite",
				}}
				onMouseEnter={(e) => {
					(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
				}}
				onMouseLeave={(e) => {
					(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
				}}
			>
				{open ? (
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
						<path
							d="M18 6 6 18M6 6l12 12"
							stroke="white"
							strokeWidth="2.5"
							strokeLinecap="round"
						/>
					</svg>
				) : (
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</button>

			{/* ── Chat Window ── */}
			{open && (
				<div
					id="ai-chatbot-window"
					style={{
						position: "fixed",
						bottom: 96,
						right: 28,
						width: 380,
						maxWidth: "calc(100vw - 48px)",
						height: 540,
						borderRadius: 20,
						background: "#fff",
						boxShadow:
							"0 16px 60px rgba(0,0,0,0.18), 0 4px 20px rgba(99,102,241,0.15)",
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						zIndex: 9998,
						animation: "chatSlideUp 0.25s ease",
						border: "1px solid rgba(99,102,241,0.12)",
					}}
				>
					{/* Header */}
					<div
						style={{
							background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
							padding: "16px 20px",
							display: "flex",
							alignItems: "center",
							gap: 12,
						}}
					>
						<div
							style={{
								width: 40,
								height: 40,
								borderRadius: "50%",
								background: "rgba(255,255,255,0.2)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								border: "2px solid rgba(255,255,255,0.35)",
							}}
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
								<path
									d="M12 2a2 2 0 0 1 2 2v1h2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h2V4a2 2 0 0 1 2-2zm-1 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-4 3h4v1H11v-1z"
									fill="white"
								/>
							</svg>
						</div>
						<div>
							<div
								style={{
									color: "#fff",
									fontWeight: 700,
									fontSize: 15,
									letterSpacing: "-0.3px",
								}}
							>
								Sprintly Assistant
							</div>
							<div
								style={{
									color: "rgba(255,255,255,0.75)",
									fontSize: 12,
									display: "flex",
									alignItems: "center",
									gap: 5,
								}}
							>
								<span
									style={{
										width: 7,
										height: 7,
										borderRadius: "50%",
										background: "#4ade80",
										display: "inline-block",
										boxShadow: "0 0 6px #4ade80",
									}}
								/>
								Online · Powered by GPT-4.1
							</div>
						</div>
					</div>

					{/* Messages */}
					<div
						id="ai-chat-messages"
						style={{
							flex: 1,
							overflowY: "auto",
							padding: "16px 16px 8px",
							display: "flex",
							flexDirection: "column",
							gap: 12,
							scrollbarWidth: "thin",
							scrollbarColor: "#e5e7eb transparent",
						}}
					>
						{messages.map((msg) =>
							msg.role === "user" ? (
								// User bubble (right)
								<div
									key={msg.id}
									className="chat-msg-user"
									style={{ display: "flex", justifyContent: "flex-end" }}
								>
									<div
										style={{
											background:
												"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
											color: "#fff",
											padding: "10px 14px",
											borderRadius: "18px 18px 4px 18px",
											maxWidth: "80%",
											fontSize: 14,
											lineHeight: 1.5,
											boxShadow: "0 2px 10px rgba(99,102,241,0.3)",
										}}
									>
										{msg.text}
									</div>
								</div>
							) : (
								// Bot bubble (left)
								<div
									key={msg.id}
									className="chat-msg-bot"
									style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
								>
									<BotAvatar />
									<div
										style={{
											background: "#f4f4f8",
											color: "#1e1e2e",
											padding: "10px 14px",
											borderRadius: "18px 18px 18px 4px",
											maxWidth: "80%",
											fontSize: 14,
											lineHeight: 1.5,
											border: "1px solid #eaeaf0",
										}}
									>
										{msg.text}
									</div>
								</div>
							),
						)}

						{/* Typing indicator */}
						{loading && (
							<div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
								<BotAvatar />
								<div
									style={{
										background: "#f4f4f8",
										padding: "10px 14px",
										borderRadius: "18px 18px 18px 4px",
										border: "1px solid #eaeaf0",
									}}
								>
									<TypingIndicator />
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Quick questions */}
					<div
						style={{
							padding: "8px 16px",
							display: "flex",
							gap: 6,
							overflowX: "auto",
							scrollbarWidth: "none",
							borderTop: "1px solid #f0f0f6",
						}}
					>
						{QUICK_QUESTIONS.map((q) => (
							<button
								key={q}
								className="quick-pill"
								onClick={() => sendMessage(q)}
								disabled={loading}
								style={{
									whiteSpace: "nowrap",
									padding: "5px 12px",
									borderRadius: 20,
									border: "1.5px solid #e0e0f0",
									background: "#fafaff",
									color: "#6366f1",
									fontSize: 12,
									fontWeight: 600,
									cursor: "pointer",
									transition: "all 0.15s ease",
									flexShrink: 0,
								}}
							>
								{q}
							</button>
						))}
					</div>

					{/* Input area */}
					<form
						onSubmit={handleSubmit}
						style={{
							padding: "12px 16px 16px",
							borderTop: "1px solid #f0f0f6",
						}}
					>
						<div
							className="chat-input-wrapper"
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
								border: "1.5px solid #e5e7eb",
								borderRadius: 14,
								padding: "8px 8px 8px 14px",
								transition: "border-color 0.15s, box-shadow 0.15s",
							}}
						>
							<input
								id="ai-chat-input"
								ref={inputRef}
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Ask me anything…"
								disabled={loading}
								style={{
									flex: 1,
									border: "none",
									outline: "none",
									fontSize: 14,
									color: "#1e1e2e",
									background: "transparent",
								}}
							/>
							<button
								id="ai-chat-send"
								type="submit"
								disabled={loading || !input.trim()}
								className="chat-send-btn"
								style={{
									width: 36,
									height: 36,
									borderRadius: 10,
									background: "#6366f1",
									border: "none",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									transition: "background 0.15s",
									flexShrink: 0,
								}}
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
									<path
										d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
};
