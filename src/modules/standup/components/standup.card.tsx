import { useState } from "react";
import type { Standup } from "../types/standup.types";
import { User, Calendar, CheckCircle2, AlertCircle, Clock, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useAddComment } from "../hooks/useAddCommnet";

interface StandupCardProps {
    standup: Standup;
    projectId: string;
    sprintId: string;
}

export const StandupCard = ({ standup, projectId, sprintId }: StandupCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-50">
                        {standup.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="flex items-center gap-2 font-bold text-gray-900">
                            {standup.user.name}
                            {/* You might want to add a role badge here if available */}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                            <Calendar size={12} />
                            {format(new Date(standup.createdAt), "MMM d, yyyy")}
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <Clock size={12} />
                            {format(new Date(standup.createdAt), "h:mm a")}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-4">
                {/* Yesterday */}
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                    <h5 className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider mb-2">
                        <CheckCircle2 size={14} />
                        Yesterday
                    </h5>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {standup.yesterday}
                    </p>
                </div>

                {/* Today */}
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                    <h5 className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-wider mb-2">
                        <Clock size={14} />
                        Today
                    </h5>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {standup.today}
                    </p>
                </div>

                {/* Blockers */}
                {standup.blockers && (
                    <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100/50">
                        <h5 className="flex items-center gap-2 text-xs font-black text-rose-600 uppercase tracking-wider mb-2">
                            <AlertCircle size={14} />
                            Blockers
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {standup.blockers}
                        </p>
                    </div>
                )}

            </div>

            {/* Comments Section */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                {standup.comments && standup.comments.length > 0 && (
                    <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                        {standup.comments.map((comment) => (
                            <div key={comment._id} className="text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900">{comment.user.name}</span>
                                    <span className="text-xs text-gray-400">{format(new Date(comment.createdAt), "h:mm a")}</span>
                                </div>
                                <p className="text-gray-600">{comment.message}</p>
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
        </div>
    );
};

// Sub-component for comment input to manage local state cleanly
function CommentInput({ projectId, sprintId, standupId }: { projectId: string, sprintId: string, standupId: string }) {
    const [message, setMessage] = useState("");
    const { mutate, isPending } = useAddComment(projectId, sprintId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        mutate({ standupId, message }, {
            onSuccess: () => setMessage("")
        });
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-xl py-3 px-4 pr-12 text-sm transition-all outline-none"
            />
            <button
                type="submit"
                disabled={!message.trim() || isPending}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
        </form>
    );
}
