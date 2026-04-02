import { ChevronRight, LayoutGrid, MessagesSquare } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProjects } from "../../admin/hooks/useProjects";
import { useGetSprints } from "../../admin/hooks/useSprints";
import { StandupChat } from "../components/standup.chat";

export default function DeveloperStandupPage() {
	const [params] = useSearchParams();
	const urlProjectId = params.get("projectId");
	const urlSprintId = params.get("sprintId");

	const [selectedProjectId, setSelectedProjectId] = useState(
		urlProjectId || "",
	);

	const { data: projectsRes, isLoading: isLoadingProjects } = useProjects({
		limit: 100,
	});
	const projects = projectsRes?.data || [];

	const { data: sprintsRes, isLoading: isLoadingSprints } = useGetSprints(
		selectedProjectId,
		{ page: 1, limit: 10, status: "ACTIVE" },
	);

	const activeSprint = sprintsRes?.data?.[0]; 
	const activeSprintId = activeSprint?._id || activeSprint?.id;

	const sprintId = urlSprintId || activeSprintId;
	const projectId = urlProjectId || selectedProjectId;

	if (!projectId || !sprintId) {
		return (
			<div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 py-16 px-6">
				<div className="text-center space-y-4">
					<div className="inline-flex items-center justify-center p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-4 shadow-sm border border-indigo-100">
						<MessagesSquare size={32} strokeWidth={2} />
					</div>
					<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
						Daily Standup
					</h1>
					<p className="text-gray-500 font-medium max-w-lg mx-auto text-lg leading-relaxed">
						Keep the team synced. Choose an active project to view and share your daily progress.
					</p>
				</div>

				<div className="max-w-xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
					<div className="space-y-6">
						<label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
							<LayoutGrid size={16} className="text-indigo-500" />
							Select Project
						</label>
						<div className="relative group">
							<select
								value={selectedProjectId}
								onChange={(e) => setSelectedProjectId(e.target.value)}
								className="w-full appearance-none bg-gray-50/50 border-2 border-transparent rounded-2xl px-6 py-4 text-gray-900 font-bold text-lg cursor-pointer hover:bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all duration-300"
								disabled={isLoadingProjects}
							>
								<option value="" disabled className="text-gray-400 font-medium">Choose a project...</option>
								{projects.map((p: any) => (
									<option key={p.id} value={p.id} className="font-medium">
										{p.name}
									</option>
								))}
							</select>
							<div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-indigo-600 transition-colors">
								<ChevronRight size={20} className="rotate-90" />
							</div>
						</div>
					</div>

					{selectedProjectId && isLoadingSprints && (
						<div className="mt-8 flex justify-center">
							<div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
						</div>
					)}

					{selectedProjectId && !isLoadingSprints && !activeSprintId && (
						<div className="mt-8 flex flex-col items-center justify-center p-6 bg-rose-50/50 rounded-2xl border border-rose-100/50 text-center animate-in slide-in-from-top-4 duration-300">
							<p className="text-rose-600 font-bold mb-1">No active sprint found</p>
							<p className="text-rose-500/80 text-sm font-medium">
								Reach out to your project manager to kick off a new sprint.
							</p>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto py-8 px-6 animate-in fade-in duration-500 h-[calc(100vh-4rem)] flex flex-col">
			<div className="flex-1 min-h-0 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative">
				<div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />
				
				<StandupChat
					projectId={projectId}
					sprintId={sprintId}
					userRole="developer"
				/>
			</div>
		</div>
	);
}
