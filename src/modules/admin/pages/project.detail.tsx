import {
	Calendar,
	CheckCircle2,
	Clock,
	Edit,
	GitBranch,
	Layout,
	MoreHorizontal,
	PlayCircle,
	Plus,
	ScrollText,
	Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../../auth/store/store";
import { StandupChat } from "../../standup/components/standup.chat";
import AddMemberModal from "../components/add.member.modal";
import EditProjectModal from "../components/edit.project.modal";
import SprintList from "../components/sprint.list";
import UserStoryList from "../components/user-story-list";
import { useEditProject } from "../hooks/useEditProject";
import { useGetProject } from "../hooks/useGetProject";
import type { EditProjectPayload, IMember } from "../types/types";

interface ProjectDetailProps {
	isReadOnly?: boolean;
}

export default function ProjectDetail({ isReadOnly = false }: ProjectDetailProps) {
	const { projectId } = useParams<{ projectId: string }>();
	const navigate = useNavigate();
	const { data: projectResponse, isLoading } = useGetProject(projectId || "");
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
	const { mutate: updateProject, isPending: isUpdating } = useEditProject();
	const user = UserAuth((state) => state.user);
	const [activeTab, setActiveTab] = useState<
		"overview" | "stories" | "sprints" | "standups"
	>("overview");

	const project = projectResponse?.data;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full min-h-[400px]">
				<div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
				<p className="text-gray-500 font-medium">Project not found.</p>
				<button
					onClick={() => navigate(isReadOnly ? "/developers/dashboard" : "/admin/projects")}
					className="px-4 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-lg transition"
				>
					Back to Dashboard
				</button>
			</div>
		);
	}

	const handleEditProject = (data: EditProjectPayload) => {
		updateProject(data, {
			onSuccess: () => {
				setIsEditModalOpen(false);
			},
		});
	};

	// --- Helpers & Visuals ---

	const statusColors = {
		Active: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
		Completed: "bg-blue-500/10 text-blue-700 ring-blue-500/20",
		OnHold: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
	};

	const formatDate = (dateString?: string | Date) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Mock Activity Feed (since real feed logic might need backend support, we derive basic events)
	const activityFeed = [
		{
			id: "1",
			type: "created",
			title: "Project Created",
			date: project.createdAt,
			icon: <Plus size={16} />,
			color: "bg-white text-indigo-600 ring-1 ring-indigo-100",
		},
		{
			id: "2",
			type: "started",
			title: `Project Started`,
			date: project.startDate,
			icon: <PlayCircle size={16} />,
			color: "bg-white text-emerald-600 ring-1 ring-emerald-100",
		},
		...(project.endDate
			? [
				{
					id: "3",
					type: "deadline",
					title: `Target Deadline`,
					date: project.endDate,
					isFuture: new Date(project.endDate) > new Date(),
					icon: <Calendar size={16} />,
					color: "bg-white text-rose-600 ring-1 ring-rose-100",
				},
			]
			: []),
	].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	return (
		<div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500 font-sans text-gray-900">
			{/* --- Header Section --- */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-30 pt-8 pb-0 px-8 -mx-8 mb-8 backdrop-blur-xl bg-white/80 supports-[backdrop-filter]:bg-white/60">
				<div className="flex flex-col gap-6 max-w-7xl mx-auto">
					{/* Breadcrumb / Back */}
					<div className="flex items-center justify-between">
						<nav className="flex items-center gap-2 text-sm text-gray-500 font-medium">
							<span
								onClick={() => navigate(isReadOnly ? "/developers/dashboard" : "/admin/projects")}
								className="hover:text-gray-900 cursor-pointer transition-colors"
							>
								{isReadOnly ? "Dashboard" : "Projects"}
							</span>
							<span className="text-gray-300">/</span>
							<span className="text-gray-900">{project.name}</span>
						</nav>
						{!isReadOnly && (
							<button
								onClick={() => setIsEditModalOpen(true)}
								className="text-gray-500 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
								title="Project Settings"
							>
								<MoreHorizontal size={20} />
							</button>
						)}
					</div>

					{/* Title & Actions */}
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
								{project.name.charAt(0).toUpperCase()}
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
									{project.name}
									<span
										className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusColors[
											project.status as keyof typeof statusColors
										] || "bg-gray-100 text-gray-600 ring-gray-200"
											}`}
									>
										{project.status}
									</span>
								</h1>
								<p className="text-gray-500 text-sm mt-1 max-w-2xl text-ellipsis overflow-hidden whitespace-nowrap">
									{project.description || "No description provided."}
								</p>
							</div>
						</div>

						{/* Actions - Hide for ReadOnly */}
						{!isReadOnly && (user?.role === "admin" || user?.role === "lead") && (
							<div className="flex items-center gap-3">
								<button
									onClick={() => setIsEditModalOpen(true)}
									className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
								>
									<Edit size={16} />
									Edit Project
								</button>
								<button
									className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
									onClick={() => setActiveTab('sprints')} // Quick action
								>
									<PlayCircle size={16} />
									Active Sprint
								</button>
							</div>
						)}
					</div>

					{/* Tabs */}
					<div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
						{[
							{ id: "overview", label: "Overview", icon: Layout },
							{ id: "stories", label: "User Stories", icon: ScrollText },
							{ id: "sprints", label: "Sprints", icon: PlayCircle },
							{ id: "standups", label: "Standups", icon: CheckCircle2 },
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as any)}
								className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
									? "text-indigo-600 border-b-2 border-indigo-600"
									: "text-gray-500 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-200"
									}`}
							>
								<tab.icon size={16} />
								{tab.label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* --- Content Area --- */}
			<div className="px-4 md:px-0">
				{activeTab === "overview" && (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2 duration-500">
						{/* Left Column: Activity & Details */}
						<div className="lg:col-span-2 space-y-8">
							{/* About / Context */}
							<section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
								<h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<Layout size={18} className="text-gray-400" />
									About this project
								</h3>
								<div className="text-gray-600 leading-relaxed text-sm">
									{project.description ? (
										<p>{project.description}</p>
									) : (
										<span className="text-gray-400 italic">No description</span>
									)}
								</div>

								{project.gitRepoUrl && (
									<div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
										<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
											<GitBranch size={16} className="text-gray-600" />
										</div>
										<div>
											<p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Repository</p>
											<a href={project.gitRepoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:underline break-all">
												{project.gitRepoUrl}
											</a>
										</div>
									</div>
								)}
							</section>

							{/* Activity Feed / Timeline */}
							<section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
								<h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
									<Clock size={18} className="text-gray-400" />
									Project Timeline
								</h3>
								<div className="relative pl-4 space-y-8">
									{/* Vertical line */}
									<div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />

									{activityFeed.map((item) => (
										<div key={item.id} className="relative pl-8 group">
											<div
												className={`absolute left-0 w-6 h-6 rounded-full border-2 border-white ${item.color} flex items-center justify-center shadow-sm z-10 bg-white`}
											>
												{item.icon}
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-semibold text-gray-900">
													{item.title}
												</span>
												<span className="text-xs text-gray-500 mt-0.5">
													{formatDate(item.date)}
												</span>
											</div>
										</div>
									))}
								</div>
							</section>
						</div>

						{/* Right Column: Members & Stats */}
						<div className="space-y-6">
							{/* Team Members */}
							<div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-fit">
								<div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
									<h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
										<Users size={16} className="text-gray-500" />
										Team Members
										<span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
											{project.members?.length || 0}
										</span>
									</h3>
									{/* Hide Add Member for ReadOnly */}
									{!isReadOnly && (user?.role === "admin" || user?.role === "lead") && (
										<button
											onClick={() => setIsAddMemberModalOpen(true)}
											className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-md transition-colors"
											title="Add Member"
										>
											<Plus size={16} />
										</button>
									)}
								</div>

								<div className="p-2 overflow-y-auto">
									{project.members && project.members.length > 0 ? (
										<div className="space-y-1">
											{project.members.map((member: IMember) => (
												<div
													key={member.id || member._id}
													className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
												>
													<div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200 shrink-0">
														{member.name?.substring(0, 2).toUpperCase() || "??"}
													</div>
													<div className="overflow-hidden flex-1 min-w-0">
														<p className="text-sm font-medium text-gray-900 truncate">
															{member.name || "Unknown User"}
														</p>
														<div className="flex items-center gap-2">
															<span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
																{member.role || "MEMBER"}
															</span>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="p-8 text-center text-gray-400 text-sm">
											No members assigned
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === "stories" && (
					<div className="animate-in slide-in-from-right-4 duration-500">
						<UserStoryList projectId={project.id} members={project.members} showHeader={false} isReadOnly={isReadOnly} />
					</div>
				)}

				{activeTab === "sprints" && (
					<div className="animate-in slide-in-from-right-4 duration-500">
						<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
							<SprintList
								projectId={projectId || ""}
								projectStartDate={project.startDate}
								projectEndDate={project.endDate}
								isReadOnly={isReadOnly}
							/>
						</div>
					</div>
				)}
				{activeTab === "standups" && (
					<div className="animate-in slide-in-from-right-4 duration-500 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
						<div>
							<h2 className="text-lg font-bold text-gray-900">
								Daily Standups
							</h2>
							<p className="text-sm text-gray-500">
								Team daily updates for the active sprint
							</p>
						</div>
						<div className="h-[600px] border border-gray-100 rounded-xl overflow-hidden">
							<StandupChat
								projectId={projectId || ""}
								sprintId={project.activeSprintId}
								userRole={isReadOnly ? "developer" : "admin"}
							/>
						</div>
					</div>
				)}
			</div>

			<EditProjectModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onSubmit={handleEditProject}
				project={project}
				isLoading={isUpdating}
			/>

			<AddMemberModal
				isOpen={isAddMemberModalOpen}
				onClose={() => setIsAddMemberModalOpen(false)}
				projectId={projectId || ""}
				currentMembers={project?.members || []}
			/>
		</div>
	);
}
