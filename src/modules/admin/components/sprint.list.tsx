import {
	Calendar,
	CheckCircle2,
	Edit,
	Layers,
	Play,
	Plus,
	Rocket,
	Search,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Pagination } from "../../../shared/components/pagination";
import {
	useCompleteSprint,
	useCreateSprint,
	useDeleteSprint,
	useEditSprint,
	useGetSprints,
	useStartSprint,
} from "../hooks/useSprints.tsx";
import type { ISprint, SprintStatus } from "../types/types.tsx";
import DeleteConfirmationModal from "./delete-confirmation-modal.tsx";
import SprintModal from "./sprint.modal.tsx";

interface SprintRowProps {
	sprint: ISprint;
	onEdit: (sprint: ISprint) => void;
	onDelete: (id: string) => void;
	onStart: (id: string) => void;
	onComplete: (id: string) => void;
	isProcessing: boolean;
	isReadOnly?: boolean;
}

function SprintRow({ sprint, onEdit, onDelete, onStart, onComplete, isProcessing, isReadOnly = false }: SprintRowProps) {
	const isActive = sprint.status === "ACTIVE";
	const isCompleted = sprint.status === "COMPLETED";

	return (
		<div className={`group grid grid-cols-12 gap-4 px-4 py-4 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-default ${isActive ? "bg-gray-50/50" : ""}`}>
			{/* Name & Identifier */}
			<div className="col-span-5 flex items-center gap-3 min-w-0">
				<div className={`w-3 h-3 rounded-full shrink-0 ${isActive ? "bg-black shadow-[0_0_0_2px_rgba(0,0,0,0.1)] ring-2 ring-white" : isCompleted ? "bg-emerald-600" : "bg-gray-300"}`} />
				<div className="flex flex-col min-w-0">
					<span className={`text-sm font-bold truncate ${isActive ? "text-black" : "text-gray-700"}`}>
						{sprint.name}
					</span>
					{sprint.goal && (
						<span className="text-xs text-gray-500 font-medium truncate max-w-[240px] leading-tight mt-0.5">
							{sprint.goal}
						</span>
					)}
				</div>
			</div>

			{/* Status Badge - Bold */}
			<div className="col-span-2 flex items-center">
				<span className={`text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${isActive
					? "bg-black text-white"
					: isCompleted
						? "bg-emerald-100 text-emerald-800"
						: "bg-gray-100 text-gray-600"
					}`}>
					{sprint.status === "ACTIVE" ? "Current" : sprint.status === "COMPLETED" ? "Done" : "Planned"}
				</span>
			</div>

			{/* Date Range */}
			<div className="col-span-3 text-xs text-gray-900 font-bold tracking-tight flex items-center gap-2">
				<Calendar size={14} className="text-gray-400 stroke-[2.5]" />
				<span>
					{new Date(sprint.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
					<span className="mx-1.5 text-gray-300">/</span>
					{new Date(sprint.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
				</span>
			</div>

			{/* Actions - Hover Only */}
			{!isReadOnly && (
				<div className="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					{sprint.status === "PLANNED" && (
						<button
							onClick={(e) => { e.stopPropagation(); onStart(sprint._id); }}
							disabled={isProcessing}
							className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-lg transition-all"
							title="Start Sprint"
						>
							<Play size={14} className="fill-current" />
						</button>
					)}
					{isActive && (
						<button
							onClick={(e) => { e.stopPropagation(); onComplete(sprint._id); }}
							disabled={isProcessing}
							className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
							title="Complete Sprint"
						>
							<CheckCircle2 size={16} strokeWidth={2.5} />
						</button>
					)}

					<button
						onClick={(e) => { e.stopPropagation(); onEdit(sprint); }}
						className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-lg transition-all"
						title="Edit"
					>
						<Edit size={14} strokeWidth={2.5} />
					</button>

					{(sprint.status === "PLANNED" || sprint.status === "COMPLETED") && (
						<button
							onClick={(e) => { e.stopPropagation(); onDelete(sprint._id); }}
							className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
							title="Delete"
						>
							<Trash2 size={14} strokeWidth={2.5} />
						</button>
					)}
				</div>
			)}
		</div>
	);
}

interface SprintListProps {
	projectId: string;
	projectStartDate?: string | Date;
	projectEndDate?: string | Date;
	isReadOnly?: boolean;
}

export default function SprintList({
	projectId,
	projectStartDate,
	projectEndDate,
	isReadOnly = false,
}: SprintListProps) {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<SprintStatus | undefined>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSprint, setSelectedSprint] = useState<ISprint | undefined>();

	// Delete Modal State
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [sprintToDelete, setSprintToDelete] = useState<string | null>(null);

	const { data: sprintsResponse, isLoading } = useGetSprints(projectId, {
		page,
		limit: 10,
		search,
		status: statusFilter,
	});

	const createMutation = useCreateSprint(projectId);
	const editMutation = useEditSprint(projectId);
	const startMutation = useStartSprint(projectId);
	const completeMutation = useCompleteSprint(projectId);
	const deleteMutation = useDeleteSprint(projectId);

	const sprints = sprintsResponse?.data || [];
	const totalPages = sprintsResponse?.totalPages || 1;

	const handleOpenCreate = () => {
		setSelectedSprint(undefined);
		setIsModalOpen(true);
	};

	const handleOpenEdit = (sprint: ISprint) => {
		setSelectedSprint(sprint);
		setIsModalOpen(true);
	};

	const handleDeleteClick = (sprintId: string) => {
		setSprintToDelete(sprintId);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = () => {
		if (sprintToDelete) {
			deleteMutation.mutate(sprintToDelete, {
				onSuccess: () => {
					setIsDeleteModalOpen(false);
					setSprintToDelete(null);
				},
			});
		}
	};

	const handleSubmit = (data: any) => {
		if (selectedSprint) {
			editMutation.mutate(
				{ sprintId: selectedSprint._id, payload: data },
				{
					onSuccess: () => setIsModalOpen(false),
				},
			);
		} else {
			createMutation.mutate(data, {
				onSuccess: () => setIsModalOpen(false),
			});
		}
	};




	return (
		<div className="space-y-8">
			{/* Action Bar */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 p-2 rounded-[24px] border border-gray-100">
				<div className="flex flex-1 gap-3 w-full md:max-w-2xl">
					<div className="relative flex-1">
						<Search
							className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
							size={20}
						/>
						<input
							type="text"
							placeholder="Search sprints..."
							className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400 shadow-sm"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className="relative w-48 hidden md:block">
						<select
							value={statusFilter || ""}
							onChange={(e) =>
								setStatusFilter((e.target.value as SprintStatus) || undefined)
							}
							className="w-full pl-5 pr-10 py-4 bg-white border border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-700 cursor-pointer appearance-none shadow-sm"
						>
							<option value="">All Statuses</option>
							<option value="PLANNED">Planned</option>
							<option value="ACTIVE">Active</option>
							<option value="COMPLETED">Completed</option>
						</select>
						<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
							<Rocket size={16} />
						</div>
					</div>
				</div>
				{!isReadOnly && (
					<button
						onClick={handleOpenCreate}
						className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform active:scale-95 whitespace-nowrap"
					>
						<Plus size={20} className="stroke-[3]" />
						Create Sprint
					</button>
				)}
			</div>

			{/* Sprint List Content */}
			<div className="flex flex-col">
				{/* Table Header */}
				<div className="grid grid-cols-12 gap-4 px-4 py-3 border-b-2 border-gray-100 text-[11px] font-black text-gray-900 uppercase tracking-wider select-none bg-white">
					<div className="col-span-5 pl-1">Sprint Name</div>
					<div className="col-span-2">Status</div>
					<div className="col-span-3">Timeline</div>
					<div className="col-span-2 text-right">Actions</div>
				</div>

				{isLoading ? (
					<div className="py-20 flex justify-center">
						<div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
					</div>
				) : sprints.length === 0 ? (
					<div className="py-16 text-center">
						<div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 mb-3">
							<Layers size={20} className="text-gray-400" />
						</div>
						<h3 className="text-sm font-medium text-gray-900">No sprints found</h3>
						<p className="text-xs text-gray-500 mt-1 mb-4">Get started by planning your first sprint.</p>
						{!isReadOnly && (
							<button
								onClick={handleOpenCreate}
								className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
							>
								+ Create Sprint
							</button>
						)}
					</div>
				) : (
					<div className="divide-y divide-gray-50">
						{sprints.map((sprint) => (
							<SprintRow
								key={sprint._id}
								sprint={sprint}
								onEdit={handleOpenEdit}
								onDelete={handleDeleteClick}
								onStart={(id) => startMutation.mutate(id)}
								onComplete={(id) => completeMutation.mutate(id)}
								isProcessing={startMutation.isPending || completeMutation.isPending || deleteMutation.isPending}
							/>
						))}
					</div>
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center pt-8">
					<Pagination
						currentPage={page}
						totalPages={totalPages}
						onPageChange={setPage}
					/>
				</div>
			)}

			<SprintModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleSubmit}
				sprint={selectedSprint}
				isLoading={createMutation.isPending || editMutation.isPending}
				minDate={
					projectStartDate
						? new Date(projectStartDate).toISOString()
						: undefined
				}
				maxDate={
					projectEndDate ? new Date(projectEndDate).toISOString() : undefined
				}
			/>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleConfirmDelete}
				title="Delete Sprint"
				message="Are you sure you want to delete this sprint? All associated data will be permanently removed. This action cannot be undone."
				isLoading={deleteMutation.isPending}
			/>
		</div>
	);
}
