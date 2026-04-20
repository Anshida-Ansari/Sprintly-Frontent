import {
	BarChart2,
	Calendar,
	CheckSquare,
	FileText,
	RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { PaginatedTable } from "../../../shared/components/PaginatedTable";
import {
	useSprintReports,
	useSubtaskReports,
	useUserPerformanceReports,
	useUserStoryReports,
} from "../../reports/hooks/useReports";

type ProjectReportTab = "sprints" | "stories" | "tasks" | "users";

interface ProjectLevelReportsProps {
	projectId: string;
}

export function ProjectLevelReports({ projectId }: ProjectLevelReportsProps) {
	const [activeTab, setActiveTab] = useState<ProjectReportTab>("sprints");
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState("");

	const queryParams = {
		page,
		limit,
		search,
		projectId,
	};

	const reportsConfig = {
		sprints: {
			title: "Sprint Performance",
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
					render: (item: any) => (
						<span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">
							{item.status}
						</span>
					),
				},
				{
					header: "Stories",
					key: "userStoriesCount",
					render: (item: any) => (
						<span className="font-black text-gray-900">
							{item.userStoriesCount}
						</span>
					),
				},
				{
					header: "Completion",
					key: "completionRate",
					render: (item: any) => (
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
					render: (item: any) => (
						<span className="text-xs font-bold text-gray-400">
							{new Date(item.startDate).toLocaleDateString()} to{" "}
							{new Date(item.endDate).toLocaleDateString()}
						</span>
					),
				},
			],
		},
		stories: {
			title: "User Story Reports",
			icon: FileText,
			hook: useUserStoryReports,
			columns: [
				{
					header: "Title",
					key: "title",
					render: (item: any) => (
						<span className="font-bold text-gray-900 max-w-xs truncate block">
							{item.title}
						</span>
					),
				},
				{
					header: "Status",
					key: "status",
					render: (item: any) => (
						<span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase">
							{item.status}
						</span>
					),
				},
				{
					header: "Points",
					key: "estimationPoints",
					render: (item: any) => (
						<span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">
							{item.estimationPoints} pts
						</span>
					),
				},
				{
					header: "Assignees",
					key: "assignedUsers",
					render: (item: any) => (
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
		tasks: {
			title: "Task Level Data",
			icon: CheckSquare,
			hook: useSubtaskReports,
			columns: [
				{
					header: "Task",
					key: "title",
					render: (item: any) => (
						<span className="font-bold text-gray-900">{item.title}</span>
					),
				},
				{
					header: "Assignee",
					key: "assignedUserName",
					render: (item: any) => (
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
								["Done", "done", "completed"].includes(item.status)
									? "bg-emerald-50 text-emerald-600"
									: "bg-orange-50 text-orange-600"
							}`}
						>
							{item.status}
						</span>
					),
				},
				{
					header: "Hours",
					key: "hours",
					render: (item: any) => (
						<span className="text-xs font-bold text-gray-500">
							{item.estimatedHours || 0}h
						</span>
					),
				},
				{
					header: "Engagement",
					key: "engagement",
					render: (item: any) => (
						<div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
							<span className="flex items-center gap-1 uppercase tracking-tighter">
								<FileText size={12} /> {item.attachmentsCount} Attachments
							</span>
							<span className="flex items-center gap-1 uppercase tracking-tighter">
								<BarChart2 size={12} /> {item.commentsCount} Comments
							</span>
						</div>
					),
				},
			],
		},
		users: {
			title: "Team Performance",
			icon: BarChart2,
			hook: useUserPerformanceReports,
			columns: [
				{
					header: "Team Member",
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
					render: (item: any) => (
						<div className="flex items-center gap-1.5 font-bold text-gray-900">
							<Calendar size={14} className="text-indigo-400" />
							{item.totalHoursWorked || 0}{" "}
							<span className="text-gray-400 font-medium text-xs">hrs</span>
						</div>
					),
				},
			],
		},
	};

	const currentConfig = reportsConfig[activeTab];
	const { data, isLoading } = currentConfig.hook(queryParams);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center gap-2 p-1 bg-gray-50 rounded-xl w-fit border border-gray-100 mb-4">
				{(Object.keys(reportsConfig) as ProjectReportTab[]).map((tab) => {
					const Icon = reportsConfig[tab].icon;
					return (
						<button
							key={tab}
							onClick={() => {
								setActiveTab(tab);
								setPage(1);
							}}
							className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
								activeTab === tab
									? "bg-white text-indigo-600 shadow-sm"
									: "text-gray-400 hover:text-gray-700"
							}`}
						>
							<Icon size={14} />
							<span className="capitalize">
								{tab === "users" ? "Team Performance" : tab}
							</span>
						</button>
					);
				})}
			</div>

			<PaginatedTable
				title={currentConfig.title}
				columns={currentConfig.columns}
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
