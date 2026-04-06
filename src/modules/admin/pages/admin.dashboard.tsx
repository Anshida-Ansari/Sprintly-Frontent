import {
	ArrowUpRight,
	ChevronRight,
	Clock,
	FolderOpen,
	Play,
	Plus,
	RefreshCw,
	Zap,
	Video,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../auth/store/store";
import InviteMemberBtn from "../components/invite.member.btn";
import InviteMemberModal from "../components/invite.modal";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useInviteMember } from "../hooks/useInviteMember";
import { buildPath, ROUTES } from "../../../constants/routes";
import { useProjects } from "../hooks/useProjects";
import { useGetSprints } from "../hooks/useSprints";
import { useSprintBurndown } from "../../../shared/hooks/useBurndown";
import { BurnDownChart } from "../../../shared/components/charts/BurnDownChart";

export default function AdminDashboard() {
	const navigate = useNavigate();
	const user = UserAuth((state) => state.user);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { mutate: inviteMember, isPending } = useInviteMember();
	const { data: statsRes } = useDashboardStats();

	const { data: projectsData } = useProjects({ page: 1, limit: 1 });
	const currentProject = projectsData?.data?.[0];

	const { data: sprintsData } = useGetSprints(
		currentProject?.id || "",
		{ page: 1, limit: 1, status: "ACTIVE" as any }
	);
	const activeSprint = sprintsData?.data?.[0];

	const { data: burndownData, isLoading: burndownLoading } = useSprintBurndown(activeSprint?.id || null);

	const handleInvite = (data: { name: string; email: string; role: string }) => {
		inviteMember(data, {
			onSuccess: () => setIsModalOpen(false),
		});
	};

	const dashboardStats = statsRes?.data;

	const stats = [
		{
			label: "Active Projects",
			value: dashboardStats?.activeProjects?.toString() || "0",
			icon: FolderOpen,
			color: "text-blue-600",
			bg: "bg-blue-50",
		},
		{
			label: "Running Sprints",
			value: dashboardStats?.runningSprints?.toString() || "0",
			icon: Play,
			color: "text-emerald-600",
			bg: "bg-emerald-50",
		},
		{
			label: "Pending Reviews",
			value: dashboardStats?.pendingReviews?.toString() || "0",
			icon: Clock,
			color: "text-orange-600",
			bg: "bg-orange-50",
		},
	];

	return (
		<div className="max-w-7xl mx-auto space-y-8">
			{/* 1. Refined Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">
						Dashboard
					</h1>
					<p className="text-gray-500 font-medium">
						Monitoring your workspace in real-time.
					</p>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
						<div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
							<Zap size={20} fill="currentColor" />
						</div>
						<div className="pr-4">
							<p className="text-[10px] font-bold text-gray-400 uppercase leading-none">
								Active Projects
							</p>
							<p className="text-sm font-bold text-gray-900">
								{dashboardStats?.activeProjects || 0} Running
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 2. Medium Blue Banner (Responsive & Stylish) */}
			<div className="relative overflow-hidden bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100">
				<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div className="max-w-xl">
						<h2 className="text-2xl lg:text-3xl font-bold mb-2">
							Welcome back, {user?.name || "User"} 👋
						</h2>
						<p className="text-indigo-100 text-lg opacity-90 font-medium">
							You have{" "}
							<span className="text-white font-bold underline decoration-indigo-400 underline-offset-4">
								{dashboardStats?.pendingReviews || 0} reviews
							</span>{" "}
							pending for the current sprint. Your team is waiting for your
							feedback!
						</p>
					</div>
					<button className="w-fit px-6 py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
						Start Review <ArrowUpRight size={18} />
					</button>
				</div>
				{/* Abstract shapes for visual interest */}
				<div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
				<div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
			</div>

			{/* 3. Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:translate-y-[-4px] transition-all duration-300"
					>
						<div
							className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}
						>
							<stat.icon size={24} className={stat.color} />
						</div>
						<p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
							{stat.label}
						</p>
						<h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
					</div>
				))}

				<div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-3xl border border-orange-200 shadow-sm hover:translate-y-[-4px] transition-all duration-300">
					<div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
						<Video size={24} className="text-orange-500" />
					</div>
					<p className="text-xs font-bold text-orange-500 uppercase tracking-widest leading-none mb-1">
						Meeting Stats
					</p>
					<h3 className="text-3xl font-black text-gray-900 pt-1">
						{dashboardStats?.totalMeetings || 0}
					</h3>
				</div>
			</div>

			{/* 4. Activity & Actions Area */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
					<div className="flex items-center justify-between mb-8">
						<h3 className="text-2xl font-bold text-gray-900">Live Activity</h3>
						<button className="text-sm font-bold text-indigo-600 px-4 py-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
							History
						</button>
					</div>
					<div className="space-y-6">
						{/* Dynamic Activity List */}
						{dashboardStats?.liveActivity?.length > 0 ? (
							dashboardStats.liveActivity.slice(0, 5).map((item: any, i: number) => {
								const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500", "bg-indigo-500"];
								const colorClass = colors[i % colors.length];
								return (
									<div
										key={item.id}
										className="flex items-center gap-4 group cursor-pointer"
									>
										<div
											className={`${colorClass} w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-110 transition-transform uppercase`}
										>
											ST
										</div>
										<div className="flex-1">
											<p className="text-gray-700 text-sm">
												<span className="font-bold text-gray-900">
													{item.title}
												</span>{" "}
												- {item.status}
											</p>
											<p className="text-[11px] font-bold text-gray-400 mt-0.5">
												{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
											</p>
										</div>
										<ChevronRight
											size={18}
											className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all mr-2"
										/>
									</div>
								);
							})
						) : (
							<div className="text-center py-8">
								<p className="text-gray-400 font-medium text-sm">No recent activity detected in the workspace.</p>
							</div>
						)}
					</div>
				</div>

				{/* REFINED QUICK ACTIONS - NO MORE BLACK BOX */}
				<div className="bg-white rounded-[2rem] border border-indigo-100 p-8 shadow-xl shadow-indigo-100/20 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-10 -mt-10 pointer-events-none" />

					<h3 className="text-xl font-bold text-gray-900 mb-6 relative z-10">
						Quick Actions
					</h3>

					<div className="space-y-3 relative z-10">
						<button
							onClick={() => navigate(buildPath.admin(ROUTES.ADMIN.PROJECTS))}
							className="w-full group bg-white hover:bg-indigo-600 text-gray-900 hover:text-white border border-gray-100 hover:border-indigo-600 py-4 px-6 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-sm"
						>
							<div className="p-2 bg-indigo-50 group-hover:bg-indigo-500 rounded-lg text-indigo-600 group-hover:text-white transition-colors">
								<Plus size={20} />
							</div>
							New Project
						</button>

						<button
							onClick={() => navigate(buildPath.admin(ROUTES.ADMIN.SPRINTS))}
							className="w-full group bg-white hover:bg-emerald-600 text-gray-900 hover:text-white border border-gray-100 hover:border-emerald-600 py-4 px-6 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-sm"
						>
							<div className="p-2 bg-emerald-50 group-hover:bg-emerald-500 rounded-lg text-emerald-600 group-hover:text-white transition-colors">
								<RefreshCw size={20} />
							</div>
							Start Sprint
						</button>

						<div className="pt-4 border-t border-gray-50 mt-4">
							<InviteMemberBtn onClick={() => setIsModalOpen(true)} />
						</div>
					</div>

					<div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
						<p className="text-xs font-bold text-indigo-600 uppercase mb-1">
							Task Progress
						</p>
						<div className="flex justify-between items-end">
							<p className="text-sm font-bold text-gray-900">
								{dashboardStats?.subTasksByStatus?.completed || 0}/{dashboardStats?.totalSubTasks || 0} Tasks
							</p>
							<p className="text-xs font-bold text-indigo-600">
								{dashboardStats?.totalSubTasks ? Math.round(((dashboardStats?.subTasksByStatus?.completed || 0) / dashboardStats?.totalSubTasks) * 100) : 0}%
							</p>
						</div>
						<div className="w-full bg-indigo-200 h-1.5 rounded-full mt-2 overflow-hidden">
							<div
								className="bg-indigo-600 h-full rounded-full transition-all duration-500"
								style={{ width: `${dashboardStats?.totalSubTasks ? Math.round(((dashboardStats?.subTasksByStatus?.completed || 0) / dashboardStats?.totalSubTasks) * 100) : 0}%` }}
							></div>
						</div>
					</div>
				</div>
			</div>

			{/* 5. Team Performance & Burn Down Section */}
			{currentProject && activeSprint && (
				<div className="mt-8">
					<BurnDownChart 
						data={burndownData || []} 
						isLoading={burndownLoading}
						title={`${currentProject.name} : ${activeSprint.name} - Team Performance`}
						description="Track the entire team's logged hours against estimated subtasks for this sprint."
					/>
				</div>
			)}
			
			<InviteMemberModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleInvite}
				isLoading={isPending}
			/>
		</div>
	);
}
