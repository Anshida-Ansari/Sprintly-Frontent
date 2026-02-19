import { Loader2, MessageSquare, Plus, X } from "lucide-react";
import { useState } from "react";
import { useListStandups } from "../hooks/useListStandup";
import { StandupCard } from "./standup.card";
import { StandupForm } from "./standup.form";

interface StandupChatProps {
	projectId: string;
	sprintId: string;
	userRole?: "admin" | "developer";
}

export const StandupChat = ({
	projectId,
	sprintId,
	userRole = "developer",
}: StandupChatProps) => {
	const { data: standups, isLoading } = useListStandups(projectId, sprintId);
	const [showForm, setShowForm] = useState(false);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-white relative">
			{/* Header */}
			<div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
						<MessageSquare size={24} />
					</div>
					<div>
						<h3 className="text-lg font-black text-gray-900 tracking-tight">Standup Updates</h3>
						<p className="text-sm font-bold text-gray-500">
							{standups?.length || 0} updates this sprint
						</p>
					</div>
				</div>

				{userRole === "developer" && !showForm && (
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95"
					>
						<Plus size={18} />
						<span>Post Update</span>
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
				{/* Form Section - Collapsible */}
				{showForm && (
					<div className="mb-8 animate-in slide-in-from-top-4 duration-300">
						<div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-[24px] border border-gray-200 shadow-sm relative">
							<button
								onClick={() => setShowForm(false)}
								className="absolute top-4 right-4 p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-600"
							>
								<X size={20} />
							</button>
							<h4 className="font-black text-gray-900 mb-6 text-lg">
								Submit Daily Standup
							</h4>
							<StandupForm
								projectId={projectId}
								sprintId={sprintId}
								onClose={() => setShowForm(false)}
							/>
						</div>
					</div>
				)}

				{/* Standup List */}
				{standups && standups.length > 0 ? (
					<div className="space-y-6 max-w-3xl mx-auto">
						{standups.map((standup) => (
							<StandupCard
								key={standup._id}
								standup={standup}
								projectId={projectId}
								sprintId={sprintId}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-[400px] text-center">
						<div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-300 border border-gray-100">
							<MessageSquare size={32} />
						</div>
						<h3 className="text-xl font-black text-gray-900 mb-2">No updates yet</h3>
						<p className="text-gray-500 font-medium max-w-xs mx-auto text-sm leading-relaxed">
							Be the first to share your progress with the team for this sprint.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
