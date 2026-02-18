
import { Loader2, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useGetMembers } from "../hooks/useGetmembers";
import { useAddMemberToProject } from "../hooks/useAddMemberToProject";

import type { IMember } from "../types/types";

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    currentMembers: IMember[];
}

export default function AddMemberModal({
    isOpen,
    onClose,
    projectId,
    currentMembers,
}: AddMemberModalProps) {
    const [search, setSearch] = useState("");
    const { data: membersRes, isLoading: loadingMembers } = useGetMembers({
        page: 1,
        limit: 50,
        search,
    });
    const { mutate: addMember, isPending } = useAddMemberToProject();

    const members = membersRes?.data || [];

    // Filter out members already in the project
    const availableMembers = members.filter(
        (m: any) => !currentMembers.some((cm) => cm.id === m.id || cm._id === m._id)
    );

    const handleAdd = (memberId: string) => {
        addMember(
            { projectId, memberId },
            {
                onSuccess: () => {
                    // Optional: close modal or keep open to add more
                    // onClose(); 
                },
            },
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                        Add Team Members
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search colleagues..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900"
                        />
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {loadingMembers ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-indigo-600" size={24} />
                            </div>
                        ) : availableMembers.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 font-bold">
                                No available members found.
                            </div>
                        ) : (
                            availableMembers.map((member: any) => (
                                <div
                                    key={member._id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl group transition-colors border border-transparent hover:border-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                                            {member.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {member.name}
                                            </p>
                                            <p className="text-xs text-gray-400 font-medium">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(member._id)}
                                        disabled={isPending}
                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm font-bold text-xs flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
