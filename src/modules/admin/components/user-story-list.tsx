import { useState } from "react";
import { Plus, Edit2, Flag, CheckCircle2, Clock, PlayCircle, Search } from "lucide-react";
import { useGetUserStories, useCreateUserStory, useUpdateUserStory } from "../hooks/useUserStories";
import UserStoryModal from "./user-story-modal";
import { PriorityStatus, UserStoryStatus, type IUserStory } from "../types/types";

interface UserStoryListProps {
    projectId: string;
}

export default function UserStoryList({ projectId }: UserStoryListProps) {
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<IUserStory | undefined>();

    const { data: userStoriesRes, isLoading } = useGetUserStories(projectId, { search });
    const { mutate: createStory, isPending: isCreating } = useCreateUserStory();
    const { mutate: updateStory, isPending: isUpdating } = useUpdateUserStory();

    const handleOpenCreateModal = () => {
        setSelectedStory(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (story: IUserStory) => {
        setSelectedStory(story);
        setIsModalOpen(true);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    User Stories
                    <span className="text-sm font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                        {userStoriesRes?.total || 0}
                    </span>
                </h3>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search stories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium w-64"
                        />
                    </div>
                    <button
                        onClick={handleOpenCreateModal}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2 text-sm"
                    >
                        <Plus size={18} />
                        New Story
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : userStoriesRes?.data && userStoriesRes.data.length > 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {userStoriesRes.data.map((story) => (
                                    <tr key={story.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                    {story.title}
                                                </span>
                                                <span className="text-xs text-gray-400 line-clamp-1">{story.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${priorityColors[story.priority]}`}>
                                                {story.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {statusIcons[story.status]}
                                                <span className="text-sm font-bold text-gray-700">{story.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleOpenEditModal(story)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Flag className="text-gray-300" size={32} />
                    </div>
                    <p className="text-gray-400 font-bold">No user stories found</p>
                    <button
                        onClick={handleOpenCreateModal}
                        className="mt-4 text-indigo-600 font-black hover:underline text-sm"
                    >
                        Create your first story
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
        </div>
    );
}
