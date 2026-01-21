import { useState } from "react";
import { Plus, Calendar, Edit, Search, Rocket, CheckCircle2, Clock, Trash2, Play } from "lucide-react";
import { useGetSprints, useCreateSprint, useEditSprint, useStartSprint, useCompleteSprint, useDeleteSprint } from "../hooks/useSprints.tsx";
import SprintModal from "./sprint.modal.tsx";
import DeleteConfirmationModal from "./delete-confirmation-modal.tsx";
import { Pagination } from "../../../shared/components/pagination";
import type { ISprint, SprintStatus } from "../types/types.tsx";

interface SprintListProps {
    projectId: string;
    projectStartDate?: string | Date;
    projectEndDate?: string | Date;
}

export default function SprintList({ projectId, projectStartDate, projectEndDate }: SprintListProps) {
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
        status: statusFilter
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
                }
            });
        }
    };

    const handleSubmit = (data: any) => {
        if (selectedSprint) {
            editMutation.mutate({ sprintId: selectedSprint._id, payload: data }, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            createMutation.mutate(data, {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const getStatusIcon = (status: SprintStatus) => {
        switch (status) {
            case 'ACTIVE': return <Rocket size={18} className="text-indigo-500" />;
            case 'COMPLETED': return <CheckCircle2 size={18} className="text-emerald-500" />;
            default: return <Clock size={18} className="text-gray-400" />;
        }
    };

    const getStatusStyle = (status: SprintStatus) => {
        switch (status) {
            case 'ACTIVE': return "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-100";
            case 'COMPLETED': return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 p-2 rounded-[24px] border border-gray-100">
                <div className="flex flex-1 gap-3 w-full md:max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
                            onChange={(e) => setStatusFilter(e.target.value as SprintStatus || undefined)}
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
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform active:scale-95 whitespace-nowrap"
                >
                    <Plus size={20} className="stroke-[3]" />
                    Create Sprint
                </button>
            </div>

            {/* Sprint Grid/List */}
            {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold animate-pulse">Loading sprints...</p>
                </div>
            ) : sprints.length === 0 ? (
                <div className="py-24 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                        <Calendar className="text-indigo-200" size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">No Sprints Found</h3>
                    <p className="text-gray-400 font-bold mb-8 max-w-xs">Start planning your next iteration by creating a new sprint.</p>
                    <button
                        onClick={handleOpenCreate}
                        className="px-8 py-3 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black hover:border-indigo-200 hover:text-indigo-600 transition shadow-sm"
                    >
                        Create First Sprint
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5">
                    {sprints.map((sprint) => (
                        <div
                            key={sprint._id}
                            className="group bg-white border border-gray-100 rounded-[32px] p-6 hover:shadow-xl hover:shadow-gray-200/40 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                    <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3 ${getStatusStyle(sprint.status)}`}>
                                        {getStatusIcon(sprint.status)}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                                {sprint.name}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(sprint.status)}`}>
                                                {sprint.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-500 text-sm font-bold">
                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                                <Calendar size={14} className="text-indigo-500" />
                                                <span>{new Date(sprint.startDate).toLocaleDateString()}</span>
                                                <span className="text-gray-300">-</span>
                                                <span>{new Date(sprint.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end md:self-center bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
                                    {sprint.status === 'PLANNED' && (
                                        <button
                                            onClick={() => startMutation.mutate(sprint._id)}
                                            disabled={startMutation.isPending}
                                            className="p-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-indigo-100 hover:border-indigo-200 shadow-sm disabled:opacity-50"
                                            title="Start Sprint"
                                        >
                                            <Play size={20} className="fill-current" />
                                        </button>
                                    )}
                                    {sprint.status === 'ACTIVE' && (
                                        <button
                                            onClick={() => completeMutation.mutate(sprint._id)}
                                            disabled={completeMutation.isPending}
                                            className="p-3 bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-emerald-100 hover:border-emerald-200 shadow-sm disabled:opacity-50"
                                            title="Complete Sprint"
                                        >
                                            <CheckCircle2 size={20} />
                                        </button>
                                    )}
                                    <div className="w-px h-8 bg-gray-200 mx-1"></div>
                                    <button
                                        onClick={() => handleOpenEdit(sprint)}
                                        className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                                        title="Edit Sprint"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    {(sprint.status === 'PLANNED' || sprint.status === 'COMPLETED') && (
                                        <button
                                            onClick={() => handleDeleteClick(sprint._id)}
                                            disabled={deleteMutation.isPending}
                                            className="p-3 text-gray-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all hover:shadow-sm disabled:opacity-50"
                                            title="Delete Sprint"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Decorative background */}
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-50 to-transparent rounded-full -mr-32 -mt-32 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none`}></div>
                        </div>
                    ))}
                </div>
            )}

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
                minDate={projectStartDate ? new Date(projectStartDate).toISOString() : undefined}
                maxDate={projectEndDate ? new Date(projectEndDate).toISOString() : undefined}
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
