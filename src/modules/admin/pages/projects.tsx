import { LayoutGrid, Plus } from "lucide-react";
import { useState } from "react";
import CreateProjectModal from "../components/create.project.modal";
import EditProjectModal from "../components/edit.project.modal";
import ProjectCard from "../components/project.card";
import { useCreateProject } from "../hooks/useCreateProject";
import { useEditProject } from "../hooks/useEditProject";
import { useProjects } from "../hooks/useProjects";
import type {
	CreateProjectPayload,
	EditProjectPayload,
	IProject,
} from "../types/types";

export default function Projects() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<IProject | null>(null);

	const { mutate: createProject, isPending: isCreating } = useCreateProject();
	const { mutate: updateProject, isPending: isUpdating } = useEditProject();

	const [page, setPage] = useState(1);
	const limit = 6;

	const {
		data: projectData,
		isLoading,
		isPlaceholderData,
	} = useProjects({ page, limit });

	const handleCreateProject = (data: CreateProjectPayload) => {
		createProject(data, {
			onSuccess: () => setIsModalOpen(false),
		});
	};

	const handleEditProject = (data: EditProjectPayload) => {
		updateProject(data, {
			onSuccess: () => {
				setIsEditModalOpen(false);
				setEditingProject(null);
			},
		});
	};

	const openEditModal = (project: IProject) => {
		setEditingProject(project);
		setIsEditModalOpen(true);
	};

	const projectsByStatus = {
		active: projectData?.data.filter((p) => p.status === "Active") || [],
		completed: projectData?.data.filter((p) => p.status === "Completed") || [],
	};

	const StatusColumn = ({
		title,
		projects,
		color,
	}: {
		title: string;
		projects: IProject[];
		color: string;
	}) => (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between mb-2">
				<h3 className="font-bold text-gray-700">{title}</h3>
				<span
					className={`px-2 py-0.5 rounded-md text-xs font-bold ${color} bg-opacity-10 text-opacity-80`}
				>
					{projects.length}
				</span>
			</div>
			<div className="space-y-4">
				{projects.map((project) => (
					<ProjectCard
						key={project.id}
						project={project}
						onEdit={openEditModal}
					/>
				))}
				{projects.length === 0 && (
					<div className="h-24 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm font-medium">
						No projects
					</div>
				)}
			</div>
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto space-y-8 h-[calc(100vh-100px)] flex flex-col">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">
						Projects
					</h1>
					<p className="text-gray-500 font-medium">
						Manage and track all your ongoing projects.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 transition">
						<LayoutGrid size={20} />
					</button>

					<button
						onClick={() => setIsModalOpen(true)}
						className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
					>
						<Plus size={20} />
						New Project
					</button>
				</div>
			</div>

			{/* Kanban Board */}
			{isLoading ? (
				<div className="flex-1 flex items-center justify-center">
					<div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : (
				<div className="flex-1 overflow-x-auto pb-8 flex flex-col">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-[600px] flex-1">
						<StatusColumn
							title="Active"
							projects={projectsByStatus.active}
							color="bg-emerald-500 text-emerald-600"
						/>
						<StatusColumn
							title="Completed"
							projects={projectsByStatus.completed}
							color="bg-blue-500 text-blue-600"
						/>
					</div>

					{/* Pagination Controls */}
					<div className="flex items-center justify-between pt-6 mt-auto border-t border-gray-100">
						<span className="text-sm text-gray-500">
							Page {projectData?.page} of{" "}
							{Math.ceil((projectData?.total || 0) / limit)}
						</span>
						<div className="flex gap-2">
							<button
								onClick={() => setPage((old) => Math.max(old - 1, 1))}
								disabled={page === 1}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>
							<button
								onClick={() => {
									if (
										!isPlaceholderData &&
										projectData?.data.length === limit
									) {
										setPage((old) => old + 1);
									}
								}}
								disabled={
									isPlaceholderData ||
									!projectData?.data ||
									projectData.data.length < limit
								}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
							</button>
						</div>
					</div>
				</div>
			)}

			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleCreateProject}
				isLoading={isCreating}
			/>

			<EditProjectModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onSubmit={handleEditProject}
				project={editingProject}
				isLoading={isUpdating}
			/>
		</div>
	);
}
