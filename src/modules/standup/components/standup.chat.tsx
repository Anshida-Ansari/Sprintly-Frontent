import { useState } from "react";
import { useListStandups } from "../hooks/useListStandup";
import { StandupCard } from "./standup.card";
import { StandupForm } from "./standup.form";
import { MessageSquare, Plus, X, Loader2 } from "lucide-react";

interface StandupChatProps {
    projectId: string;
    sprintId: string;
    userRole?: 'admin' | 'developer';
}

export const StandupChat = ({ projectId, sprintId, userRole = 'developer' }: StandupChatProps) => {
    const { data: standups, isLoading } = useListStandups(projectId, sprintId);
    const [showForm, setShowForm] = useState(false);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50/50 rounded-[32px] border border-gray-100 overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900">Standup Updates</h3>
                        <p className="text-xs font-bold text-gray-400">
                            {standups?.length || 0} updates this sprint
                        </p>
                    </div>
                </div>

                {userRole === 'developer' && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        <Plus size={18} />
                        <span>Post Update</span>
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {/* Form Section - Collapsible */}
                {showForm && (
                    <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
                        <div className="bg-white p-6 rounded-[24px] border border-indigo-100 shadow-xl shadow-indigo-50/50 relative">
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                            <h4 className="font-black text-gray-900 mb-6">Submit Daily Standup</h4>
                            <StandupForm projectId={projectId} sprintId={sprintId} onClose={() => setShowForm(false)} />
                        </div>
                    </div>
                )}

                {/* Standup List */}
                {standups && standups.length > 0 ? (
                    <div className="space-y-6">
                        {standups.map((standup) => (
                            <StandupCard
                                key={standup._id}
                                standup={standup}
                                projectId={projectId}
                                sprintId={sprintId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-gray-900 font-bold mb-1">No updates yet</h3>
                        <p className="text-gray-400 text-sm">Be the first to share your progress!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
