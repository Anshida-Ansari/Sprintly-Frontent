import { useParams, useNavigate } from "react-router-dom";
import { useGetProject } from "../hooks/useGetProject";
import { ArrowLeft, Calendar, GitBranch, Users, Clock, Edit, Layout, ScrollText, PlayCircle } from "lucide-react";
import { useState } from "react";
import EditProjectModal from "../components/edit.project.modal";
import { useEditProject } from "../hooks/useEditProject";
import type { EditProjectPayload } from "../types/types";
import UserStoryList from "../components/user-story-list";
import SprintList from "../components/sprint.list.tsx";

export default function ProjectDetail() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { data: projectResponse, isLoading } = useGetProject(projectId || "");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { mutate: updateProject, isPending: isUpdating } = useEditProject();
    const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'sprints'>('overview');

    const project = projectResponse?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                <p className="text-gray-500 font-medium">Project not found.</p>
                <button
                    onClick={() => navigate('/admin/projects')}
                    className="px-4 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-lg transition"
                >
                    Back to Projects
                </button>
            </div>
        )
    }

    const handleEditProject = (data: EditProjectPayload) => {
        updateProject(data, {
            onSuccess: () => {
                setIsEditModalOpen(false);

            }
        });
    };

    const statusColors = {
        Active: "bg-emerald-500 text-emerald-600",
        Completed: "bg-blue-500 text-blue-600",
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <button
                    onClick={() => navigate('/admin/projects')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">Back to Projects</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">{project.name}</h1>
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-500 text-gray-600'} bg-opacity-10 text-opacity-100 uppercase tracking-widest`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-lg font-medium max-w-3xl leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-50 hover:border-gray-300 transition shadow-sm flex items-center gap-2 whitespace-nowrap"
                    >
                        <Edit size={20} />
                        Update Project
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black transition-all ${activeTab === 'overview'
                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    <Layout size={18} />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('stories')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black transition-all ${activeTab === 'stories'
                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    <ScrollText size={18} />
                    User Stories
                </button>
                <button
                    onClick={() => setActiveTab('sprints')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black transition-all ${activeTab === 'sprints'
                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    <PlayCircle size={18} />
                    Sprints
                </button>
            </div>

            <div className="transition-all duration-300">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Main Info Card */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Timeline */}
                            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <Clock size={24} className="text-indigo-500" />
                                    Project Timeline
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Start Date</p>
                                        <div className="flex items-center gap-3 text-gray-700 font-black text-xl">
                                            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                                <Calendar size={20} />
                                            </div>
                                            {new Date(project.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Target Deadline</p>
                                        <div className="flex items-center gap-3 text-gray-700 font-black text-xl">
                                            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                                                <Calendar size={20} />
                                            </div>
                                            {new Date(project.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Git Repo */}
                            {project.gitRepoUrl && (
                                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors"></div>
                                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                                        <GitBranch size={24} className="text-black" />
                                        Version Control
                                    </h3>
                                    <a
                                        href={project.gitRepoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 text-indigo-600 hover:text-indigo-700 font-black text-lg hover:underline transition-all relative z-10"
                                    >
                                        {project.gitRepoUrl}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Team Members */}
                            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <Users size={24} className="text-orange-500" />
                                    Core Team
                                </h3>

                                {project.members && project.members.length > 0 ? (
                                    <div className="space-y-4">
                                        {project.members.map((memberId: string, index: number) => (
                                            <div key={index} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100 group">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-black text-sm group-hover:scale-110 transition-transform">
                                                    {memberId.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-black text-gray-900 truncate">Project Member</p>
                                                    <p className="text-xs text-gray-400 font-bold truncate">{memberId}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-400 font-bold bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                                        No members assigned
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'stories' && (
                    <div className="animate-in slide-in-from-right-4 duration-500 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                        <UserStoryList projectId={projectId || ""} showHeader={false} />
                    </div>
                )}

                {activeTab === 'sprints' && (
                    <div className="animate-in slide-in-from-right-4 duration-500 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                        <SprintList projectId={projectId || ""} />
                    </div>
                )}
            </div>

            <EditProjectModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditProject}
                project={project}
                isLoading={isUpdating}
            />
        </div>
    );
}
