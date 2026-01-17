import { useState } from "react";
import { Plus, Calendar, Edit, MoreVertical, Search, Filter, Rocket, CheckCircle2, Clock, Trash2, Play } from "lucide-react";
import { useGetSprints, useCreateSprint, useEditSprint, useStartSprint, useCompleteSprint, useDeleteSprint } from "../hooks/useSprints.tsx";
import SprintModal from "./sprint.modal.tsx";
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
            case 'ACTIVE': return <Rocket size={16} className="text-indigo-500" />;
            case 'COMPLETED': return <CheckCircle2 size={16} className="text-emerald-500" />;
            default: return <Clock size={16} className="text-gray-400" />;
        }
    };

    const getStatusStyle = (status: SprintStatus) => {
        switch (status) {
            case 'ACTIVE': return "bg-indigo-50 text-indigo-700 border-indigo-100";
            case 'COMPLETED': return "bg-emerald-50 text-emerald-700 border-emerald-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    return (
        <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-1 gap-3 w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search sprints..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-sm text-gray-900"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-gray-200 whitespace-nowrap"
                >
                    <Plus size={18} />
                    Create Sprint
                </button>
            </div>

            {/* Sprint Grid/List */}
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : sprints.length === 0 ? (
                <div className="py-20 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-black text-lg">No sprints planned yet</p>
                    <p className="text-gray-400 font-bold mb-6 text-sm">Start by creating your first sprint milestone.</p>
                    <button
                        onClick={handleOpenCreate}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-black text-xs hover:bg-gray-50 transition shadow-sm"
                    >
                        Create First Sprint
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {sprints.map((sprint) => (
                        <div
                            key={sprint._id}
                            className="group bg-white border border-gray-100 rounded-[32px] p-6 hover:shadow-xl hover:shadow-gray-200/50 hover:border-indigo-100 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 ${getStatusStyle(sprint.status)}`}>
                                        {getStatusIcon(sprint.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-black text-gray-900 truncate group-hover:text-indigo-600 transition-colors capitalize">
                                                {sprint.name}
                                            </h3>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(sprint.status)}`}>
                                                {sprint.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-400 text-xs font-bold">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                <span>{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end md:self-center">
                                    {sprint.status === 'PLANNED' && (
                                        <button
                                            onClick={() => startMutation.mutate(sprint._id)}
                                            disabled={startMutation.isPending}
                                            className="p-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-2xl transition-all border border-indigo-100 hover:shadow-md disabled:opacity-50"
                                            title="Start Sprint"
                                        >
                                            <Play size={18} />
                                        </button>
                                    )}
                                    {sprint.status === 'ACTIVE' && (
                                        <button
                                            onClick={() => completeMutation.mutate(sprint._id)}
                                            disabled={completeMutation.isPending}
                                            className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-2xl transition-all border border-emerald-100 hover:shadow-md disabled:opacity-50"
                                            title="Complete Sprint"
                                        >
                                            <CheckCircle2 size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleOpenEdit(sprint)}
                                        className="p-3 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-transparent hover:border-indigo-100"
                                        title="Edit Sprint"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    {(sprint.status === 'PLANNED' || sprint.status === 'COMPLETED') && (
                                        <button
                                            onClick={() => deleteMutation.mutate(sprint._id)}
                                            disabled={deleteMutation.isPending}
                                            className="p-3 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-2xl transition-all border border-transparent hover:border-rose-100 disabled:opacity-50"
                                            title="Delete Sprint"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
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
        </div>
    );
}
