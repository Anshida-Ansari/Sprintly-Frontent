import { useState, useEffect } from "react";
import {
    X,
    CheckSquare,
    Plus,
    Trash2,
    User,
    AlertCircle,
    Loader2,
    Edit3,
    Save
} from "lucide-react";
import { useGetSubtasks, useCreateSubtask, useUpdateSubtaskStatus, useAssignSubtask, useDeleteSubtask } from "../hooks/useSubtasks.tsx";
import { useGetMembers } from "../hooks/useGetmembers";
import { useUpdateUserStory } from "../hooks/useUserStories";
import { UserAuth } from "../../auth/store/store";
import type { IUserStory, ISubtask } from "../types/types";
import DeleteConfirmationModal from "./delete-confirmation-modal";

interface UserStoryDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    story: IUserStory;
}

export default function UserStoryDetailModal({ isOpen, onClose, story }: UserStoryDetailModalProps) {
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [editedDescription, setEditedDescription] = useState(story.description);

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [subtaskToDelete, setSubtaskToDelete] = useState<string | null>(null);

    const user = UserAuth((state) => state.user);
    const isAdmin = user?.role === "admin";

    console.log("User role:", user?.role, "isAdmin:", isAdmin);

    const { data: subtasksRes, isLoading: loadingSubtasks } = useGetSubtasks(story.id);
    const { data: membersRes } = useGetMembers({ page: 1, limit: 100, search: "" });

    const createSubtask = useCreateSubtask(story.id);
    const updateStatus = useUpdateSubtaskStatus(story.id);
    const assignSubtask = useAssignSubtask(story.id);
    const deleteSubtask = useDeleteSubtask(story.id);
    const updateStory = useUpdateUserStory();

    const subtasks = subtasksRes?.data || [];
    const members = membersRes?.data || [];
    const developers = members.filter((m: any) => m.role === "developers");

    const completedCount = subtasks.filter(s => s.status === "completed").length;
    const totalCount = subtasks.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    useEffect(() => {
        setEditedDescription(story.description);
    }, [story.description]);

    if (!isOpen) return null;

    const handleCreateSubtask = () => {
        if (newSubtaskTitle.trim()) {
            createSubtask.mutate({ title: newSubtaskTitle }, {
                onSuccess: () => setNewSubtaskTitle("")
            });
        }
    };

    const handleToggleSubtask = (subtask: ISubtask) => {
        const newStatus = subtask.status === "completed" ? "pending" : "completed";
        updateStatus.mutate({ subtaskId: subtask.id, status: newStatus });
    };

    const handleAssignSubtask = (subtaskId: string, developerId: string) => {
        assignSubtask.mutate({ subtaskId, payload: { assignedTo: developerId } });
    };

    const handleSaveDescription = () => {
        updateStory.mutate({
            projectId: story.projectId,
            userStoryId: story.id,
            data: { description: editedDescription }
        }, {
            onSuccess: () => setIsEditingDescription(false)
        });
    };

    const handleDeleteClick = (subtaskId: string) => {
        setSubtaskToDelete(subtaskId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (subtaskToDelete) {
            deleteSubtask.mutate(subtaskToDelete, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSubtaskToDelete(null);
                }
            });
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'High': return "bg-rose-50 text-rose-700 border-rose-200";
            case 'Medium': return "bg-amber-50 text-amber-700 border-amber-200";
            default: return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                {story.title}
                            </h2>
                            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${getPriorityStyle(story.priority)}`}>
                                {story.priority}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500 font-bold">Status: <span className="text-gray-900">{story.status}</span></span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 font-bold">{completedCount}/{totalCount} subtasks completed</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 font-bold">Role: <span className={isAdmin ? "text-green-600" : "text-orange-600"}>{user?.role || "unknown"}</span></span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm group"
                    >
                        <X size={20} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Description Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle size={16} className="text-indigo-500" />
                                Description
                            </h3>
                            {isAdmin && !isEditingDescription && (
                                <button
                                    onClick={() => setIsEditingDescription(true)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-indigo-600"
                                >
                                    <Edit3 size={16} />
                                </button>
                            )}
                        </div>
                        {isEditingDescription ? (
                            <div className="space-y-3">
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-gray-900 min-h-[120px] resize-none"
                                    placeholder="Add a description..."
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveDescription}
                                        disabled={updateStory.isPending}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditingDescription(false);
                                            setEditedDescription(story.description);
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl">
                                {story.description || "No description provided."}
                            </p>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {totalCount > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 font-bold">Overall Progress</span>
                                <span className="text-gray-900 font-black">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Subtasks Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                            <CheckSquare size={16} className="text-indigo-500" />
                            Subtasks ({totalCount})
                        </h3>

                        {loadingSubtasks ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-indigo-600" size={24} />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {subtasks.map((subtask) => {
                                    const assignedDev = developers.find((d: any) => d._id === subtask.assignedTo);

                                    return (
                                        <div
                                            key={subtask.id}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all group border border-transparent hover:border-gray-200"
                                        >
                                            {/* Status: Checkbox for Developer, Badge for Admin */}
                                            {isAdmin ? (
                                                <div className={`
                                                    px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border
                                                    ${subtask.status === "completed"
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                        : "bg-gray-200 text-gray-600 border-gray-300"}
                                                `}>
                                                    {subtask.status === "completed" ? "DONE" : "TODO"}
                                                </div>
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    checked={subtask.status === "completed"}
                                                    onChange={() => handleToggleSubtask(subtask)}
                                                    className="w-5 h-5 rounded-md border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                                />
                                            )}

                                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                                <p className={`font-bold text-sm ${subtask.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>
                                                    {subtask.title}
                                                </p>

                                                {/* Assignment UI */}
                                                <div className="flex items-center gap-2">
                                                    {assignedDev ? (
                                                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-[9px] font-black text-indigo-600 uppercase">
                                                                {assignedDev.name.slice(0, 2)}
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-700">{assignedDev.name}</span>
                                                            {isAdmin && (
                                                                <button
                                                                    onClick={() => handleAssignSubtask(subtask.id, "")}
                                                                    className="ml-1 p-0.5 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded transition-colors"
                                                                    title="Unassign"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        isAdmin ? (
                                                            <select
                                                                value=""
                                                                onChange={(e) => handleAssignSubtask(subtask.id, e.target.value)}
                                                                className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-lg font-bold text-gray-500 hover:border-indigo-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                            >
                                                                <option value="" disabled>Assign Member</option>
                                                                {developers.map((dev: any) => (
                                                                    <option key={dev._id} value={dev._id}>
                                                                        {dev.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span className="text-xs font-medium text-gray-400 italic">Unassigned</span>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Delete Button (Admin Only) */}
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteClick(subtask.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-50 rounded-xl transition-all text-gray-400 hover:text-rose-600"
                                                    title="Delete Subtask"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}

                                {subtasks.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 font-bold text-sm">
                                        No subtasks yet. Add one below!
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Add Subtask (Admin Only) */}
                        {isAdmin && (
                            <div className="flex gap-2 pt-2">
                                <input
                                    type="text"
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleCreateSubtask()}
                                    placeholder="Add a new subtask..."
                                    className="flex-1 px-5 py-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleCreateSubtask}
                                    disabled={!newSubtaskTitle.trim() || createSubtask.isPending}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Subtask"
                message="Are you sure you want to remove this subtask? This action cannot be undone."
                isLoading={deleteSubtask.isPending}
            />
        </div>
    );
}
