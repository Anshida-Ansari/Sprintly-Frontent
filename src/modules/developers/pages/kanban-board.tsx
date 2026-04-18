import {
	CheckCircle2,
	Clock,
	Zap,
	Kanban,
	Flame,
	AlertCircle,
	TrendingUp,
	TrendingDown,
	MessageSquare,
	X,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProjects } from "../../admin/hooks/useProjects";
import { useGetSubtasks, useUpdateSubtaskStatus, useAddSubtaskComment } from "../../admin/hooks/useSubtasks";
import { useAddComment as useAddStoryComment } from "../../admin/hooks/useUserStories";
import { useGetMembers } from "../../admin/hooks/useGetmembers";
import { useGetSprints } from "../../admin/hooks/useSprints";
import { userStoryService } from "../services/userstory.service";
import type { IUserStory, SubtaskStatus, ISubtask } from "../../admin/types/types";
import CommentSection from "../../admin/components/comment-section";
import { UserAuth } from "../../auth/store/store";
import { AttachmentButton } from "../../../shared/components/attachment-button";
import { SecureAttachmentLink } from "../../../shared/components/secure-attachment-link";

export default function KanbanBoard() {
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const [selectedSprintId, setSelectedSprintId] = useState<string>("");
	const { data: projectsRes } = useProjects({ limit: 100 });
	const { data: userStoriesRes, isLoading } = useQuery({
		queryKey: ["my-user-stories"],
		queryFn: () => userStoryService.getMyUserStories(),
	});
	const { data: membersRes } = useGetMembers({ page: 1, limit: 100 });
	const { data: sprintsRes } = useGetSprints(selectedProjectId, { page: 1, limit: 100 });

	const projects = projectsRes?.data || [];
	const allStories = userStoriesRes?.data || [];
	const members = membersRes?.data || [];
	const sprints = sprintsRes?.data || [];

	useEffect(() => {
		if (sprints.length > 0) {
			const activeSprint = sprints.find((s: any) => s.status === "ACTIVE");
			if (activeSprint) {
				setSelectedSprintId(activeSprint.id || (activeSprint as any)._id);
			} else if (!selectedSprintId) {
				// Only clear if no sprint is selected and no active sprint found
				// Or if we want to default to the first one? Let's stay with the first active or empty
				setSelectedSprintId("");
			}
		} else {
			setSelectedSprintId("");
		}
	}, [sprints]);

	const sprintStatusMap = useMemo(() => {
		const map: Record<string, string> = {};
		sprints.forEach((s: any) => {
			const id = s.id || s._id;
			if (id) map[id] = s.status;
		});
		return map;
	}, [sprints]);

	const activeSprintStories = allStories.filter((s: IUserStory) => 
		s.sprintId && 
		(!selectedProjectId || s.projectId === selectedProjectId) &&
		(!selectedSprintId || s.sprintId === selectedSprintId)
	);

	// Build a userId → name map for resolving old comments and initials
	const membersMap: Record<string, string> = {};
	members.forEach((m: any) => {
		const id = m._id || m.id;
		if (id && m.name) membersMap[id] = m.name;
	});

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

					{/* Selectors */}
					<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
						{/* Project Selector */}
						<div className="relative w-full md:w-64">
							<select
								value={selectedProjectId}
								onChange={(e) => {
									setSelectedProjectId(e.target.value);
									setSelectedSprintId(""); // Reset sprint when project changes
								}}
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

						{/* Sprint Selector */}
						<div className="relative w-full md:w-64">
							<select
								value={selectedSprintId}
								onChange={(e) => setSelectedSprintId(e.target.value)}
								disabled={!selectedProjectId}
								className={`w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 font-bold text-gray-900 hover:border-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer shadow-sm text-sm ${!selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''}`}
							>
								<option value="">All Sprints</option>
								{sprints.map((s: any) => (
									<option key={s.id || s._id} value={s.id || s._id}>
										{s.name} {s.status === "ACTIVE" ? "(Active)" : ""}
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
								<Swimlane 
									key={story.id} 
									story={story} 
									columns={columns} 
									membersMap={membersMap} 
									sprintStatusMap={sprintStatusMap}
								/>
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

function Swimlane({ 
	story, 
	columns, 
	membersMap, 
	sprintStatusMap 
}: { 
	story: IUserStory, 
	columns: any[], 
	membersMap: Record<string, string>,
	sprintStatusMap: Record<string, string>
}) {
	const { data: subtasksRes } = useGetSubtasks(story.id);
	const subtasks = subtasksRes?.data || [];
	const updateSubtaskMutation = useUpdateSubtaskStatus(story.id);
	const queryClient = useQueryClient();
	const [showStoryComments, setShowStoryComments] = useState(false);
	const user = UserAuth((state) => state.user);
	const addStoryComment = useAddStoryComment(story.id);

	const sprintStatus = story.sprintId ? sprintStatusMap[story.sprintId] : null;
	const isSprintActive = sprintStatus === "ACTIVE";

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
		if (!isSprintActive) return;
		
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
							{sprintStatus && (
								<span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${
									isSprintActive 
										? 'bg-emerald-100 text-emerald-900 border-emerald-200' 
										: 'bg-gray-100 text-gray-500 border-gray-200'
								}`}>
									Sprint: {sprintStatus}
								</span>
							)}
						</div>
						<h4 className="font-bold text-gray-900 text-lg leading-snug tracking-tight">{story.title}</h4>

						{/* Story Points */}
						{(story as any).estimationPoints && (
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points</span>
								<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black">
									{(story as any).estimationPoints}
								</span>
							</div>
						)}

						{/* Acceptance Criteria */}
						{(story as any).acceptanceCriteria && (story as any).acceptanceCriteria.length > 0 && (
							<div className="mt-1">
								<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Acceptance Criteria</p>
								<ul className="space-y-1">
									{(story as any).acceptanceCriteria.map((c: string, i: number) => (
										<li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
											<CheckCircle2 size={11} className="text-emerald-500 mt-0.5 flex-shrink-0" />
											<span>{c}</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2 text-xs font-bold text-gray-400">
						<div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
							<div
								className="h-full bg-indigo-500 rounded-full transition-all duration-500"
								style={{ width: `${(subtasks.filter((s: any) => s.status === "Done").length / (subtasks.length || 1)) * 100}%` }}
							/>
						</div>
						<span>{subtasks.filter((s: any) => s.status === "Done").length}/{subtasks.length}</span>
					</div>
					<button
						onClick={() => setShowStoryComments(!showStoryComments)}
						className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-indigo-600 uppercase tracking-wider transition-colors"
					>
						<MessageSquare size={12} />
						Story Comments ({story.comments?.length || 0})
					</button>
				</div>
			</div>

			{/* Subtask Columns */}
			<div className="md:col-span-3">
				{showStoryComments && (
					<div className="mb-6 p-6 bg-white rounded-2xl border border-indigo-100 shadow-sm animate-in slide-in-from-top-2 duration-300">
						<CommentSection
							initialComments={story.comments || []}
							currentUserName={user?.name}
							membersMap={membersMap}
							onSubmit={(message, onSuccess) => {
								addStoryComment.mutate(
									{ message },
									{ 
										onSuccess: () => {
											onSuccess();
											queryClient.invalidateQueries({ queryKey: ["my-user-stories"] });
											queryClient.invalidateQueries({ queryKey: ["user-stories"] });
											queryClient.invalidateQueries({ queryKey: ["active-sprint-stories"] });
										}
									}
								);
							}}
							isPending={addStoryComment.isPending}
							isError={addStoryComment.isError}
							error={addStoryComment.error}
						/>
					</div>
				)}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
										membersMap={membersMap}
										isSprintActive={isSprintActive}
									/>
								))}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function SubtaskCard({
	task,
	story,
	onDragStart,
	membersMap,
	isSprintActive,
}: {
	task: ISubtask;
	story: IUserStory;
	onDragStart: (e: React.DragEvent, id: string) => void;
	membersMap: Record<string, string>;
	isSprintActive: boolean;
}) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const estH = task.estimatedHours;
	const actH = task.actualHours;
	const rawVariance = estH !== undefined && actH !== undefined ? actH - estH : null;
	const variance = rawVariance !== null ? parseFloat(rawVariance.toFixed(2)) : null;

	return (
		<>
			<div
				draggable={isSprintActive}
				onDragStart={(e) => isSprintActive && onDragStart(e, task.id)}
				onClick={() => setIsModalOpen(true)}
				className={`bg-white border p-3.5 rounded-xl shadow-sm transition-all group/card flex flex-col gap-3 ${
					isSprintActive 
						? "cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-md border-gray-200" 
						: "opacity-75 cursor-not-allowed border-gray-100 grayscale-[0.5]"
				}`}
			>
				<p className="text-sm font-semibold text-gray-700 group-hover/card:text-gray-900 transition-colors leading-relaxed">
					{task.title}
				</p>

				{/* Hours display — read-only */}
				{(estH !== undefined || actH !== undefined) && (
					<div className="flex flex-wrap items-center gap-1.5">
						{estH !== undefined && (
							<span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded">
								<Clock size={9} />
								Est: {estH}h
							</span>
						)}
						{actH !== undefined && (
							<span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded">
								<Clock size={9} />
								Actual: {parseFloat(actH.toFixed(2))}h
							</span>
						)}
						{variance !== null && (
							<span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
								variance <= 0
									? "bg-emerald-50 text-emerald-700 border-emerald-200"
									: "bg-rose-50 text-rose-700 border-rose-200"
							}`}>
								{variance <= 0 ? <TrendingDown size={9} /> : <TrendingUp size={9} />}
								{variance > 0 ? "+" : ""}{variance}h
							</span>
						)}
					</div>
				)}

				<div className="flex justify-between items-end pt-2 border-t border-gray-50 flex-wrap gap-2">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
								{task.id.slice(-4)}
							</span>
							<div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 group-hover/card:text-indigo-500 transition-colors">
								<MessageSquare size={11} />
								({task.comments?.length || 0})
							</div>
							{/* Upload Button wrapped to stop propagation */}
							<div onClick={(e) => e.stopPropagation()}>
								<AttachmentButton subtaskId={task.id} userStoryId={story.id} variant="icon" />
							</div>
						</div>
						
						{/* Attachments rendering */}
						{(task as any).attachments && (task as any).attachments.length > 0 && (
							<div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 hide-scrollbar" onClick={(e) => e.stopPropagation()}>
								{(task as any).attachments.map((att: any, idx: number) => (
									<SecureAttachmentLink 
										key={idx} 
										fileUrl={att.fileUrl} 
										fileName={att.fileName} 
									/>
								))}
							</div>
						)}
					</div>
					{task.assignedTo && (
						<div 
							className="px-2 py-0.5 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[9px] font-bold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-200 shrink-0"
							title={membersMap[task.assignedTo] || "Assigned"}
						>
							{membersMap[task.assignedTo]?.substring(0, 2) || "A"}
						</div>
					)}
				</div>
			</div>

			{isModalOpen && (
				<SubtaskModal
					task={task}
					story={story}
					membersMap={membersMap}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</>
	);
}

function SubtaskModal({
	task,
	story,
	membersMap,
	onClose,
}: {
	task: ISubtask;
	story: IUserStory;
	membersMap: Record<string, string>;
	onClose: () => void;
}) {
	const user = UserAuth((state) => state.user);
	const addComment = useAddSubtaskComment(story.id);

	const estH = task.estimatedHours;
	const actH = task.actualHours;
	const rawVariance = estH !== undefined && actH !== undefined ? actH - estH : null;
	const variance = rawVariance !== null ? parseFloat(rawVariance.toFixed(2)) : null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
			{/* Overlay */}
			<div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
			
			<div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
				{/* Modal Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-100">
					<div>
						<div className="flex items-center gap-3 mb-1">
							<span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
								{task.id.slice(-4)}
							</span>
							<span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wide">
								{task.status}
							</span>
						</div>
						<h2 className="text-xl font-bold text-gray-900 leading-tight">
							{task.title}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
					>
						<X size={20} />
					</button>
				</div>
				
				{/* Modal Body (Scrollable) */}
				<div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
					{/* Hours and Assignee Section */}
					<div className="flex flex-wrap gap-6">
						<div className="space-y-2">
							<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assignee</h4>
							<div className="flex items-center gap-2">
								{task.assignedTo ? (
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 shadow-sm shrink-0">
											{membersMap[task.assignedTo]?.substring(0, 2) || "A"}
										</div>
										<span className="text-sm font-medium text-gray-700">
											{membersMap[task.assignedTo] || "Unknown"}
										</span>
									</div>
								) : (
									<span className="text-sm text-gray-500 italic">Unassigned</span>
								)}
							</div>
						</div>

						{(estH !== undefined || actH !== undefined) && (
							<div className="space-y-2">
								<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Tracking</h4>
								<div className="flex flex-wrap items-center gap-2">
									{estH !== undefined && (
										<span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">
											<Clock size={12} />
											Est: {estH}h
										</span>
									)}
									{actH !== undefined && (
										<span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg">
											<Clock size={12} />
											Actual: {parseFloat(actH.toFixed(2))}h
										</span>
									)}
									{variance !== null && (
										<span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${
											variance <= 0
												? "bg-emerald-50 text-emerald-700 border-emerald-200"
												: "bg-rose-50 text-rose-700 border-rose-200"
										}`}>
											{variance <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
											{variance > 0 ? "+" : ""}{variance}h
										</span>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Attachments Section */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attachments</h4>
							<AttachmentButton subtaskId={task.id} userStoryId={story.id} variant="icon" />
						</div>
						{(task as any).attachments && (task as any).attachments.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{(task as any).attachments.map((att: any, idx: number) => (
									<SecureAttachmentLink 
										key={idx} 
										fileUrl={att.fileUrl} 
										fileName={att.fileName} 
									/>
								))}
							</div>
						) : (
							<p className="text-sm text-gray-400 italic">No attachments</p>
						)}
					</div>

					{/* Comments Section */}
					<div className="space-y-3 border-t border-gray-100 pt-6">
						<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comments ({task.comments?.length || 0})</h4>
						<div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
							<CommentSection
								initialComments={task.comments || []}
								currentUserName={user?.name}
								membersMap={membersMap}
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
					</div>
				</div>
			</div>
		</div>
	);
}
