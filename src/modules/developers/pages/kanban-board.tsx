import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Flame,
	GripVertical,
	Kanban,
	Zap,
} from "lucide-react";
import { useState } from "react";
import UserStoryDetailModal from "../../admin/components/user-story-detail-modal";
import { useProjects } from "../../admin/hooks/useProjects";
import { useGetSubtasks } from "../../admin/hooks/useSubtasks.tsx";
import type { IUserStory } from "../../admin/types/types";
import { UserAuth } from "../../auth/store/store";
import {
	useGetActiveSprintStories,
	useUpdateUserStoryStatus,
} from "../hooks/useUserStories.tsx";

export default function KanbanBoard() {
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const [selectedStory, setSelectedStory] = useState<IUserStory | null>(null);
	const { data: projectsRes } = useProjects({ limit: 100 });
	const { data: storiesRes, isLoading } =
		useGetActiveSprintStories(selectedProjectId);
	const updateStatus = useUpdateUserStoryStatus(selectedProjectId);

	const user = UserAuth((state) => state.user);
	const isDeveloper = user?.role === "developers";

	const projects = projectsRes?.data || [];
	const allStories = storiesRes?.data || [];

	const activeSprintStories = allStories.filter((s) => s.sprintId);

	const columns = [
		{ id: "In pending", title: "To Do", icon: Clock, color: "gray" },
		{ id: "In progress", title: "In Progress", icon: Zap, color: "indigo" },
		{ id: "In review", title: "In Review", icon: AlertCircle, color: "amber" },
		{ id: "Done", title: "Done", icon: CheckCircle2, color: "emerald" },
	];

	const getStoriesByStatus = (status: string) => {
		return activeSprintStories.filter((s) => s.status === status);
	};

	const getPriorityStyle = (priority: string) => {
		switch (priority) {
			case "High":
				return "bg-rose-500/10 text-rose-400 border-rose-500/20";
			case "Medium":
				return "bg-amber-500/10 text-amber-400 border-amber-500/20";
			default:
				return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
		}
	};

	const getPriorityIcon = (priority: string) => {
		switch (priority) {
			case "High":
				return <Flame size={12} className="text-rose-400" />;
			case "Medium":
				return <AlertCircle size={12} className="text-amber-400" />;
			default:
				return <CheckCircle2 size={12} className="text-emerald-400" />;
		}
	};

	const onDragStart = (e: React.DragEvent, story: IUserStory) => {
		e.dataTransfer.setData("storyId", story.id);
		e.dataTransfer.setData("currentStatus", story.status);
	};

	const onDrop = (e: React.DragEvent, targetStatus: string) => {
		e.preventDefault();
		const storyId = e.dataTransfer.getData("storyId");
		const currentStatus = e.dataTransfer.getData("currentStatus");

		if (isDeveloper && targetStatus === "Done") {
			return;
		}

		if (storyId && currentStatus !== targetStatus) {
			updateStatus.mutate({ userStoryId: storyId, status: targetStatus });
		}
	};

	const allowDrop = (e: React.DragEvent) => {
		e.preventDefault();
	};

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3 text-indigo-400 mb-2">
					<Kanban size={20} className="stroke-[3]" />
					<span className="text-xs font-black uppercase tracking-[0.2em]">
						Active Sprint
					</span>
				</div>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-black text-white tracking-tight">
							Kanban Board
						</h1>
						<p className="text-lg text-gray-400 font-medium">
							Manage your active sprint tasks
						</p>
					</div>

					{/* Project Selector */}
					<div className="relative">
						<select
							value={selectedProjectId}
							onChange={(e) => setSelectedProjectId(e.target.value)}
							className="appearance-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-3 pr-12 font-bold text-white hover:border-indigo-500/30 transition-all focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
						>
							<option value="">Select Project</option>
							{projects.map((p) => (
								<option
									key={p.id}
									value={p.id}
									className="bg-[#08080A] text-white"
								>
									{p.name}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{!selectedProjectId ? (
				<div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] rounded-[48px] border border-white/[0.05]">
					<div className="w-24 h-24 bg-white/[0.03] rounded-3xl shadow-sm flex items-center justify-center mb-6">
						<Kanban className="text-indigo-500/30" size={48} />
					</div>
					<h4 className="text-2xl font-black text-white mb-2">
						No Project Selected
					</h4>
					<p className="text-gray-400 font-bold text-center max-w-sm">
						Please select a project from the dropdown above to view your active
						sprint board.
					</p>
				</div>
			) : isLoading ? (
				<div className="flex justify-center py-20">
					<div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{columns.map((column) => {
						const Icon = column.icon;
						const stories = getStoriesByStatus(column.id);
						const isDisabled = isDeveloper && column.id === "Done";

						return (
							<div
								key={column.id}
								onDrop={(e) => onDrop(e, column.id)}
								onDragOver={allowDrop}
								className={`rounded-[32px] border transition-all ${
									isDisabled
										? "border-white/[0.03] bg-white/[0.01] opacity-50"
										: "border-white/[0.05] bg-white/[0.02]"
								} min-h-[600px] flex flex-col`}
							>
								{/* Column Header */}
								<div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div
											className={`p-2 rounded-xl bg-${column.color}-500/10 border border-${column.color}-500/20`}
										>
											<Icon size={18} className={`text-${column.color}-400`} />
										</div>
										<div>
											<h3 className="font-black text-white text-lg">
												{column.title}
											</h3>
											<p className="text-xs text-gray-500 font-bold">
												{stories.length} stories
											</p>
										</div>
									</div>
									{isDisabled && (
										<div className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
											Admin Only
										</div>
									)}
								</div>

								{/* Story Cards */}
								<div className="flex-1 p-4 space-y-3 overflow-y-auto">
									{stories.map((story) => (
										<StoryCard
											key={story.id}
											story={story}
											isDisabled={isDisabled}
											onDragStart={onDragStart}
											onClick={() => setSelectedStory(story)}
											getPriorityStyle={getPriorityStyle}
											getPriorityIcon={getPriorityIcon}
										/>
									))}
									{stories.length === 0 && (
										<div className="py-20 text-center">
											<p className="text-sm font-bold text-gray-600">
												No stories here
											</p>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* User Story Detail Modal */}
			{selectedStory && (
				<UserStoryDetailModal
					isOpen={!!selectedStory}
					onClose={() => setSelectedStory(null)}
					story={selectedStory}
				/>
			)}
		</div>
	);
}

// Story Card Component with Real Subtask Data
function StoryCard({
	story,
	isDisabled,
	onDragStart,
	onClick,
	getPriorityStyle,
	getPriorityIcon,
}: any) {
	const { data: subtasksRes } = useGetSubtasks(story.id);
	const subtasks = subtasksRes?.data || [];

	const completedCount = subtasks.filter(
		(s: any) => s.status === "completed",
	).length;
	const totalCount = subtasks.length;
	const progressPercent =
		totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	return (
		<div
			draggable={!isDisabled}
			onDragStart={(e) => onDragStart(e, story)}
			onClick={onClick}
			className={`p-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all group ${
				!isDisabled ? "cursor-pointer" : "cursor-not-allowed"
			}`}
		>
			<div className="flex items-start gap-3 mb-3">
				{!isDisabled && (
					<GripVertical
						size={16}
						className="text-gray-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
					/>
				)}
				<div className="flex-1">
					<h4 className="font-bold text-sm text-white leading-snug mb-2">
						{story.title}
					</h4>
					<div className="flex items-center gap-2">
						<span
							className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border flex items-center gap-1 ${getPriorityStyle(story.priority)}`}
						>
							{getPriorityIcon(story.priority)}
							{story.priority}
						</span>
					</div>
				</div>
			</div>

			{/* Subtask Progress - Real Data */}
			{totalCount > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between text-xs">
						<span className="text-gray-400 font-bold">Subtasks</span>
						<span className="text-gray-300 font-black">
							{completedCount}/{totalCount}
						</span>
					</div>
					<div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
