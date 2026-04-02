import { format } from "date-fns";
import {
	AlertCircle,
	CalendarDays,
	CheckCircle2,
	Clock,
	Loader2,
	MessageCircle,
	Send,
	UserCircle2
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
		<div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
			{/* Header */}
			<div className="flex items-start justify-between mb-8">
				<div className="flex items-center gap-5">
					<div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-200/50 border-[3px] border-white ring-4 ring-indigo-50 group-hover:scale-105 transition-transform duration-300">
						{standup.user.name.charAt(0).toUpperCase()}
					</div>
					<div>
						<h4 className="flex items-center gap-3 font-black text-2xl text-gray-900 tracking-tight">
							{standup.user.name}
							<span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">Developer</span>
						</h4>
						<div className="flex items-center gap-3 text-sm font-bold text-gray-400 mt-2">
							<div className="flex items-center gap-1.5 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100">
								<CalendarDays size={14} className="text-gray-400" />
								{format(new Date(standup.createdAt), "MMM d, yyyy")}
							</div>
							<div className="flex items-center gap-1.5 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100">
								<Clock size={14} className="text-gray-400" />
								{format(new Date(standup.createdAt), "h:mm a")}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content Grid */}
			<div className="grid gap-5 relative pl-2 md:pl-4">
				{/* Decorative Timeline Line */}
				<div className="absolute left-10 md:left-12 top-8 bottom-8 w-1 bg-gray-100/80 -z-10 rounded-full hidden md:block" />

				{/* Yesterday */}
				<div className="relative flex flex-col md:flex-row gap-4 md:gap-8 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-3xl p-6 border border-emerald-100/40 transition-colors shadow-sm">
					<div className="flex items-center gap-4 min-w-[150px] shrink-0">
						<div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border-[4px] border-white z-10">
							<CheckCircle2 size={24} className="stroke-[2.5]" />
						</div>
						<h5 className="font-black text-emerald-700 uppercase tracking-widest text-[13px]">Yesterday</h5>
					</div>
					<p className="text-gray-700 text-[15px] font-medium leading-relaxed whitespace-pre-wrap flex-1 pt-1 md:pt-4">
						{standup.yesterday}
					</p>
				</div>

				{/* Today */}
				<div className="relative flex flex-col md:flex-row gap-4 md:gap-8 bg-blue-50/40 hover:bg-blue-50/70 rounded-3xl p-6 border border-blue-100/40 transition-colors shadow-sm">
					<div className="flex items-center gap-4 min-w-[150px] shrink-0">
						<div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border-[4px] border-white z-10">
							<Clock size={24} className="stroke-[2.5]" />
						</div>
						<h5 className="font-black text-blue-700 uppercase tracking-widest text-[13px]">Today</h5>
					</div>
					<p className="text-gray-700 text-[15px] font-medium leading-relaxed whitespace-pre-wrap flex-1 pt-1 md:pt-4">
						{standup.today}
					</p>
				</div>

				{/* Blockers */}
				{standup.blockers && (
					<div className="relative flex flex-col md:flex-row gap-4 md:gap-8 bg-rose-50/40 hover:bg-rose-50/70 rounded-3xl p-6 border border-rose-100/40 transition-colors shadow-sm">
						<div className="flex items-center gap-4 min-w-[150px] shrink-0">
							<div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm border-[4px] border-white z-10">
								<AlertCircle size={24} className="stroke-[2.5]" />
							</div>
							<h5 className="font-black text-rose-700 uppercase tracking-widest text-[13px]">Blockers</h5>
						</div>
						<p className="text-gray-700 text-[15px] font-medium leading-relaxed whitespace-pre-wrap flex-1 pt-1 md:pt-4">
							{standup.blockers}
						</p>
					</div>
				)}
			</div>

			{/* Comments Section Toggle */}
			<div className="mt-10 pt-6 border-t border-gray-100">
				<button 
					onClick={() => setIsExpanded(!isExpanded)}
					className={`flex items-center gap-2 text-sm font-bold transition-colors ${
						isExpanded ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
					}`}
				>
					<div className={`p-2 rounded-xl bg-gray-50 flex items-center justify-center ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500 group-hover:bg-indigo-50'}`}>
						<MessageCircle size={18} />
					</div>
					{standup.comments && standup.comments.length > 0 
						? `${standup.comments.length} Comments` 
						: "Add a comment"}
				</button>

				{isExpanded && (
					<div className="mt-6 space-y-5 animate-in slide-in-from-top-4 fade-in duration-300">
						{standup.comments && standup.comments.length > 0 && (
							<div className="space-y-5 bg-gray-50/80 p-6 md:p-8 rounded-[2rem] border border-gray-100">
								{standup.comments.map((comment, index) => (
									<div key={comment._id} className={`flex gap-5 ${index !== standup.comments!.length - 1 ? 'pb-5 border-b border-gray-200/80' : ''}`}>
										<div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 font-black text-lg shrink-0">
											{comment.user.name.charAt(0).toUpperCase()}
										</div>
										<div className="flex-1 pt-1">
											<div className="flex items-center gap-2 mb-1">
												<span className="font-black text-gray-900 text-sm">
													{comment.user.name}
												</span>
												<span className="text-xs font-bold text-gray-400">
													{format(new Date(comment.createdAt), "h:mm a")}
												</span>
											</div>
											<p className="text-gray-600 text-sm font-medium leading-relaxed">{comment.message}</p>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Add Comment Input */}
						<CommentInput
							projectId={projectId}
							sprintId={sprintId}
							standupId={standup._id}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

// Sub-component for comment input to manage local state cleanly
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
			<div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
				<UserCircle2 size={22} className="stroke-[2.5]" />
			</div>
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Write a reply..."
				className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-[1.5rem] py-4.5 pl-14 pr-16 text-sm font-bold text-gray-700 transition-all outline-none shadow-sm"
			/>
			<button
				type="submit"
				disabled={!message.trim() || isPending}
				className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
			>
				{isPending ? (
					<Loader2 size={18} className="animate-spin" />
				) : (
					<Send size={18} className="translate-x-[1px] translate-y-[1px]" />
				)}
			</button>
		</form>
	);
}
