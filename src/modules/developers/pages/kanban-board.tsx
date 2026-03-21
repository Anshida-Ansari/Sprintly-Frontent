import {
	CheckCircle2,
	Clock,
	Zap,
	Kanban,
	Flame,
	AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProjects } from "../../admin/hooks/useProjects";
import { useGetSubtasks, useUpdateSubtaskStatus, useUpdateSubtaskTime, useAddSubtaskComment } from "../../admin/hooks/useSubtasks";
import { userStoryService } from "../services/userstory.service";
import type { IUserStory, SubtaskStatus, ISubtask } from "../../admin/types/types";
import CommentSection from "../../admin/components/comment-section";
import { UserAuth } from "../../auth/store/store";

export default function KanbanBoard() {
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const { data: projectsRes } = useProjects({ limit: 100 });
	const { data: userStoriesRes, isLoading } = useQuery({
		queryKey: ["my-user-stories"],
		queryFn: () => userStoryService.getMyUserStories(),
	});

	const projects = projectsRes?.data || [];
	const allStories = userStoriesRes?.data || [];
	const activeSprintStories = allStories.filter((s: IUserStory) => s.sprintId);

	const columns = [
		{ id: "In pending", title: "To Do", icon: Clock, color: "gray", status: "In pending" as SubtaskStatus },
		{ id: "In progress", title: "In Progress", icon: Zap, color: "indigo", status: "In progress" as SubtaskStatus },
		{ id: "Done", title: "Done", icon: CheckCircle2, color: "emerald", status: "Done" as SubtaskStatus },
	];

	return (
		<div className="min-h-screen bg-slate-50 p-6 space-y-8 animate-in fade-in duration-500">
			<div className="max-w-[1600px] mx-auto space-y-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-indigo-600">
							<Kanban size={20} className="stroke-[2.5]" />
							<span className="text-xs font-bold uppercase tracking-wider">
								Active Sprint
							</span>
						</div>
						<div>
							<h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
								Kanban Board
							</h1>
							<p className="text-lg text-gray-500 font-medium mt-1">
								Track and manage subtasks across user stories
							</p>
						</div>
					</div>

					{/* Project Selector */}
					<div className="relative w-full md:w-72">
						<select
							value={selectedProjectId}
							onChange={(e) => setSelectedProjectId(e.target.value)}
							className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 font-bold text-gray-900 hover:border-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer shadow-sm text-sm"
						>
							<option value="">Select Project...</option>
							{projects.map((p: any) => (
								<option key={p.id} value={p.id}>
									{p.name}
								</option>
							))}
						</select>
						<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
							<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
					</div>
				</div>

				{!selectedProjectId ? (
					<div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border-2 border-dashed border-gray-200">
						<div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
							<Kanban className="text-indigo-500" size={40} />
						</div>
						<h4 className="text-xl font-bold text-gray-900 mb-2">
							No Project Selected
						</h4>
						<p className="text-gray-500 font-medium text-center max-w-sm">
							Please select a project from the dropdown above to view its active board.
						</p>
					</div>
				) : isLoading ? (
					<div className="flex justify-center py-32">
						<div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
					</div>
				) : (
					<div className="space-y-6">
						{/* Board Headers */}
						<div className="hidden md:grid grid-cols-4 gap-6 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm sticky top-0 z-10">
							<div className="col-span-1 flex items-center text-gray-400 font-bold text-xs uppercase tracking-wider">
								User Story
							</div>
							<div className="col-span-3 grid grid-cols-3 gap-6">
								{columns.map(col => (
									<div key={col.id} className="flex items-center gap-2">
										<div className={`p-1.5 rounded-lg bg-${col.color}-50 text-${col.color}-600`}>
											<col.icon size={14} />
										</div>
										<span className="text-gray-500 font-bold text-xs uppercase tracking-wider">
											{col.title}
										</span>
									</div>
								))}
							</div>
						</div>

						<div className="space-y-4">
							{activeSprintStories.map((story: IUserStory) => (
								<Swimlane key={story.id} story={story} columns={columns} />
							))}
							{activeSprintStories.length === 0 && (
								<div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
									<p className="text-gray-500 font-bold text-lg">
										No active stories found in this sprint.
									</p>
									<p className="text-gray-400 text-sm mt-1">
										Try selecting a different project or add stories to the current sprint.
									</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function Swimlane({ story, columns }: { story: IUserStory, columns: any[] }) {
	const { data: subtasksRes } = useGetSubtasks(story.id);
	const subtasks = subtasksRes?.data || [];
	const updateSubtaskMutation = useUpdateSubtaskStatus(story.id);
	const updateSubtaskTimeMutation = useUpdateSubtaskTime(story.id);
	const queryClient = useQueryClient();

	const getPriorityStyle = (priority: string) => {
		switch (priority) {
			case "High": return "bg-rose-50 text-rose-700 border-rose-100";
			case "Medium": return "bg-amber-50 text-amber-700 border-amber-100";
			default: return "bg-emerald-50 text-emerald-700 border-emerald-100";
		}
	};
	const getPriorityIcon = (priority: string) => {
		switch (priority) {
			case "High": return <Flame size={12} />;
			case "Medium": return <AlertCircle size={12} />;
			default: return <CheckCircle2 size={12} />;
		}
	};

	const onDragStart = (e: React.DragEvent, subtaskId: string) => {
		e.dataTransfer.setData("subtaskId", subtaskId);
	};

	const onDrop = (e: React.DragEvent, targetStatus: SubtaskStatus) => {
		e.preventDefault();
		const subtaskId = e.dataTransfer.getData("subtaskId");
		if (subtaskId) {
			updateSubtaskMutation.mutate(
				{ subtaskId, status: targetStatus },
				{
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: ["active-sprint-stories"] });
					}
				}
			);
		}
	};

	const allowDrop = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const isReview = story.status === "In review";

	return (
		<div className={`grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-3xl border transition-all duration-300 shadow-sm ${isReview ? 'bg-amber-50/50 border-amber-200 shadow-amber-100/50' : 'bg-white border-gray-100 hover:shadow-md hover:border-indigo-100'
			}`}>
			{/* Story Info (Swimlane Header) */}
			<div className="md:col-span-1 space-y-4">
				<div className="flex items-start gap-3">
					<div className="flex-1 space-y-2">
						<div className="flex flex-wrap items-center gap-2">
							<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${getPriorityStyle(story.priority)}`}>
								{getPriorityIcon(story.priority)}
								{story.priority}
							</span>
							{isReview && (
								<span className="inline-flex items-center px-2.5 py-1 rounded-lg border bg-amber-100 text-amber-900 border-amber-200 text-[10px] font-black uppercase tracking-wide">
									In Review
								</span>
							)}
						</div>
						<h4 className="font-bold text-gray-900 text-lg leading-snug tracking-tight">{story.title}</h4>
					</div>
				</div>
				<div className="flex items-center gap-2 text-xs font-bold text-gray-400">
					<div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
						<div
							className="h-full bg-indigo-500 rounded-full transition-all duration-500"
							style={{ width: `${(subtasks.filter((s: any) => s.status === "Done").length / (subtasks.length || 1)) * 100}%` }}
						/>
					</div>
					<span>{subtasks.filter((s: any) => s.status === "Done").length}/{subtasks.length}</span>
				</div>
			</div>

			{/* Subtask Columns */}
			<div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
				{columns.map((col: any) => {
					const colSubtasks = subtasks.filter((s: any) => s.status === col.status);

					return (
						<div
							key={col.id}
							onDrop={(e) => onDrop(e, col.status)}
							onDragOver={allowDrop}
							className="bg-gray-50/50 border border-gray-100 rounded-2xl p-3 min-h-[140px] flex flex-col gap-3 transition-colors hover:bg-gray-50/80 group/col relative"
						>
							{/* Column Mobile Header */}
							<div className="md:hidden flex items-center gap-2 mb-1 text-gray-400 text-xs font-bold uppercase">
								<col.icon size={12} />
								{col.title}
							</div>

							{/* Dropzone Hint */}
							{colSubtasks.length === 0 && (
								<div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs font-medium opacity-0 group-hover/col:opacity-100 transition-opacity pointer-events-none">
									Drop here
								</div>
							)}

							{/* Cards */}
							{colSubtasks.map((task: any) => (
								<SubtaskCard
									key={task.id}
									task={task}
									story={story}
									onDragStart={onDragStart}
									updateSubtaskTimeMutation={updateSubtaskTimeMutation}
								/>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function SubtaskCard({
	task,
	story,
	onDragStart,
	updateSubtaskTimeMutation,
}: {
	task: ISubtask;
	story: IUserStory;
	onDragStart: (e: React.DragEvent, id: string) => void;
	updateSubtaskTimeMutation: any;
}) {
	const [showComments, setShowComments] = useState(false);
	const user = UserAuth((state) => state.user);
	const addComment = useAddSubtaskComment(story.id);

	return (
		<div
			draggable
			onDragStart={(e) => onDragStart(e, task.id)}
			className="bg-white border border-gray-200 p-3.5 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-md transition-all group/card flex flex-col gap-3"
		>
			<p className="text-sm font-semibold text-gray-700 group-hover/card:text-gray-900 transition-colors leading-relaxed">
				{task.title}
			</p>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
					<Clock size={12} className="text-gray-400" />
					<input
						type="number"
						min="0"
						step="0.5"
						className="w-10 text-xs bg-transparent text-gray-700 font-bold focus:outline-none placeholder:text-gray-400"
						title="Actual Hours"
						placeholder="0h"
						defaultValue={task.actualHours || ""}
						onBlur={(e) => {
							if (e.target.value !== "") {
								const newVal = Number(e.target.value);
								if (newVal !== task.actualHours) {
									updateSubtaskTimeMutation.mutate({
										subtaskId: task.id,
										payload: { actualHours: newVal },
									});
								}
							}
						}}
					/>
				</div>
				{task.estimatedHours !== undefined && (
					<span
						className="text-[10px] text-gray-500 font-medium px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200"
						title="Estimated Hours"
					>
						Est: {task.estimatedHours}h
					</span>
				)}
			</div>

			<div className="flex justify-between items-center pt-2 border-t border-gray-50">
				<div className="flex items-center gap-2">
					<span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
						{task.id.slice(-4)}
					</span>
					<button
						onClick={() => setShowComments(!showComments)}
						className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
					>
						Comments ({task.comments?.length || 0})
					</button>
				</div>
				{task.assignedTo && (
					<div className="w-5 h-5 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-sm">
						{/* Initials or Avatar */}A
					</div>
				)}
			</div>

			{showComments && (
				<div className="pt-2 border-t border-gray-50 cursor-default" onDragStart={(e) => e.preventDefault()} draggable={true}>
					<CommentSection
						initialComments={task.comments || []}
						currentUserName={user?.name}
						onSubmit={(message, onSuccess) => {
							addComment.mutate(
								{ subtaskId: task.id, message },
								{ onSuccess }
							);
						}}
						isPending={addComment.isPending}
						isError={addComment.isError}
						error={addComment.error}
					/>
				</div>
			)}
		</div>
	);
}
