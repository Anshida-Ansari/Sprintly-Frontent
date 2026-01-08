import { useState } from "react";
import { Zap, ChevronRight, LayoutGrid, Search } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import SprintList from "../components/sprint.list.tsx";

export default function SprintsPage() {
    const { data: projectsRes, isLoading: isLoadingProjects } = useProjects({ limit: 100 });
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

    const projects = projectsRes?.data || [];

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                    <Zap size={20} className="stroke-[3]" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Agile Management</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Sprints</h1>
                <p className="text-lg text-gray-500 font-medium max-w-2xl">
                    Plan and monitor your agile iterations. Select a project to manage its specific milestones.
                </p>
            </div>

            {/* Project Selection Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <LayoutGrid size={22} className="text-indigo-500" />
                        Select a Project
                    </h3>
                    <div className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                        {projects.length} Total Projects
                    </div>
                </div>

                {isLoadingProjects ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-[32px] border border-gray-100"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => setSelectedProjectId(project.id)}
                                className={`p-6 rounded-[32px] border-2 text-left transition-all group relative overflow-hidden ${selectedProjectId === project.id
                                    ? "border-indigo-600 bg-indigo-50/30 shadow-lg shadow-indigo-100"
                                    : "border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md"
                                    }`}
                            >
                                <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                                    <div>
                                        <h4 className={`font-black text-lg leading-tight transition-colors ${selectedProjectId === project.id ? "text-indigo-600" : "text-gray-900"
                                            }`}>
                                            {project.name}
                                        </h4>
                                        <p className="text-sm text-gray-400 font-bold mt-1 line-clamp-1 uppercase tracking-widest">
                                            {project.status}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-black px-3 py-1 rounded-full ${selectedProjectId === project.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            {selectedProjectId === project.id ? "Selected" : "View Sprints"}
                                        </span>
                                        <ChevronRight size={18} className={`transition-transform duration-300 ${selectedProjectId === project.id ? "translate-x-1 text-indigo-600" : "text-gray-300 group-hover:translate-x-1"
                                            }`} />
                                    </div>
                                </div>
                                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-all duration-500 ${selectedProjectId === project.id ? "bg-indigo-600/5 rotate-12 scale-150" : "bg-gray-50"
                                    }`}></div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Sprints Content */}
            <div className="transition-all duration-500">
                {selectedProjectId ? (
                    <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm animate-in zoom-in-95 duration-500">
                        <SprintList projectId={selectedProjectId} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[48px] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                            <Search className="text-indigo-200" size={40} />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">No Project Selected</h4>
                        <p className="text-gray-400 font-bold text-center max-w-xs">
                            Please select a project from the grid above to view and manage its sprints.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
