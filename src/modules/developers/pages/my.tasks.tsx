import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Kanban, LayoutList, Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { subtaskService } from "../../admin/services/subtask.service";
import type { SubtaskStatus } from "../../admin/types/types";
import { KanbanBoard } from "../components/task.kanban";
import { userStoryService } from "../services/userstory.service";

export default function MyTasksPage() {
	const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
	const queryClient = useQueryClient();

	const {
		data: userStoriesRes,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["my-user-stories"],
		queryFn: () => userStoryService.getMyUserStories(),
	});

	const tasks = userStoriesRes?.data || [];

	const moveTaskMutation = useMutation({
		mutationFn: ({
			taskId,
			newStatus,
		}: {
			taskId: string;
			newStatus: string;
		}) => userStoryService.updateUserStoryStatus(taskId, newStatus),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["my-user-stories"] });
			toast.success("Task status updated");
		},
		onError: () => toast.error("Failed to update status"),
	});

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

	const handleTaskMove = (taskId: string, newStatus: string) => {
		moveTaskMutation.mutate({ taskId, newStatus });
	};

	const handleSubtaskUpdate = (subtaskId: string, status: string) => {
		updateSubtaskMutation.mutate({
			subtaskId,
			status: status as SubtaskStatus,
		});
	};

	return (
		<div className="max-w-7xl mx-auto space-y-8 p-6">
			<div className="flex items-end justify-between">
				<div>
					<h1 className="text-4xl font-black text-white tracking-tight">
						My Tasks
					</h1>
					<p className="text-gray-500 mt-2 font-mono text-sm uppercase tracking-widest">
						Stories with subtasks assigned to you
					</p>
				</div>
				<div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] p-1 rounded-xl">
					<button
						onClick={() => setViewMode("kanban")}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
							viewMode === "kanban"
								? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
								: "text-gray-400 hover:text-white hover:bg-white/[0.05]"
						}`}
					>
						<Kanban size={14} /> Board
					</button>
					<button
						onClick={() => setViewMode("list")}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
							viewMode === "list"
								? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
								: "text-gray-400 hover:text-white hover:bg-white/[0.05]"
						}`}
					>
						<LayoutList size={14} /> List
					</button>
				</div>
			</div>

			{isLoading ? (
				<div className="flex h-96 items-center justify-center">
					<Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
				</div>
			) : tasks.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/[0.05] rounded-[32px] bg-white/[0.01]">
					<div className="p-6 bg-white/[0.03] rounded-full mb-6">
						<Kanban size={32} className="text-gray-500" />
					</div>
					<h3 className="font-bold text-xl text-white">No tasks found</h3>
					<p className="max-w-sm text-center text-gray-500 text-sm mt-2 mb-8">
						You don't have any subtasks assigned to you in active stories yet.
					</p>
					<button
						onClick={() => refetch()}
						className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
					>
						<RefreshCcw size={16} /> Refresh
					</button>
				</div>
			) : (
				<div className="min-h-0">
					{viewMode === "kanban" ? (
						<KanbanBoard
							tasks={tasks}
							onTaskMove={handleTaskMove}
							onSubtaskUpdate={handleSubtaskUpdate}
						/>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{tasks.map((task: any) => (
								<div
									key={task.id}
									className="p-6 bg-white/[0.03] border border-white/[0.05] rounded-3xl hover:border-indigo-500/30 transition-all"
								>
									<div className="flex justify-between items-start mb-4">
										<h4 className="font-bold text-white text-lg leading-snug">
											{task.title}
										</h4>
										<span className="text-[10px] font-black uppercase bg-white/[0.05] text-gray-400 px-2 py-1 rounded">
											{task.status}
										</span>
									</div>
									<p className="text-sm text-gray-500 line-clamp-3 mb-6">
										{task.description}
									</p>
									<div className="text-xs font-mono text-indigo-400">
										{task.subtasks?.length || 0} subtasks found
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
