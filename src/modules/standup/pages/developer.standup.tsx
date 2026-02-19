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
			<div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 py-12">
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-3 text-indigo-600 mb-2">
						<MessagesSquare size={20} className="stroke-[2.5]" />
						<span className="text-xs font-black uppercase tracking-wider">
							Daily Standup
						</span>
					</div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">
						Select Project
					</h1>
					<p className="text-gray-500 font-medium max-w-lg text-lg">
						Choose a project to view and submit your daily standup updates.
					</p>
				</div>

				<div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
					<div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
						<LayoutGrid size={32} />
					</div>

					<div className="flex-1 w-full">
						<div className="relative">
							<select
								value={selectedProjectId}
								onChange={(e) => setSelectedProjectId(e.target.value)}
								className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-6 py-4 pr-12 font-bold text-gray-900 hover:border-indigo-300 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 cursor-pointer shadow-sm text-lg"
								disabled={isLoadingProjects}
							>
								<option value="">Select a project...</option>
								{projects.map((p: any) => (
									<option key={p.id} value={p.id}>
										{p.name}
									</option>
								))}
							</select>
							<div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
								<ChevronRight size={20} className="rotate-90" />
							</div>
						</div>
					</div>
				</div>

				{selectedProjectId && isLoadingSprints && (
					<div className="flex justify-center py-12">
						<div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
					</div>
				)}

				{selectedProjectId && !isLoadingSprints && !activeSprintId && (
					<div className="flex flex-col items-center justify-center py-12 bg-rose-50 rounded-[32px] border border-rose-100 text-rose-600 font-bold gap-2">
						<p>No active sprint found for this project.</p>
						<p className="text-sm opacity-80">
							Please contact your project manager to start a sprint.
						</p>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Daily Standup</h1>
					<p className="text-gray-500 font-medium">Share your progress with the team</p>
				</div>
				{!urlProjectId && (
					<button
						onClick={() => setSelectedProjectId("")}
						className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-200"
					>
						Switch Project
					</button>
				)}
			</div>
			<div className="flex-1 min-h-0 bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
				<StandupChat
					projectId={projectId}
					sprintId={sprintId}
					userRole="developer"
				/>
			</div>
		</div>
	);
}
