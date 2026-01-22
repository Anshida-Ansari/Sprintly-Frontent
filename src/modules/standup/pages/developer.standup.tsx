import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { StandupChat } from "../components/standup.chat";
import { useProjects } from "../../admin/hooks/useProjects";
import { useGetSprints } from "../../admin/hooks/useSprints";
import { MessagesSquare, ChevronRight, LayoutGrid } from "lucide-react";

export default function DeveloperStandupPage() {
  const [params] = useSearchParams();
  const urlProjectId = params.get("projectId");
  const urlSprintId = params.get("sprintId");

  const [selectedProjectId, setSelectedProjectId] = useState(urlProjectId || "");

  // Fetch all projects for the dropdown
  const { data: projectsRes, isLoading: isLoadingProjects } = useProjects({ limit: 100 });
  const projects = projectsRes?.data || [];

  // Fetch active sprint for the selected project
  // We don't rely on project.activeSprintId as it might be missing
  const { data: sprintsRes, isLoading: isLoadingSprints } = useGetSprints(
    selectedProjectId,
    { page: 1, limit: 10, status: 'ACTIVE' }
  );

  const activeSprint = sprintsRes?.data?.[0]; // Assuming the API returns the active sprint(s)
  const activeSprintId = activeSprint?._id || activeSprint?.id;

  const sprintId = urlSprintId || activeSprintId;
  const projectId = urlProjectId || selectedProjectId;

  if (!projectId || !sprintId) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-indigo-500 mb-2">
            <MessagesSquare size={20} className="stroke-[3]" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Daily Standup</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Select Project</h1>
          <p className="text-gray-400 font-medium max-w-lg">
            Choose a project to view and submit your daily standup updates.
          </p>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-[32px] border border-white/[0.05] shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white/[0.05] rounded-2xl flex items-center justify-center text-indigo-400">
            <LayoutGrid size={32} />
          </div>

          <div className="flex-1 w-full">
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full appearance-none bg-[#08080A] border border-white/[0.1] rounded-2xl px-6 py-4 pr-12 font-bold text-white hover:border-indigo-500/50 transition-all focus:outline-none focus:border-indigo-500 cursor-pointer shadow-lg"
                disabled={isLoadingProjects}
              >
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronRight size={20} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {selectedProjectId && isLoadingSprints && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {selectedProjectId && !isLoadingSprints && !activeSprintId && (
          <div className="flex flex-col items-center justify-center py-12 bg-rose-500/10 rounded-[32px] border border-rose-500/20 text-rose-400 font-bold gap-2">
            <p>No active sprint found for this project.</p>
            <p className="text-sm opacity-80">Please contact your project manager to start a sprint.</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-black text-white">Daily Standup</h1>
        {!urlProjectId && (
          <button
            onClick={() => setSelectedProjectId("")}
            className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
          >
            Switch Project
          </button>
        )}
      </div>
      <div className="flex-1 min-h-0 bg-white rounded-[32px] overflow-hidden">
        <StandupChat projectId={projectId} sprintId={sprintId} userRole="developer" />
      </div>
    </div>
  );
}
