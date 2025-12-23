import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import CreateProjectModal from '../components/create.project.modal';
import { useCreateProject } from '../hooks/useCreateProject';
import type { CreateProjectPayload } from '../types/types';

export default function Projects() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate: createProject, isPending } = useCreateProject();

    const handleCreateProject = (data: CreateProjectPayload) => {
        createProject(data, {
            onSuccess: () => setIsModalOpen(false)
        });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Projects</h1>
                    <p className="text-gray-500 font-medium">Manage and track all your ongoing projects.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                    <Plus size={20} />
                    New Project
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>
                <button className="px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* Empty State / List Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
                    <p className="text-gray-500">Get started by creating your first project.</p>
                </div>
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProject}
                isLoading={isPending}
            />
        </div>
    );
}
