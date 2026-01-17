import { useState } from "react";
import {
    LayoutGrid,
    Search,
    Zap,
    MoreHorizontal,
    GripVertical,
    Calendar,
    Flag,
    Play,
    ScrollText,
    CheckCircle2
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useGetUserStories, useAssignUserStoryToSprint } from "../hooks/useUserStories";
import { useGetSprints, useStartSprint, useCompleteSprint } from "../hooks/useSprints";
import UserStoryDetailModal from "../components/user-story-detail-modal";
import type { IUserStory } from "../types/types";

export default function SprintPlanningPage() {
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [selectedStory, setSelectedStory] = useState<IUserStory | null>(null);
    const { data: projectsRes } = useProjects({ limit: 100 });
    const { data: storiesRes } = useGetUserStories(selectedProjectId, { limit: 100 });
    const { data: sprintsRes } = useGetSprints(selectedProjectId, { page: 1, limit: 10 });

    const assignStory = useAssignUserStoryToSprint();
    const startSprint = useStartSprint(selectedProjectId);
    const completeSprint = useCompleteSprint(selectedProjectId);

    const projects = projectsRes?.data || [];
    const stories = storiesRes?.data || [];
    const sprints = sprintsRes?.data || [];

    const backlog = stories.filter(s => !s.sprintId);

    const onDragStart = (e: React.DragEvent, storyId: string) => {
        e.dataTransfer.setData("storyId", storyId);
    };

    const onDrop = (e: React.DragEvent, sprintId: string | null) => {
        e.preventDefault();
        const storyId = e.dataTransfer.getData("storyId");
        if (storyId) {
            assignStory.mutate({
                projectId: selectedProjectId,
                userStoryId: storyId,
                sprintId
            });
        }
    };

    const allowDrop = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                    <Zap size={20} className="stroke-[3]" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Agile Planning</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Sprint Planning</h1>
                        <p className="text-lg text-gray-500 font-medium">Drag stories into sprints to plan your next iteration.</p>
                    </div>

                    {/* Project Selector */}
                    <div className="relative">
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="appearance-none bg-white border-2 border-gray-100 rounded-2xl px-6 py-3 pr-12 font-bold text-gray-700 hover:border-indigo-200 transition-all focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                        >
                            <option value="">Select Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <LayoutGrid size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {!selectedProjectId ? (
                <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 rounded-[48px] border border-dashed border-gray-200">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                        <Search className="text-indigo-200" size={48} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 mb-2">No Project Selected</h4>
                    <p className="text-gray-400 font-bold text-center max-w-sm">
                        Please select a project from the dropdown above to start planning your sprints.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Backlog Column */}
                    <div className="col-span-12 lg:col-span-4 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <h3 className="font-black text-gray-900 flex items-center gap-2">
                                Backlog
                                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{backlog.length}</span>
                            </h3>
                            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                        </div>
                        <div
                            className="flex-1 p-4 space-y-3 overflow-y-auto"
                            onDrop={(e) => onDrop(e, null)}
                            onDragOver={allowDrop}
                        >
                            {backlog.map(story => (
                                <div
                                    key={story.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, story.id)}
                                    onClick={() => setSelectedStory(story)}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer"
                                >
                                    <div className="flex items-start gap-3">
                                        <GripVertical size={16} className="text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex-1 space-y-2">
                                            <h4 className="font-bold text-sm text-gray-900 leading-snug">{story.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${story.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                                                    story.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    {story.priority}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                    <Flag size={10} /> {story.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {backlog.length === 0 && (
                                <div className="py-20 text-center">
                                    <p className="text-sm font-bold text-gray-400">Backlog is empty</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sprints Column */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        {sprints.map((sprint) => (
                            <div
                                key={sprint._id}
                                onDrop={(e) => onDrop(e, sprint._id)}
                                onDragOver={allowDrop}
                                className={`rounded-[40px] border-2 transition-all overflow-hidden ${sprint.status === 'ACTIVE' ? 'border-indigo-600 bg-indigo-50/20 shadow-lg shadow-indigo-100' : 'border-gray-100 bg-white'
                                    }`}
                            >
                                {/* Sprint Header */}
                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl ${sprint.status === 'ACTIVE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-400'}`}>
                                            <Zap size={20} fill={sprint.status === 'ACTIVE' ? "currentColor" : "none"} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-black text-xl text-gray-900">{sprint.name}</h3>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${sprint.status === 'ACTIVE' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                    {sprint.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <ScrollText size={14} />
                                                    {stories.filter(s => s.sprintId === sprint._id).length} Stories
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3">
                                        {sprint.status === 'PLANNED' && (
                                            <button
                                                onClick={() => startSprint.mutate(sprint._id)}
                                                disabled={startSprint.isPending}
                                                className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all hover:shadow-xl hover:shadow-indigo-100 disabled:opacity-50"
                                            >
                                                <Play size={16} fill="white" />
                                                Start Sprint
                                            </button>
                                        )}
                                        {sprint.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => completeSprint.mutate(sprint._id)}
                                                disabled={completeSprint.isPending}
                                                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all hover:shadow-xl hover:shadow-emerald-100 disabled:opacity-50"
                                            >
                                                <CheckCircle2 size={16} />
                                                Complete Sprint
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Sprint Stories */}
                                <div className="px-6 pb-6 pt-2">
                                    <div className="p-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 min-h-[100px] flex flex-wrap gap-3">
                                        {stories.filter(s => s.sprintId === sprint._id).map(story => (
                                            <div
                                                key={story.id}
                                                draggable
                                                onDragStart={(e) => onDragStart(e, story.id)}
                                                onClick={() => setSelectedStory(story)}
                                                className="px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm cursor-pointer hover:border-indigo-200"
                                            >
                                                <p className="text-xs font-bold text-gray-900">{story.title}</p>
                                            </div>
                                        ))}
                                        {stories.filter(s => s.sprintId === sprint._id).length === 0 && (
                                            <div className="w-full h-12 flex items-center justify-center">
                                                <p className="text-xs font-bold text-gray-300">Drop stories here</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User Story Detail Modal */}
            {selectedStory && (
                <UserStoryDetailModal
                    isOpen={!!selectedStory}
                    onClose={() => setSelectedStory(null)}
                    story={selectedStory}
                />
            )}
        </div>
    );
}

