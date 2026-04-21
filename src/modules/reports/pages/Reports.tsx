import {
	BarChart2,
	Calendar,
	CheckSquare,
	FileText,
	Filter,
	FolderOpen,
	RefreshCw,
	User,
} from "lucide-react";
import { useState } from "react";
import { PaginatedTable } from "../../../shared/components/PaginatedTable";
import { useProjects } from "../../admin/hooks/useProjects";
import {
	useProjectReports,
	useSprintReports,
	useSubtaskReports,
	useUserPerformanceReports,
	useUserStoryReports,
} from "../hooks/useReports";

import type { IProject } from "../../admin/types/types";

type ReportTab =
	| "projects"
	| "sprints"
	| "stories"
	| "subtasks"
	| "performance";

interface ProjectReport {
	id: string;
	name: string;
	leadName: string;
	leadEmail: string;
	status: string;
	startDate: string;
	endDate: string;
}

interface SprintReport {
	id: string;
	name: string;
	status: string;
	userStoriesCount: number;
	completionRate: number;
	startDate: string;
	endDate: string;
}

interface StoryReport {
	title: string;
	status: string;
	estimationPoints: number;
	assignedUsers: string[];
}

interface SubtaskReport {
	title: string;
	assignedUserName: string;
	status: string;
	estimatedHours: number;
	actualHours: number;
	attachmentsCount: number;
	commentsCount: number;
}

interface PerformanceReport {
	name: string;
	email: string;
	tasksCompleted: number;
	tasksAssigned: number;
	completionRate: number;
	totalHoursWorked: number;
}

export default function Reports() {
	const [activeTab, setActiveTab] = useState<ReportTab>("projects");
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({
		projectId: "",
		startDate: "",
		endDate: "",
		status: "",
	});

	const { data: projectsData } = useProjects({ limit: 100 });
	const projects = projectsData?.data || [];

	const queryParams = {
		page,
		limit,
		search,
		...filters,
	};

	const reportsConfig = {
		projects: {
			title: "Project Operational Reports",
			icon: FolderOpen,
			hook: useProjectReports,
			columns: [
				{
					header: "Project Name",
					key: "name",
					render: (item: any) => (
						<span className="font-bold text-gray-900">{item.name}</span>
					),
				},
				{
					header: "Lead",
					key: "leadName",
					render: (item: ProjectReport) => (
						<div className="flex flex-col">
							<span className="font-medium text-gray-800">
								{item.leadName || "N/A"}
							</span>
							<span className="text-xs text-gray-400">{item.leadEmail}</span>
						</div>
					),
				},
				{
					header: "Status",
					key: "status",
					render: (item: ProjectReport) => (
						<span
							className={`px-2 py-1 rounded-lg text-xs font-bold ${
								item.status === "Active"
									? "bg-emerald-50 text-emerald-600"
									: "bg-blue-50 text-blue-600"
							}`}
						>
							{item.status}
						</span>
					),
				},
				{
					header: "Timeline",
					key: "timeline",
					render: (item: ProjectReport) => (
						<span className="text-sm text-gray-500 font-medium">
							{new Date(item.startDate).toLocaleDateString()} -{" "}
							{new Date(item.endDate).toLocaleDateString()}
						</span>
					),
				},
			],
		},
		sprints: {
			title: "Sprint Performance Reports",
			icon: RefreshCw,
			hook: useSprintReports,
			columns: [
				{
					header: "Sprint Name",
					key: "name",
					render: (item: any) => (
						<span className="font-bold text-gray-900">{item.name}</span>
					),
				},
				{
					header: "Status",
					key: "status",
					render: (item: SprintReport) => (
						<span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">
							{item.status}
						</span>
					),
				},
				{
					header: "Stories",
					key: "userStoriesCount",
					render: (item: SprintReport) => (
						<span className="font-black text-gray-900">
							{item.userStoriesCount}
						</span>
					),
				},
				{
					header: "Completion",
					key: "completionRate",
					render: (item: SprintReport) => (
						<div className="flex items-center gap-3">
							<div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
								<div
									className="h-full bg-indigo-500 transition-all duration-1000"
									style={{ width: `${Math.round(item.completionRate)}%` }}
								/>
							</div>
							<span className="text-sm font-black text-indigo-600">
								{Math.round(item.completionRate)}%
							</span>
						</div>
					),
				},
				{
					header: "Duration",
					key: "timeline",
					render: (item: SprintReport) => (
						<span className="text-xs font-bold text-gray-400">
							{new Date(item.startDate).toLocaleDateString()} to{" "}
							{new Date(item.endDate).toLocaleDateString()}
						</span>
					),
				},
			],
		},
		stories: {
			title: "User Story Tracking",
			icon: FileText,
			hook: useUserStoryReports,
			columns: [
				{
					header: "Title",
					key: "title",
					render: (item: StoryReport) => (
						<span className="font-bold text-gray-900 max-w-xs truncate block">
							{item.title}
						</span>
					),
				},
				{
					header: "Status",
					key: "status",
					render: (item: StoryReport) => (
						<span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase">
							{item.status}
						</span>
					),
				},
				{
					header: "Points",
					key: "estimationPoints",
					render: (item: StoryReport) => (
						<span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">
							{item.estimationPoints} pts
						</span>
					),
				},
				{
					header: "Assignees",
					key: "assignedUsers",
					render: (item: StoryReport) => (
						<div className="flex flex-wrap gap-1">
							{item.assignedUsers?.map((name: string, i: number) => (
								<span
									key={i}
									className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold"
								>
									{name}
								</span>
							))}
						</div>
					),
				},
			],
		},
		subtasks: {
			title: "Subtask Details",
			icon: CheckSquare,
			hook: useSubtaskReports,
			columns: [
				{
					header: "Task",
					key: "title",
					render: (item: SubtaskReport) => (
						<span className="font-bold text-gray-900">{item.title}</span>
					),
				},
				{
					header: "Assignee",
					key: "assignedUserName",
					render: (item: SubtaskReport) => (
						<span className="text-sm font-medium text-gray-600">
							{item.assignedUserName || "Unassigned"}
						</span>
					),
				},
				{
					header: "Status",
					key: "status",
					render: (item: any) => (
						<span
							className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
								item.status === "Done"
									? "bg-emerald-50 text-emerald-600"
									: "bg-orange-50 text-orange-600"
							}`}
						>
							{item.status}
						</span>
					),
				},
				{
					header: "Hours (Est/Act)",
					key: "hours",
					render: (item: any) => (
						<span className="text-xs font-bold text-gray-500">
							{item.estimatedHours || 0}h / {item.actualHours || 0}h
						</span>
					),
				},
				{
					header: "Engagement",
					key: "engagement",
					render: (item: any) => (
						<div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 capitalize">
							<span className="flex items-center gap-1">
								<FileText size={12} /> {item.attachmentsCount} Attach
							</span>
							<span className="flex items-center gap-1">
								<User size={12} /> {item.commentsCount} Comm
							</span>
						</div>
					),
				},
			],
		},
		performance: {
			title: "User Performance Metrics",
			icon: BarChart2,
			hook: useUserPerformanceReports,
			columns: [
				{
					header: "User",
					key: "name",
					render: (item: any) => (
						<div className="flex flex-col">
							<span className="font-bold text-gray-900">{item.name}</span>
							<span className="text-xs text-gray-400">{item.email}</span>
						</div>
					),
				},
				{
					header: "Tasks",
					key: "tasks",
					render: (item: any) => (
						<div className="text-xs font-bold">
							<span className="text-emerald-600">{item.tasksCompleted}</span> /{" "}
							<span className="text-gray-400">{item.tasksAssigned}</span>
						</div>
					),
				},
				{
					header: "Completion",
					key: "completionRate",
					render: (item: any) => (
						<span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-xs">
							{Math.round(item.completionRate)}%
						</span>
					),
				},
				{
					header: "Time Logged",
					key: "totalHoursWorked",
					render: (item: PerformanceReport) => (
						<div className="flex items-center gap-1.5 font-bold text-gray-900">
							<Calendar size={14} className="text-indigo-400" />
							{item.totalHoursWorked || 0}{" "}
							<span className="text-gray-400 font-medium">hrs</span>
						</div>
					),
				},
			],
		},
	};

	const currentConfig = reportsConfig[activeTab];
	const { data, isLoading } = currentConfig.hook(queryParams);

	const handleTabChange = (tab: ReportTab) => {
		setActiveTab(tab);
		setPage(1);
	};

	const handleResetFilters = () => {
		setFilters({ projectId: "", startDate: "", endDate: "", status: "" });
		setSearch("");
	};

	return (
		<div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">
						Reports Dashboard
					</h1>
					<p className="text-gray-500 font-medium text-lg">
						Detailed operational tracking and performance logs.
					</p>
				</div>
			</div>

			{/* Filter Bar */}
			<div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
				<div className="flex items-center gap-2 mb-2">
					<Filter size={18} className="text-indigo-600" />
					<h2 className="font-black text-gray-900 uppercase tracking-widest text-xs">
						Global Filters
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="space-y-1.5">
						<label className="text-[10px] font-black text-gray-400 uppercase ml-1">
							Project
						</label>
						<select
							value={filters.projectId}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, projectId: e.target.value }))
							}
							className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
						>
							<option value="">All Projects</option>
							{projects.map((p: IProject) => (
								<option key={p.id} value={p.id}>
									{p.name}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-[10px] font-black text-gray-400 uppercase ml-1">
							Start Date
						</label>
						<input
							type="date"
							value={filters.startDate}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, startDate: e.target.value }))
							}
							className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-[10px] font-black text-gray-400 uppercase ml-1">
							End Date
						</label>
						<input
							type="date"
							value={filters.endDate}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, endDate: e.target.value }))
							}
							className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
						/>
					</div>

					<div className="flex items-end gap-2">
						<button
							onClick={handleResetFilters}
							className="flex-1 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-black transition-all border border-gray-100"
						>
							Reset
						</button>
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-50 rounded-2xl w-fit border border-gray-100">
				{(Object.keys(reportsConfig) as ReportTab[]).map((tab) => {
					const Icon = reportsConfig[tab].icon;
					return (
						<button
							key={tab}
							onClick={() => handleTabChange(tab)}
							className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black tracking-tight transition-all ${
								activeTab === tab
									? "bg-white text-indigo-600 shadow-sm"
									: "text-gray-400 hover:text-gray-900 hover:bg-white/50"
							}`}
						>
							<Icon size={18} />
							<span className="capitalize">{tab}</span>
						</button>
					);
				})}
			</div>

			{/* Main Table */}
			<PaginatedTable
				title={currentConfig.title}
				columns={currentConfig.columns as any}
				data={data?.data || []}
				total={data?.total || 0}
				page={page}
				limit={limit}
				onPageChange={setPage}
				onLimitChange={setLimit}
				onSearch={setSearch}
				isLoading={isLoading}
			/>
		</div>
	);
}
