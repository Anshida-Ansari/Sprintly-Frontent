import { Calendar, GitBranch, MoreVertical, Users } from 'lucide-react';
import type { IProject } from '../types/types';

interface ProjectCardProps {
    project: IProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const statusColors = {
        Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Completed: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const statusLabel = project.status.replace('_', ' ');

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                    {statusLabel}
                </span>
                <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition">
                    <MoreVertical size={16} />
                </button>
            </div>

            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {project.name}
            </h3>
            <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">
                {project.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex -space-x-2">
                    {/* Placeholder for members avatars - assuming we might get member count or avatars later */}
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600">
                        <Users size={14} />
                    </div>
                </div>

                <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                    <div className="flex items-center gap-1.5" title="Due date">
                        <Calendar size={14} />
                        {new Date(project.endDate).toLocaleDateString()}
                    </div>
                    {project.gitRepoUrl && (
                        <a href={project.gitRepoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition">
                            <GitBranch size={14} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
