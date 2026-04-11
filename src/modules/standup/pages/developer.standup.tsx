import { 
	ChevronDown, 
	LayoutGrid, 
	Sparkles, 
	PanelRightClose, 
	PanelRightOpen,
	Target,
	Users,
	Clock as ClockIcon,
	TrendingUp,
	CheckCircle2,
	AlertCircle,
	MessagesSquare
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProjects } from "../../admin/hooks/useProjects";
import { useGetSprints } from "../../admin/hooks/useSprints";
import { useGetUserStories } from "../../admin/hooks/useUserStories";
import { StandupChat } from "../components/standup.chat";

export default function DeveloperStandupPage() {
	const [params, setParams] = useSearchParams();
	const urlProjectId = params.get("projectId");
	const urlSprintId = params.get("sprintId");

	const [selectedProjectId, setSelectedProjectId] = useState(
		urlProjectId || "",
	);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showSprintOverview, setShowSprintOverview] = useState(true);

	const { data: projectsRes } = useProjects({
		limit: 100,
	});
	const projects = projectsRes?.data || [];

	const handleProjectChange = (id: string) => {
		setSelectedProjectId(id);
		setParams({ projectId: id });
	};

	return (
		<div className="flex flex-col h-screen bg-[#fafbfc] overflow-hidden">
			{/* Persistent Premium Header */}
			<header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-50 shadow-sm">
				<div className="flex items-center gap-6 pl-2">
					<div className="flex items-center gap-4">
						<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
							<MessagesSquare size={20} />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-black text-gray-900 tracking-tight leading-none">Daily Standup</h1>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Team Sync</p>
						</div>
					</div>

					<div className="relative group ml-4">
						<div className="absolute inset-0 bg-indigo-100 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div 
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
							className="relative flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm group-hover:border-indigo-200 transition-all cursor-pointer min-w-[200px]"
						>
							<LayoutGrid size={18} className="text-indigo-500" />
							<span className="text-sm font-black text-gray-700 flex-1 truncate">
								{projects.find((p: any) => (p.id || p._id) === selectedProjectId)?.name || "Select Project..."}
							</span>
							<ChevronDown size={16} className={`text-gray-400 group-hover:text-indigo-500 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
						</div>

						{isDropdownOpen && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-[100] animate-in zoom-in-95 duration-200 origin-top">
								<div className="max-h-60 overflow-y-auto scrollbar-none divide-y divide-gray-50">
									{projects.map((p: any) => (
										<div
											key={p.id || p._id}
											onClick={() => {
												handleProjectChange(p.id || p._id);
												setIsDropdownOpen(false);
											}}
											className="px-5 py-3 hover:bg-indigo-50/50 cursor-pointer transition-colors group/item"
										>
											<div className="flex items-center gap-3">
												<div className={`w-2 h-2 rounded-full transition-all ${selectedProjectId === (p.id || p._id) ? 'bg-indigo-600 scale-125' : 'bg-gray-200 group-hover/item:bg-indigo-300'}`} />
												<span className={`text-sm font-bold ${selectedProjectId === (p.id || p._id) ? 'text-indigo-600' : 'text-gray-600'}`}>
													{p.name}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex items-center gap-6">
					<div className="hidden md:flex items-center gap-2 group cursor-pointer px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
						<div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
						<span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Live Sync</span>
					</div>
					
					<button 
						onClick={() => setShowSprintOverview(!showSprintOverview)}
						className={`p-2.5 rounded-xl transition-all shadow-sm ${showSprintOverview ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-white text-gray-400 border-gray-100 border'}`}
					>
						{showSprintOverview ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
					</button>
				</div>
			</header>

			<main className="flex-1 flex overflow-hidden">
				{selectedProjectId ? (
					<>
						<div className="flex-1 overflow-hidden">
							<StandupChat
								projectId={selectedProjectId}
								sprintId={urlSprintId || ""}
							/>
						</div>
						{showSprintOverview && (
							<aside className="w-96 border-l border-gray-100 bg-white overflow-y-auto scrollbar-none animate-in slide-in-from-right duration-500 hidden xl:block shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
								<SprintOverview projectId={selectedProjectId} onSprintFound={(id) => {
                                    if (!urlSprintId && id) setParams({ projectId: selectedProjectId, sprintId: id });
                                }} />
							</aside>
						)}
					</>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-1000">
						<div className="relative mb-8">
							<div className="absolute inset-0 bg-indigo-400 rounded-full blur-3xl opacity-20 animate-pulse" />
							<div className="relative w-24 h-24 bg-gradient-to-tr from-white to-gray-50 rounded-[2.5rem] flex items-center justify-center shadow-xl border border-white">
								<Sparkles size={40} className="text-indigo-500" />
							</div>
						</div>
						<h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Sync with your Hub</h2>
						<p className="text-gray-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">
							Select a project from the switcher above to start your daily sync and view team progress.
						</p>
					</div>
				)}
			</main>
		</div>
	);
}

function SprintOverview({ projectId, onSprintFound }: { projectId: string; onSprintFound: (id: string) => void }) {
	const { data: sprintsRes, isLoading: isLoadingSprints } = useGetSprints(projectId, { page: 1, limit: 10, status: "ACTIVE" as any });
	const runningSprint = sprintsRes?.data?.[0];
	const sprintId = runningSprint?._id || runningSprint?.id;

    useEffect(() => {
        if (sprintId) onSprintFound(sprintId);
    }, [sprintId]);
	
	const { data: storiesRes, isLoading: isLoadingStories } = useGetUserStories(projectId, { sprintId });
	const stories = storiesRes?.data || [];

	if (isLoadingSprints) {
		return (
			<div className="p-8 space-y-8">
				<div className="space-y-3">
					<div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
					<div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
				</div>
                <div className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
				<div className="space-y-4 pt-4">
                    <div className="h-4 w-32 bg-gray-100 rounded-full animate-pulse" />
					{[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />)}
				</div>
			</div>
		);
	}

	if (!runningSprint) {
		return (
			<div className="p-12 text-center space-y-6">
				<div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto border border-gray-100 shadow-inner">
					<Target className="w-10 h-10 text-gray-200" />
				</div>
                <div className="space-y-2">
				    <h3 className="font-black text-gray-900 text-xl tracking-tight">Focusing Mode</h3>
				    <p className="text-gray-400 text-sm font-medium leading-relaxed px-4">Wait for the project admin to start a new sprint cycle to see active goals. </p>
                </div>
			</div>
		);
	}

	return (
		<div className="p-8 space-y-10">
			{/* Sprint Header */}
			<div className="space-y-5">
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100/50 shadow-sm">
					Active Goal
				</div>
				<div>
					<h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{runningSprint.name}</h3>
					<div className="flex items-center gap-4 mt-3">
						<div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
							<ClockIcon size={14} className="text-gray-300" />
							{new Date(runningSprint.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} - {new Date(runningSprint.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
						</div>
					</div>
				</div>
				<div className="bg-indigo-600 p-5 rounded-[2rem] border border-indigo-500 shadow-xl shadow-indigo-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
					<p className="text-[13px] font-bold text-white leading-relaxed relative z-10 italic">
						"{runningSprint.goal || "Focus on delivering core value and maintaining high code quality."}"
					</p>
				</div>
			</div>

			{/* User Stories */}
			<div className="space-y-6">
				<div className="flex items-center justify-between border-b border-gray-50 pb-4 px-1">
					<h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
						<Users size={12} />
						Board Overview
					</h4>
					<span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-xl border border-emerald-100/50">
						{stories.length} Units
					</span>
				</div>

				<div className="space-y-4">
					{isLoadingStories ? (
						<div className="flex items-center justify-center py-20">
							<TrendingUp className="w-8 h-8 animate-pulse text-indigo-200" />
						</div>
					) : stories.length > 0 ? (
						stories.map((story: any) => (
							<div key={story._id} className="p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all duration-300 group">
								<div className="space-y-4">
									<div className="flex items-start justify-between gap-4">
										<p className="text-[14px] font-bold text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors">
											{story.title}
										</p>
                                        <div className={`p-1.5 rounded-lg border ${
                                            story.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                            story.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                        }`}>
                                            {story.status === 'DONE' ? <CheckCircle2 size={12} /> : story.status === 'IN_PROGRESS' ? <TrendingUp size={12} /> : <Target size={12} />}
                                        </div>
									</div>
									
									<div className="flex items-center justify-between pt-2">
										<div className="flex items-center gap-2">
											<div className={`w-2 h-2 rounded-full ${
												story.status === 'DONE' ? 'bg-emerald-500' : 
												story.status === 'IN_PROGRESS' ? 'bg-indigo-500 text-indigo-600' : 'bg-gray-300'
											}`} />
											<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{story.status}</span>
										</div>

                                        <div className="flex -space-x-1.5">
                                            {story.assignedTo?.length > 0 ? (
                                                story.assignedTo.map((userId: string, idx: number) => (
                                                    <div key={idx} className="w-7 h-7 rounded-xl bg-gray-100 border-2 border-white text-[10px] font-black text-gray-500 flex items-center justify-center shadow-sm group-hover:border-indigo-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                                        {userId.substring(0, 1).toUpperCase()}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="w-7 h-7 rounded-xl bg-gray-50 border-2 border-white flex items-center justify-center text-gray-200 shadow-sm">
                                                    <Users size={12} />
                                                </div>
                                            )}
                                        </div>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="py-16 text-center bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
							<AlertCircle size={24} className="text-gray-200 mx-auto mb-3" />
							<p className="text-sm font-bold text-gray-300">No active goal units.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
