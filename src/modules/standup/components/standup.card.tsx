import { format } from "date-fns";
import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Loader2,
	MessageCircle,
	Send,
} from "lucide-react";
import { useState } from "react";
import { useAddComment } from "../hooks/useAddCommnet";
import type { Standup } from "../types/standup.types";

interface StandupCardProps {
	standup: Standup;
	projectId: string;
	sprintId: string;
}

export const StandupCard = ({
	standup,
	projectId,
	sprintId,
}: StandupCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden group">
			<div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-50">
				{/* User Info - Highly Compact */}
				<div className="p-4 md:p-6 bg-gray-50/30 flex items-center md:flex-col md:items-center gap-3 md:gap-4 md:w-32 shrink-0">
					<div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm md:text-lg shadow-sm border border-white shrink-0">
						{standup.user.name.charAt(0).toUpperCase()}
					</div>
					<div className="flex-1 md:text-center min-w-0">
						<h4 className="font-black text-gray-900 text-xs tracking-tight truncate">
							{standup.user.name.split(" ")[0]}
						</h4>
						<p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
							{format(new Date(standup.createdAt), "h:mm a")}
						</p>
					</div>
					{standup.blockers && (
						<div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
					)}
				</div>

				{/* Content Sections - 3 Column Grid */}
				<div className="flex-1 p-4 md:p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Yesterday */}
						<div className="group/section relative pl-4">
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full opacity-30 group-hover/section:opacity-100 transition-opacity" />
							<h5 className="font-black text-emerald-700 uppercase tracking-widest text-[9px] mb-2 flex items-center gap-2">
								<CheckCircle2 size={10} />
								Yesterday
							</h5>
							<p className="text-gray-600 text-[13px] font-medium leading-relaxed line-clamp-3 group-hover/section:line-clamp-none transition-all">
								{standup.yesterday}
							</p>
						</div>

						{/* Today */}
						<div className="group/section relative pl-4">
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full opacity-30 group-hover/section:opacity-100 transition-opacity" />
							<h5 className="font-black text-indigo-700 uppercase tracking-widest text-[9px] mb-2 flex items-center gap-2">
								<Clock size={10} />
								Focus
							</h5>
							<p className="text-gray-800 text-[13px] font-bold leading-relaxed line-clamp-3 group-hover/section:line-clamp-none transition-all">
								{standup.today}
							</p>
						</div>

						{/* Blockers */}
						<div className="group/section relative pl-4">
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-full opacity-30 group-hover/section:opacity-100 transition-opacity" />
							<h5 className="font-black text-rose-700 uppercase tracking-widest text-[9px] mb-2 flex items-center gap-2">
								<AlertCircle size={10} />
								Blockers
							</h5>
							<p className={`text-[13px] leading-relaxed line-clamp-3 group-hover/section:line-clamp-none transition-all ${
								standup.blockers ? 'text-rose-600 font-bold' : 'text-gray-300 font-medium italic'
							}`}>
								{standup.blockers || "No blockers"}
							</p>
						</div>
					</div>

					{/* Actions Area - Highly Compact */}
					<div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
						<button 
							onClick={() => setIsExpanded(!isExpanded)}
							className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
								isExpanded ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'
							}`}
						>
							<MessageCircle size={12} />
							{standup.comments && standup.comments.length > 0 
								? `${standup.comments.length} Threads` 
								: "Discuss"}
						</button>
						
						<div className="flex -space-x-1">
							<div className="w-5 h-5 rounded-full border border-white bg-indigo-100 flex items-center justify-center text-[8px] font-black text-indigo-600 shadow-sm">
								{standup.user.name.charAt(0)}
							</div>
						</div>
					</div>

					{isExpanded && (
						<div className="mt-4 space-y-4 animate-in slide-in-from-top-1 fade-in duration-300">
							{standup.comments && standup.comments.length > 0 && (
								<div className="space-y-4 relative pl-3 border-l border-gray-100">
									{standup.comments.map((comment) => (
										<div key={comment._id} className="flex gap-3 relative">
											<div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 font-black text-[10px] shrink-0">
												{comment.user.name.charAt(0).toUpperCase()}
											</div>
											<div className="flex-1 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
												<div className="flex items-center gap-2 mb-0.5">
													<span className="font-black text-gray-900 text-[11px]">
														{comment.user.name.split(" ")[0]}
													</span>
													<span className="text-[9px] font-bold text-gray-400">
														{format(new Date(comment.createdAt), "h:mm a")}
													</span>
												</div>
												<p className="text-gray-600 text-[11px] font-medium leading-snug">{comment.message}</p>
											</div>
										</div>
									))}
								</div>
							)}

							<CommentInput
								projectId={projectId}
								sprintId={sprintId}
								standupId={standup._id}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

function CommentInput({
	projectId,
	sprintId,
	standupId,
}: {
	projectId: string;
	sprintId: string;
	standupId: string;
}) {
	const [message, setMessage] = useState("");
	const { mutate, isPending } = useAddComment(projectId, sprintId);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		mutate(
			{ standupId, message },
			{
				onSuccess: () => setMessage(""),
			},
		);
	};

	return (
		<form onSubmit={handleSubmit} className="relative mt-4">
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Share your thoughts..."
				className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl py-3.5 pl-5 pr-12 text-sm font-bold text-gray-700 transition-all outline-none shadow-sm"
			/>
			<button
				type="submit"
				disabled={!message.trim() || isPending}
				className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-30"
			>
				{isPending ? (
					<Loader2 size={18} className="animate-spin" />
				) : (
					<Send size={18} />
				)}
			</button>
		</form>
	);
}
