import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Loader2,
	Plus,
	Flame,
	RefreshCcw,
	X
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { subtaskService } from "../../admin/services/subtask.service";
import type { SubtaskStatus } from "../../admin/types/types";
import { userStoryService } from "../services/userstory.service";

export default function MyTasksPage() {
	const queryClient = useQueryClient();
	const [expandedStories, setExpandedStories] = useState<string[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
	const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

	const {
		data: userStoriesRes,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["my-user-stories"],
		queryFn: () => userStoryService.getMyUserStories(),
	});

	const stories = userStoriesRes?.data || [];

	const updateSubtaskMutation = useMutation({
		mutationFn: ({
			subtaskId,
			status,
		}: {
			subtaskId: string;
			status: SubtaskStatus;
		}) => subtaskService.updateSubtaskStatus(subtaskId, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["my-user-stories"] });
			toast.success("Subtask updated");
		},
		onError: () => toast.error("Failed to update subtask"),
	});

	const createSubtaskMutation = useMutation({
		mutationFn: ({ userStoryId, title }: { userStoryId: string; title: string }) =>
			subtaskService.createSubtask(userStoryId, { title }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["my-user-stories"] });
			toast.success("Subtask created");
			setIsCreateModalOpen(false);
			setNewSubtaskTitle("");
			setSelectedStoryId(null);
		},
		onError: () => toast.error("Failed to create subtask"),
	});

	const handleSubtaskUpdate = (subtaskId: string, currentStatus: SubtaskStatus) => {

		let nextStatus: SubtaskStatus = "In pending";
		if (currentStatus === "In pending") nextStatus = "In progress";
		else if (currentStatus === "In progress") nextStatus = "Done";

		updateSubtaskMutation.mutate({
			subtaskId,
			status: nextStatus,
		});
	};

	const toggleStoryExpand = (storyId: string) => {
		setExpandedStories(prev =>
			prev.includes(storyId) ? prev.filter(id => id !== storyId) : [...prev, storyId]
		);
	};

	const openCreateModal = (storyId: string) => {
		setSelectedStoryId(storyId);
		setIsCreateModalOpen(true);
	};

	const getPriorityStyle = (priority: string) => {
		switch (priority) {
			case "High": return "bg-rose-50 text-rose-700 border-rose-200";
			case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
			default: return "bg-emerald-50 text-emerald-700 border-emerald-200";
		}
	};

	const getPriorityIcon = (priority: string) => {
		switch (priority) {
			case "High": return <Flame size={12} />;
			case "Medium": return <AlertCircle size={12} />;
			default: return <CheckCircle2 size={12} />;
		}
	};

	return (
		<div className="max-w-5xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
			<div className="flex items-end justify-between">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">
						My Plan
					</h1>
					<p className="text-gray-500 mt-2 text-lg">
						Keep track of your assigned stories and subtasks.
					</p>
				</div>
				<button
					onClick={() => refetch()}
					className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
					title="Refresh"
				>
					<RefreshCcw size={20} />
				</button>
			</div>

			{isLoading ? (
				<div className="flex h-64 items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
				</div>
			) : stories.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
					<div className="p-4 bg-white rounded-full shadow-sm mb-4">
						<CheckCircle2 size={32} className="text-gray-400" />
					</div>
					<h3 className="font-bold text-lg text-gray-900">All caught up!</h3>
					<p className="text-gray-500 text-sm mt-1">
						You don't have any active stories assigned to you.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{stories.map((story: any) => {
						const subtasks = story.subtasks || [];
						const completedCount = subtasks.filter((s: any) => s.status === "Done").length;
						const totalCount = subtasks.length;
						const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
						const isExpanded = expandedStories.includes(story.id);

						const isReview = story.status === "In review";

						return (
							<div
								key={story.id}
								className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isReview ? 'border-amber-200 shadow-amber-100 ring-1 ring-amber-100' : 'border-gray-100 hover:border-indigo-200 hover:shadow-md'}`}
							>
								{/* Header / Accordion Trigger */}
								<div
									onClick={() => toggleStoryExpand(story.id)}
									className={`p-6 cursor-pointer flex items-center gap-4 ${isReview ? 'bg-amber-50/30' : ''}`}
								>
									<div className={`p-1 rounded-lg transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}>
										{isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-3 mb-1">
											<h3 className="font-bold text-gray-900 truncate">
												{story.title}
											</h3>
											<div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityStyle(story.priority)}`}>
												{getPriorityIcon(story.priority)}
												<span>{story.priority}</span>
											</div>
											{isReview && (
												<span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200">
													In Review
												</span>
											)}
										</div>
										<div className="flex items-center gap-4 text-xs font-medium text-gray-500">
											<span>{story.status}</span>
											<span className="text-gray-300">•</span>
											<span>{totalCount} subtasks</span>
										</div>
									</div>

									{/* Progress */}
									<div className="w-32 hidden md:block">
										<div className="flex justify-between text-[10px] font-bold mb-1.5 ">
											<span className="text-gray-500">Progress</span>
											<span className="text-indigo-600">{progress}%</span>
										</div>
										<div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-indigo-500 transition-all duration-500"
												style={{ width: `${progress}%` }}
											/>
										</div>
									</div>

									<button
										onClick={(e) => {
											e.stopPropagation();
											openCreateModal(story.id);
										}}
										className="ml-2 p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-2"
									>
										<Plus size={16} />
										<span className="hidden sm:inline">Add Subtask</span>
									</button>
								</div>

								{/* Body / Subtasks */}
								{isExpanded && (
									<div className="border-t border-gray-100 bg-gray-50/50 p-4 pl-16 space-y-2">
										{subtasks.length > 0 ? (
											subtasks.map((subtask: any) => (
												<div
													key={subtask.id}
													onClick={() => handleSubtaskUpdate(subtask.id, subtask.status)}
													className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors cursor-pointer group"
												>
													<div className={`
                                                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                                        ${subtask.status === 'Done' ? 'bg-emerald-500 border-emerald-500' :
															subtask.status === 'In progress' ? 'border-indigo-500 border-dashed' : 'border-gray-300'}
                                                    `}>
														{subtask.status === 'Done' && <CheckCircle2 size={12} className="text-white" />}
														{subtask.status === 'In progress' && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
													</div>

													<span className={`text-sm font-medium transition-colors flex-1 ${subtask.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
														{subtask.title}
													</span>

													<span className={`
                                                        text-[10px] font-bold uppercase px-2 py-0.5 rounded border
                                                        ${subtask.status === 'Done' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
															subtask.status === 'In progress' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-100 text-gray-500 border-gray-200'}
                                                    `}>
														{subtask.status}
													</span>
												</div>
											))
										) : (
											<div className="text-sm text-gray-400 italic py-2">
												No subtasks yet. Click "Add Subtask" to get started.
											</div>
										)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}

			{/* Create Subtask Modal */}
			{isCreateModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
					<div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-bold text-gray-900">Create Subtask</h3>
							<button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-900">
								<X size={20} />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
								<input
									type="text"
									value={newSubtaskTitle}
									onChange={(e) => setNewSubtaskTitle(e.target.value)}
									placeholder="What needs to be done?"
									autoFocus
									className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors font-medium"
									onKeyDown={(e) => e.key === "Enter" && selectedStoryId && newSubtaskTitle.trim() && createSubtaskMutation.mutate({ userStoryId: selectedStoryId, title: newSubtaskTitle })}
								/>
							</div>

							<div className="flex gap-3 pt-2">
								<button
									onClick={() => setIsCreateModalOpen(false)}
									className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={() => selectedStoryId && createSubtaskMutation.mutate({ userStoryId: selectedStoryId, title: newSubtaskTitle })}
									disabled={!newSubtaskTitle.trim() || createSubtaskMutation.isPending}
									className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{createSubtaskMutation.isPending ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Create Subtask"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
