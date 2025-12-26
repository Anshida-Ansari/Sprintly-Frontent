import { useParams, useNavigate } from "react-router-dom";
import { useGetProject } from "../hooks/useGetProject";
import { ArrowLeft, Calendar, GitBranch, Users, Clock, Edit } from "lucide-react";
import { useState } from "react";
import EditProjectModal from "../components/edit.project.modal";
import { useEditProject } from "../hooks/useEditProject";
import type { EditProjectPayload } from "../types/types";

export default function ProjectDetail() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { data: projectResponse, isLoading } = useGetProject(projectId || "");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { mutate: updateProject, isPending: isUpdating } = useEditProject();

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
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <button
                    onClick={() => navigate('/admin/projects')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">Back to Projects</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{project.name}</h1>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-500 text-gray-600'} bg-opacity-10 text-opacity-100 uppercase tracking-wide`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition shadow-sm flex items-center gap-2"
                    >
                        <Edit size={18} />
                        Edit Project
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Info Card */}
                <div className="md:col-span-2 space-y-6">
                    {/* Timeline */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock size={20} className="text-indigo-500" />
                            Timeline
                        </h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-wider">Start Date</p>
                                <div className="flex items-center gap-2 text-gray-700 font-bold text-lg">
                                    <Calendar size={20} className="text-emerald-500" />
                                    {new Date(project.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-wider">Due Date</p>
                                <div className="flex items-center gap-2 text-gray-700 font-bold text-lg">
                                    <Calendar size={20} className="text-rose-500" />
                                    {new Date(project.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Git Repo */}
                    {project.gitRepoUrl && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <GitBranch size={20} className="text-black" />
                                Repository
                            </h3>
                            <a
                                href={project.gitRepoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
                            >
                                {project.gitRepoUrl}
                            </a>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Team Members */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Users size={20} className="text-orange-500" />
                            Team Members
                        </h3>

                        {project.members && project.members.length > 0 ? (
                            <div className="space-y-3">
                                {project.members.map((memberId: string, index: number) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {/* Ideally verify if member is object or string, assuming string ID for now based on types */}
                                            {memberId.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-gray-900 truncate">Member ID</p>
                                            <p className="text-xs text-gray-400 truncate">{memberId}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                No members assigned
                            </div>
                        )}
                    </div>
                </div>
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
