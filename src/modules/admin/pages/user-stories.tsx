import { ChevronRight, LayoutGrid, ScrollText, Search } from "lucide-react";
import { useState } from "react";
import UserStoryList from "../components/user-story-list";
import { useGetMembers } from "../hooks/useGetmembers";
import { useProjects } from "../hooks/useProjects";

export default function UserStoriesPage() {
	const { data: projectsRes, isLoading: isLoadingProjects } = useProjects({
		limit: 100,
	});
	const { data: membersRes } = useGetMembers({ page: 1, limit: 100 });
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");

	const projects = projectsRes?.data || [];
	const members = membersRes?.data || [];

	return (
		<div className="max-w-6xl mx-auto space-y-10 pb-12 animate-in fade-in duration-500">
			{/* Page Header */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-3 text-indigo-600 mb-2">
					<ScrollText size={20} className="stroke-[3]" />
					<span className="text-xs font-black uppercase tracking-[0.2em]">
						Product Backlog
					</span>
				</div>
				<h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
					User Stories
				</h1>
				<p className="text-lg text-gray-500 font-medium max-w-2xl">
					Manage and prioritize features across all your active projects from
					one central hub.
				</p>
			</div>

			{/* Project Selection Dropdown */}
			<div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between gap-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
						<LayoutGrid size={24} />
					</div>
					<div>
						<h3 className="text-xl font-black text-gray-900">Select Project</h3>
						<p className="text-sm text-gray-400 font-bold">
							Choose a project to manage its backlog
						</p>
					</div>
				</div>

				<div className="relative min-w-[300px]">
					<select
						value={selectedProjectId}
						onChange={(e) => setSelectedProjectId(e.target.value)}
						className="w-full pl-5 pr-10 py-4 bg-gray-50 border-2 border-transparent hover:border-indigo-100 focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 cursor-pointer appearance-none"
						disabled={isLoadingProjects}
					>
						<option value="" disabled>
							Select a project...
						</option>
						{projects.map((project) => (
							<option key={project.id} value={project.id}>
								{project.name} ({project.status})
							</option>
						))}
					</select>
					<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
						<ChevronRight size={20} className="rotate-90" />
					</div>
				</div>
			</div>

			{/* User Stories Content */}
			<div className="transition-all duration-500">
				{selectedProjectId ? (
					<div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm animate-in zoom-in-95 duration-500">
						<UserStoryList
							projectId={selectedProjectId}
							showHeader={true}
							members={members}
						/>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[48px] border border-dashed border-gray-200">
						<div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
							<Search className="text-indigo-200" size={40} />
						</div>
						<h4 className="text-xl font-black text-gray-900 mb-2">
							No Project Selected
						</h4>
						<p className="text-gray-400 font-bold text-center max-w-xs">
							Please select a project from the grid above to view and manage its
							product backlog.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
