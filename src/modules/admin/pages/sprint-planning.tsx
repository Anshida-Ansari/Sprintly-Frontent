import {
	Calendar,
	ChevronDown,
	Circle,
	GripVertical,
	Layers,
	LayoutGrid,
	MoreHorizontal,
	Plus,
	Search,
	Target,
} from "lucide-react";
import { useState } from "react";
import UserStoryDetailModal from "../components/user-story-detail-modal";
import { useProjects } from "../hooks/useProjects";
import {
	useCompleteSprint,
	useGetSprints,
	useStartSprint,
} from "../hooks/useSprints";
import {
	useAssignUserStoryToSprint,
	useGetUserStories,
} from "../hooks/useUserStories";
import { UserStoryStatus } from "../types/types";

export default function SprintPlanningPage() {
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: projectsRes } = useProjects({ limit: 100 });
	const { data: storiesRes } = useGetUserStories(selectedProjectId, {
		limit: 100,
	});
	const { data: sprintsRes } = useGetSprints(selectedProjectId, {
		page: 1,
		limit: 10,
	});

	const assignStory = useAssignUserStoryToSprint();
	const startSprint = useStartSprint(selectedProjectId);
	const completeSprint = useCompleteSprint(selectedProjectId);

	const projects = projectsRes?.data || [];
	const stories = storiesRes?.data || [];
	const sprints = sprintsRes?.data || [];

	const selectedStory = stories.find((s) => s.id === selectedStoryId) || null;

	const backlog = stories
		.filter((s) => !s.sprintId)
		.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const onDragStart = (e: React.DragEvent, storyId: string) => {
		e.dataTransfer.setData("storyId", storyId);
	};

	const onDrop = (e: React.DragEvent, sprintId: string | null) => {
		e.preventDefault();
		const storyId = e.dataTransfer.getData("storyId");
		if (storyId) {
			assignStory.mutate({
				projectId: selectedProjectId,
				userStoryId: storyId,
				sprintId,
			});
		}
	};

	const allowDrop = (e: React.DragEvent) => {
		e.preventDefault();
	};

	return (
		<div className="h-[calc(100vh-2rem)] flex flex-col gap-6 animate-in fade-in duration-500">
			{/* Header */}
			<div className="flex items-center justify-between shrink-0">
				<div>
					<div className="flex items-center gap-3 text-indigo-600 mb-1">
						<Layers size={18} className="stroke-[2.5]" />
						<span className="text-xs font-bold uppercase tracking-wider">
							Sprint Planning
						</span>
					</div>
					<h1 className="text-2xl font-black text-gray-900 tracking-tight">
						Board & Backlog
					</h1>
				</div>

				{/* Project Selector */}
				<div className="relative group">
					<select
						value={selectedProjectId}
						onChange={(e) => setSelectedProjectId(e.target.value)}
						className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 font-bold text-sm text-gray-700 hover:border-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer shadow-sm w-64"
					>
						<option value="">Select Project...</option>
						{projects.map((p) => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
					</select>
					<ChevronDown
						size={16}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors"
					/>
				</div>
			</div>

			{!selectedProjectId ? (
				<div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 m-4">
					<div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
						<LayoutGrid className="text-indigo-200" size={32} />
					</div>
					<h4 className="text-xl font-black text-gray-900 mb-2">
						No Project Selected
					</h4>
					<p className="text-gray-500 font-medium text-center max-w-sm">
						Select a project from the dropdown above to manage your sprints and
						backlog.
					</p>
				</div>
			) : (
				<div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
					{/* Backlog Column */}
					<div className="col-span-12 lg:col-span-4 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
						{/* Backlog Header */}
						<div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
							<div className="flex items-center gap-2">
								<h3 className="font-bold text-gray-800 text-sm">Backlog</h3>
								<span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
									{backlog.length}
								</span>
							</div>
							<div className="relative w-full max-w-[140px]">
								<Search
									size={14}
									className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="text"
									placeholder="Search..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
								/>
							</div>
						</div>

						{/* Backlog List */}
						<div
							className="flex-1 overflow-y-auto p-2 space-y-1"
							onDrop={(e) => onDrop(e, null)}
							onDragOver={allowDrop}
						>
							{backlog.length === 0 ? (
								<div className="h-40 flex flex-col items-center justify-center text-gray-400">
									<p className="text-sm font-medium">Backlog is empty</p>
								</div>
							) : (
								backlog.map((story) => (
									<div
										key={story.id}
										draggable
										onDragStart={(e) => onDragStart(e, story.id)}
										onClick={() => setSelectedStoryId(story.id)}
										className="group flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border border-transparent hover:border-indigo-100 rounded-lg cursor-pointer transition-all select-none"
									>
										<GripVertical
											size={14}
											className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab custom-drag-handle"
										/>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-700 truncate group-hover:text-indigo-700 transition-colors">
												{story.title}
											</p>
											<div className="flex items-center gap-2 mt-0.5">
												<span className="text-[10px] text-gray-400 font-medium">
													{story.id.slice(-4).toUpperCase()}
												</span>
												{story.assignedTo &&
													(Array.isArray(story.assignedTo)
														? story.assignedTo.length > 0
														: !!story.assignedTo) && (
														<div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-600">
															{Array.isArray(story.assignedTo)
																? story.assignedTo.length
																: 1}
														</div>
													)}
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>

					{/* Sprints Column */}
					<div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-2">
						{sprints.map((sprint) => {
							const sprintStories = stories.filter(
								(s) => s.sprintId === sprint._id,
							);
							const isPlanned = sprint.status === "PLANNED";
							const isActive = sprint.status === "ACTIVE";
							const isCompleted = sprint.status === "COMPLETED";

							return (
								<div
									key={sprint._id}
									onDrop={(e) => onDrop(e, sprint._id)}
									onDragOver={allowDrop}
									className={`group rounded-2xl border transition-all ${
										isActive
											? "bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50"
											: "bg-white border-gray-200/60 hover:border-gray-300"
									}`}
								>
									{/* Sprint Header */}
									<div className="p-4 flex items-center justify-between border-b border-gray-50">
										<div className="flex items-center gap-4">
											<button
												onClick={() => {
													/* Toggle collapse if needed */
												}}
												className="p-1 hover:bg-gray-100 rounded text-gray-400 transition"
											>
												<ChevronDown size={16} />
											</button>
											<div>
												<div className="flex items-center gap-3">
													<h3 className="font-bold text-gray-900 text-lg">
														{sprint.name}
													</h3>
													<span
														className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
															isActive
																? "bg-indigo-50 text-indigo-600 border-indigo-100"
																: isCompleted
																	? "bg-emerald-50 text-emerald-600 border-emerald-100"
																	: "bg-gray-100 text-gray-500 border-gray-200"
														}`}
													>
														{sprint.status}
													</span>
												</div>
												<div className="flex items-center gap-4 mt-1 text-xs font-bold text-gray-400">
													<span className="flex items-center gap-1.5">
														<Calendar size={12} />
														{new Date(sprint.startDate).toLocaleDateString()} -{" "}
														{new Date(sprint.endDate).toLocaleDateString()}
													</span>
													<span className="flex items-center gap-1.5">
														<Circle size={8} className="fill-gray-300" />
														{sprintStories.length} issues
													</span>
												</div>
												{sprint.goal && (
													<div className="mt-3 flex items-start gap-2 text-sm text-gray-500 bg-gray-50/80 p-2 rounded-lg border border-gray-100/50">
														<Target
															size={14}
															className="mt-0.5 text-indigo-500 shrink-0"
														/>
														<span className="font-medium leading-snug">
															{sprint.goal}
														</span>
													</div>
												)}
											</div>
										</div>

										<div className="flex items-center gap-2">
											{isPlanned && (
												<button
													onClick={() => startSprint.mutate(sprint._id)}
													disabled={startSprint.isPending}
													className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition flex items-center gap-2 shadow-sm"
												>
													Start Sprint
												</button>
											)}
											{isActive && (
												<button
													onClick={() => completeSprint.mutate(sprint._id)}
													disabled={completeSprint.isPending}
													className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200"
												>
													Complete Sprint
												</button>
											)}
											<button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition">
												<MoreHorizontal size={18} />
											</button>
										</div>
									</div>

									{/* Sprint Stories List */}
									<div className="bg-gray-50/50 min-h-[60px]">
										{sprintStories.length === 0 ? (
											<div className="py-8 flex flex-col items-center justify-center border-dashed border-2 border-transparent group-hover:border-gray-200 transition-colors rounded-b-2xl m-2">
												<p className="text-xs font-bold text-gray-400">
													Drag stories here to plan
												</p>
											</div>
										) : (
											<div className="divide-y divide-gray-100">
												{sprintStories.map((story) => (
													<div
														key={story.id}
														draggable
														onDragStart={(e) => onDragStart(e, story.id)}
														onClick={() => setSelectedStoryId(story.id)}
														className="flex items-center gap-4 px-6 py-3 bg-white hover:bg-gray-50 cursor-pointer transition group/story"
													>
														<GripVertical
															size={14}
															className="text-gray-300 opacity-0 group-hover/story:opacity-100 transition-opacity cursor-grab"
														/>
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium text-gray-700 truncate">
																{story.title}
															</p>
														</div>
														<div className="flex items-center gap-4">
															<span
																className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
																	story.status === UserStoryStatus.DONE
																		? "bg-emerald-50 text-emerald-600"
																		: story.status ===
																				UserStoryStatus.IN_PROGRESS
																			? "bg-blue-50 text-blue-600"
																			: "bg-gray-100 text-gray-500"
																}`}
															>
																{story.status}
															</span>
															{story.assignedTo &&
															(Array.isArray(story.assignedTo)
																? story.assignedTo.length > 0
																: !!story.assignedTo) ? (
																<div className="flex -space-x-1">
																	{/* Single/Multiple Assignee Avatar */}
																	<div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
																		{Array.isArray(story.assignedTo)
																			? story.assignedTo.length
																			: 1}
																	</div>
																</div>
															) : (
																<div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center">
																	<Plus size={10} className="text-gray-400" />
																</div>
															)}
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							);
						})}

						{/* Create Sprint Placeholder/Button */}
						<button
							className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all group"
							onClick={() => {
								/* Add create sprint handler */
							}}
						>
							<Plus
								size={18}
								className="group-hover:scale-110 transition-transform"
							/>
							<span>Create Sprint</span>
						</button>
					</div>
				</div>
			)}

			{/* User Story Detail Modal */}
			{selectedStory && (
				<UserStoryDetailModal
					isOpen={!!selectedStory}
					onClose={() => setSelectedStoryId(null)}
					story={selectedStory}
				/>
			)}
		</div>
	);
}
