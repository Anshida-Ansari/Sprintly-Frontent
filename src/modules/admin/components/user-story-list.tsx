import { useState, useEffect } from "react";
import { Plus, Edit2, Flag, CheckCircle2, Clock, PlayCircle, Search, Filter, ScrollText, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useGetUserStories, useCreateUserStory, useUpdateUserStory } from "../hooks/useUserStories";
import UserStoryModal from "./user-story-modal";
import UserStoryDetailModal from "./user-story-detail-modal";
import { PriorityStatus, UserStoryStatus, type IUserStory } from "../types/types";
import { useDebounce } from "../../../shared/hooks/useDebounce";

interface UserStoryListProps {
    projectId: string;
    showHeader?: boolean;
}

export default function UserStoryList({ projectId, showHeader = true }: UserStoryListProps) {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [page, setPage] = useState(1);
    const limit = 5;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<IUserStory | undefined>();

    // Detail Modal State
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDetailStory, setSelectedDetailStory] = useState<IUserStory | undefined>();

    const { data: userStoriesRes, isLoading } = useGetUserStories(projectId, {
        search: debouncedSearch,
        status: statusFilter || undefined,
        page,
        limit
    });

    // Sync selectedDetailStory with fresh data from the list
    useEffect(() => {
        if (selectedDetailStory && userStoriesRes?.data) {
            const updatedStory = userStoriesRes.data.find((s: IUserStory) => s.id === selectedDetailStory.id);
            if (updatedStory) {
                setSelectedDetailStory(updatedStory);
            }
        }
    }, [userStoriesRes, selectedDetailStory?.id]);


    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter]);

    const { mutate: createStory, isPending: isCreating } = useCreateUserStory();
    const { mutate: updateStory, isPending: isUpdating } = useUpdateUserStory();

    const handleOpenCreateModal = () => {
        setSelectedStory(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (e: React.MouseEvent, story: IUserStory) => {
        e.stopPropagation();
        setSelectedStory(story);
        setIsModalOpen(true);
    };

    const handleOpenDetailModal = (story: IUserStory) => {
        setSelectedDetailStory(story);
        setIsDetailModalOpen(true);
    };

    const handleSubmit = (data: any) => {
        if (selectedStory) {
            updateStory({
                projectId,
                userStoryId: selectedStory.id,
                data
            }, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            createStory({
                projectId,
                data
            }, {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const priorityColors = {
        [PriorityStatus.LOW]: "text-emerald-500 bg-emerald-50",
        [PriorityStatus.MEDIUM]: "text-amber-500 bg-amber-50",
        [PriorityStatus.HIGH]: "text-rose-500 bg-rose-50",
    };

    const statusIcons = {
        [UserStoryStatus.IN_PENDING]: <Clock size={16} className="text-gray-400" />,
        [UserStoryStatus.IN_PROGRESS]: <PlayCircle size={16} className="text-blue-500" />,
        [UserStoryStatus.IN_REVIEW]: <Flag size={16} className="text-purple-500" />,
        [UserStoryStatus.DONE]: <CheckCircle2 size={16} className="text-emerald-500" />,
    };

    const totalPages = userStoriesRes ? Math.ceil(userStoriesRes.total / limit) : 0;

    return (
        <div className="space-y-6">
            {showHeader && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <ScrollText size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">User Stories</h3>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                                {userStoriesRes?.total || 0} Stories Available
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleOpenCreateModal}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
                    >
                        <Plus size={20} strokeWidth={3} />
                        Draft New Story
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search stories by title or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-transparent border focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-48">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border-transparent border focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            {(Object.values(UserStoryStatus) as string[]).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-gray-100 border-dashed">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 font-bold animate-pulse">Fetching backlogs...</p>
                </div>
            ) : userStoriesRes?.data && userStoriesRes.data.length > 0 ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        {userStoriesRes.data.map((story) => (
                            <div
                                key={story.id}
                                onClick={() => handleOpenDetailModal(story)}
                                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group relative overflow-hidden cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4 relative z-10">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${priorityColors[story.priority]}`}>
                                                {story.priority} Priority
                                            </span>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
                                                {statusIcons[story.status]}
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{story.status}</span>
                                            </div>
                                        </div>

                                        <h4 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                            {story.title}
                                        </h4>

                                        <p className="text-gray-500 text-sm font-medium line-clamp-2 max-w-2xl leading-relaxed">
                                            {story.description}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleOpenEditModal(e, story)}
                                            className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm bg-white border border-gray-100"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <div className="p-3 text-gray-300 group-hover:text-indigo-600 rounded-2xl transition-all">
                                            <Eye size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50/40 transition-colors"></div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[32px] border border-gray-100 shadow-sm">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${page === i + 1
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Flag className="text-gray-200" size={40} />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Clean Backlog!</h4>
                    <p className="text-gray-400 font-bold max-w-xs mx-auto">No user stories found matching your current filters.</p>
                    <button
                        onClick={handleOpenCreateModal}
                        className="mt-6 px-8 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black hover:bg-indigo-100 transition"
                    >
                        Create One Now
                    </button>
                </div>
            )}

            <UserStoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                userStory={selectedStory}
                isLoading={isCreating || isUpdating}
            />

            {selectedDetailStory && (
                <UserStoryDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    story={selectedDetailStory}
                />
            )}
        </div>
    );
}
