import { Loader2, MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";
import type { IComment } from "../types/types";

interface CommentSectionProps {
	initialComments?: IComment[];
	currentUserName?: string;
	membersMap?: Record<string, string>; // userId → name lookup for resolving old comments
	onSubmit: (message: string, onSuccess: () => void) => void;
	isPending: boolean;
	isError: boolean;
	error: any;
}

function formatTimestamp(dateStr: string): string {
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return dateStr;
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export default function CommentSection({
	initialComments = [],
	currentUserName,
	membersMap = {},
	onSubmit,
	isPending,
	isError,
	error,
}: CommentSectionProps) {
	const [comments, setComments] = useState<IComment[]>(initialComments);
	const [message, setMessage] = useState("");

	useEffect(() => {
		setComments(initialComments);
	}, [initialComments]);

	const handleSubmit = () => {
		const trimmed = message.trim();
		if (!trimmed) return;

		onSubmit(trimmed, () => {
			const newComment: IComment = {
				userId: "me",
				userName: currentUserName || "You",
				message: trimmed,
				createdAt: new Date().toISOString(),
			};
			setComments((prev) => [...prev, newComment]);
			setMessage("");
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			handleSubmit();
		}
	};

	// Resolve display name: userName stored in DB → lookup by userId in membersMap → fallback to userId
	const resolveName = (comment: IComment): string => {
		if (comment.userName?.trim()) return comment.userName;
		if (membersMap[comment.userId]) return membersMap[comment.userId];
		return comment.userId || "Unknown";
	};

	return (
		<div className="space-y-4">
			{/* Section Header */}
			<h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
				<MessageSquare size={16} className="text-indigo-500" />
				Comments ({comments.length})
			</h3>

			{/* Comment List */}
			<div className="space-y-3 max-h-64 overflow-y-auto pr-1">
				{comments.length === 0 ? (
					<p className="text-sm text-gray-400 italic text-center py-4">
						No comments yet. Be the first to comment!
					</p>
				) : (
					comments.map((comment, index) => {
						const name = resolveName(comment);
						return (
							<div
								key={`${comment.userId}-${index}`}
								className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all"
							>
								{/* Avatar */}
								<div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-[11px] font-black text-indigo-700 uppercase shrink-0 border border-white shadow-sm">
									{getInitials(name)}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-baseline gap-2 mb-1">
										<span className="text-xs font-black text-gray-800">
											{name}
										</span>
										<span className="text-[10px] text-gray-400 font-medium">
											{formatTimestamp(comment.createdAt)}
										</span>
									</div>
									<p className="text-sm text-gray-600 font-medium leading-relaxed break-words">
										{comment.message}
									</p>
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* Input area */}
			<div className="space-y-2 pt-1">
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Write a comment… (Ctrl+Enter to submit)"
					rows={3}
					disabled={isPending}
					className="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400 text-sm resize-none disabled:opacity-60 disabled:cursor-not-allowed"
				/>

				{/* Error inline */}
				{isError && (
					<p className="text-xs text-rose-600 font-medium px-1">
						{(error as any)?.response?.data?.message ||
							"Failed to post comment. Please try again."}
					</p>
				)}

				<div className="flex justify-end">
					<button
						onClick={handleSubmit}
						disabled={!message.trim() || isPending}
						className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm"
					>
						{isPending ? (
							<>
								<Loader2 size={15} className="animate-spin" />
								Posting…
							</>
						) : (
							<>
								<Send size={15} />
								Post Comment
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
