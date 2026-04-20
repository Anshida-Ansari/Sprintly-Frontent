import {
	AlertTriangle,
	ArrowUpRight,
	CalendarClock,
	CheckCircle2,
	ChevronRight,
	Crown,
	FolderOpen,
	Layers,
	Play,
	Plus,
	RefreshCw,
	Target,
	Users,
	Video,
	Zap,
} from "lucide-react";
// Refresh
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { buildPath, ROUTES } from "../../../constants/routes";
import { UserAuth } from "../../auth/store/store";
import InviteMemberBtn from "../components/invite.member.btn";
import InviteMemberModal from "../components/invite.modal";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useInviteMember } from "../hooks/useInviteMember";

export default function AdminDashboard() {
	const navigate = useNavigate();
	const user = UserAuth((state) => state.user);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { mutate: inviteMember, isPending } = useInviteMember();
	const { data: statsRes } = useDashboardStats();
	const handleInvite = (data: {
		name: string;
		email: string;
		role: string;
	}) => {
		inviteMember(data, {
			onSuccess: () => setIsModalOpen(false),
		});
	};

	const dashboardStats = statsRes?.data;

	const stats = [
		{
			label: "Total Projects",
			value: dashboardStats?.totalProjects?.toString() || "0",
			icon: Layers,
			color: "text-indigo-600",
			bg: "bg-indigo-50",
		},
		{
			label: "Active Projects",
			value: dashboardStats?.activeProjects?.toString() || "0",
			icon: FolderOpen,
			color: "text-blue-600",
			bg: "bg-blue-50",
		},
		{
			label: "Total Users",
			value: dashboardStats?.totalUsers?.toString() || "0",
			icon: Users,
			color: "text-purple-600",
			bg: "bg-purple-50",
		},
		{
			label: "Total Stories",
			value: dashboardStats?.totalUserStories?.toString() || "0",
			icon: Target,
			color: "text-amber-600",
			bg: "bg-amber-50",
		},
		{
			label: "Active Sprints",
			value: dashboardStats?.runningSprints?.toString() || "0",
			icon: Play,
			color: "text-emerald-600",
			bg: "bg-emerald-50",
		},
	];

	const storyData = [
		{
			name: "Pending",
			value: dashboardStats?.userStoriesByStatus?.pending || 0,
			color: "#94a3b8",
		},
		{
			name: "In Progress",
			value: dashboardStats?.userStoriesByStatus?.inProgress || 0,
			color: "#6366f1",
		},
		{
			name: "Completed",
			value: dashboardStats?.userStoriesByStatus?.done || 0,
			color: "#10b981",
		},
	].filter((d) => d.value > 0);

	// const COLORS = ["#94a3b8", "#6366f1", "#10b981"];

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
							Welcome back, {user?.name || "User"} ðŸ‘‹
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
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:translate-y-[-4px] transition-all duration-300"
					>
						<div
							className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}
						>
							<stat.icon size={20} className={stat.color} />
						</div>
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
							{stat.label}
						</p>
						<h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
					</div>
				))}
			</div>

			{/* Subscription Status Banner */}
			{(() => {
				const plan = dashboardStats?.companyPlan ?? "free";
				const isPro = plan.toLowerCase() === "pro";
				const limit = dashboardStats?.projectLimit ?? 2;
				const used = dashboardStats?.activeProjects ?? 0;
				const usagePct =
					limit === -1 ? 0 : Math.min(Math.round((used / limit) * 100), 100);
				const endDate = dashboardStats?.subscriptionEndDate
					? new Date(dashboardStats.subscriptionEndDate)
					: null;
				const daysLeft = endDate
					? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
					: null;
				const nearLimit = limit !== -1 && used >= limit;
				const expiringSoon = daysLeft !== null && daysLeft <= 7;

				return (
					<div
						className={`rounded-3xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
							isPro
								? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100"
								: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
						}`}
					>
						{/* Left: Plan Info */}
						<div className="flex items-center gap-4">
							<div
								className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
									isPro ? "bg-indigo-600" : "bg-amber-500"
								}`}
							>
								<Crown size={22} className="text-white" />
							</div>
							<div>
								<div className="flex items-center gap-2 mb-0.5">
									<p className="text-lg font-black text-gray-900">
										{isPro ? "Pro Plan" : "Free Plan"}
									</p>
									<span
										className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
											isPro
												? "bg-indigo-100 text-indigo-700"
												: "bg-amber-100 text-amber-700"
										}`}
									>
										{isPro ? "Active" : "Limited"}
									</span>
								</div>
								{isPro && endDate && (
									<p
										className={`text-xs font-semibold flex items-center gap-1 ${
											expiringSoon ? "text-rose-500" : "text-gray-500"
										}`}
									>
										{expiringSoon ? (
											<AlertTriangle size={12} />
										) : (
											<CalendarClock size={12} />
										)}
										{expiringSoon
											? `Expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}!`
											: `Renews on ${endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
										{dashboardStats?.autoRenew
											? " â€¢ Auto-renew ON"
											: " â€¢ Auto-renew OFF"}
									</p>
								)}
								{!isPro && (
									<p className="text-xs text-gray-500 font-medium">
										Upgrade to Pro for unlimited projects & more.
									</p>
								)}
							</div>
						</div>

						{/* Middle: Project Usage */}
						<div className="flex-1 min-w-[180px] max-w-xs">
							<div className="flex justify-between items-center mb-1.5">
								<p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
									Project Usage
								</p>
								<p
									className={`text-xs font-bold ${nearLimit ? "text-rose-600" : "text-gray-700"}`}
								>
									{used} / {limit === -1 ? "âˆž" : limit}
								</p>
							</div>
							<div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
								<div
									className={`h-full rounded-full transition-all duration-500 ${
										nearLimit
											? "bg-rose-500"
											: isPro
												? "bg-indigo-500"
												: "bg-amber-500"
									}`}
									style={{ width: limit === -1 ? "10%" : `${usagePct}%` }}
								/>
							</div>
							{nearLimit && !isPro && (
								<p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
									<AlertTriangle size={10} /> Project limit reached
								</p>
							)}
						</div>

						{/* Right: CTA */}
						{!isPro && (
							<button
								onClick={() => navigate(buildPath.admin(ROUTES.ADMIN.SETTINGS))}
								className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm whitespace-nowrap"
							>
								<Zap size={15} fill="currentColor" /> Upgrade to Pro
							</button>
						)}
					</div>
				);
			})()}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-8">
					{/* User Story & Sprint Snapshot Row */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* User Story Status Overview */}
						<div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-bold text-gray-900">
									User Story Status
								</h3>
								<Target size={20} className="text-indigo-600" />
							</div>
							<div className="h-[200px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={storyData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{storyData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip
											contentStyle={{
												borderRadius: "12px",
												border: "none",
												boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
											}}
										/>
										<Legend
											verticalAlign="bottom"
											height={36}
											iconType="circle"
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="grid grid-cols-3 gap-2 mt-4">
								<div className="text-center">
									<p className="text-[10px] font-bold text-gray-400 uppercase">
										Pending
									</p>
									<p className="text-lg font-bold text-gray-700">
										{dashboardStats?.userStoriesByStatus?.pending || 0}
									</p>
								</div>
								<div className="text-center">
									<p className="text-[10px] font-bold text-gray-400 uppercase">
										In Progress
									</p>
									<p className="text-lg font-bold text-indigo-600">
										{dashboardStats?.userStoriesByStatus?.inProgress || 0}
									</p>
								</div>
								<div className="text-center">
									<p className="text-[10px] font-bold text-gray-400 uppercase">
										Done
									</p>
									<p className="text-lg font-bold text-emerald-600">
										{dashboardStats?.userStoriesByStatus?.done || 0}
									</p>
								</div>
							</div>
						</div>

						{/* Active Sprint Snapshot */}
						<div className="bg-white rounded-[2rem] border border-indigo-50 p-8 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 pointer-events-none" />

							<div className="flex items-center justify-between mb-6 relative z-10">
								<h3 className="text-xl font-bold text-gray-900">
									Active Sprint
								</h3>
								<div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
									On Track
								</div>
							</div>

							{dashboardStats?.activeSprint ? (
								<div className="space-y-6 relative z-10">
									<div>
										<p className="text-xs font-bold text-gray-400 uppercase mb-1">
											Current Sprint
										</p>
										<h4 className="text-2xl font-black text-gray-900 leading-tight">
											{dashboardStats.activeSprint.name}
										</h4>
									</div>

									<div className="space-y-2">
										<div className="flex justify-between items-end">
											<p className="text-sm font-bold text-gray-600">
												Progress
											</p>
											<p className="text-sm font-black text-indigo-600">
												{dashboardStats.activeSprint.completedTasks}/
												{dashboardStats.activeSprint.totalTasks} Tasks
											</p>
										</div>
										<div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000"
												style={{
													width: `${dashboardStats.activeSprint.totalTasks > 0 ? (dashboardStats.activeSprint.completedTasks / dashboardStats.activeSprint.totalTasks) * 100 : 0}%`,
												}}
											/>
										</div>
									</div>

									<div className="flex items-center gap-4 pt-2">
										<div className="flex-1 bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
											<p className="text-[10px] font-bold text-indigo-400 uppercase">
												Days Left
											</p>
											<p className="text-xl font-black text-indigo-700">
												{(() => {
													const end = new Date(
														dashboardStats.activeSprint.endDate,
													);
													const diff = end.getTime() - Date.now();
													const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
													return days > 0 ? days : 0;
												})()}
											</p>
										</div>
										<div className="flex-1 bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
											<p className="text-[10px] font-bold text-emerald-400 uppercase">
												Completion
											</p>
											<p className="text-xl font-black text-emerald-700">
												{dashboardStats.activeSprint.totalTasks > 0
													? Math.round(
															(dashboardStats.activeSprint.completedTasks /
																dashboardStats.activeSprint.totalTasks) *
																100,
														)
													: 0}
												%
											</p>
										</div>
									</div>
								</div>
							) : (
								<div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-60">
									<div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
										<CalendarClock size={32} className="text-gray-300" />
									</div>
									<p className="text-sm font-bold text-gray-500">
										No active sprint running
									</p>
									<button
										onClick={() =>
											navigate(buildPath.admin(ROUTES.ADMIN.SPRINTS))
										}
										className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
									>
										Start a new sprint
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Live Activity Feed */}
					<div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
						<div className="flex items-center justify-between mb-8">
							<h3 className="text-2xl font-bold text-gray-900">
								Live Activity
							</h3>
							<button className="text-sm font-bold text-indigo-600 px-4 py-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
								History
							</button>
						</div>
						<div className="space-y-6">
							{/* Dynamic Activity List */}
							{dashboardStats?.liveActivity?.length > 0 ? (
								dashboardStats.liveActivity
									.slice(0, 6)
									.map((item: any, i: number) => {
										const colors = [
											"bg-blue-500",
											"bg-emerald-500",
											"bg-purple-500",
											"bg-orange-500",
											"bg-indigo-500",
										];
										const colorClass = colors[i % colors.length];
										return (
											<div
												key={item.id}
												className="flex items-center gap-4 group cursor-pointer"
											>
												<div
													className={`${colorClass} w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-110 transition-transform uppercase`}
												>
													{item.title ? item.title.slice(0, 2) : "ST"}
												</div>
												<div className="flex-1">
													<p className="text-gray-700 text-sm">
														<span className="font-bold text-gray-900">
															{item.title}
														</span>{" "}
														- {item.status}
													</p>
													<p className="text-[11px] font-bold text-gray-400 mt-0.5">
														{new Date(
															item.updatedAt || item.createdAt,
														).toLocaleDateString("en-IN", {
															day: "numeric",
															month: "short",
															hour: "2-digit",
															minute: "2-digit",
														})}
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
									<p className="text-gray-400 font-medium text-sm">
										No recent activity detected in the workspace.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Quick Actions & Progress Tracker Column */}
				<div className="space-y-8">
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

						{/* Small stats section at the bottom of actions */}
						<div className="mt-8 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
							<div className="flex items-center gap-2 mb-3">
								<div className="p-1.5 bg-white rounded-lg text-indigo-600 shadow-sm">
									<CheckCircle2 size={16} />
								</div>
								<p className="text-xs font-bold text-indigo-600 uppercase">
									Workspace Health
								</p>
							</div>
							<div className="flex justify-between items-end mb-2">
								<p className="text-sm font-bold text-gray-900">
									{dashboardStats?.subTasksByStatus?.completed || 0}/
									{dashboardStats?.totalSubTasks || 0} Tasks
								</p>
								<p className="text-xs font-black text-indigo-600">
									{dashboardStats?.totalSubTasks
										? Math.round(
												((dashboardStats?.subTasksByStatus?.completed || 0) /
													dashboardStats?.totalSubTasks) *
													100,
											)
										: 0}
									%
								</p>
							</div>
							<div className="w-full bg-white h-2 rounded-full overflow-hidden shadow-inner">
								<div
									className="bg-indigo-600 h-full rounded-full transition-all duration-700"
									style={{
										width: `${dashboardStats?.totalSubTasks ? Math.round(((dashboardStats?.subTasksByStatus?.completed || 0) / dashboardStats?.totalSubTasks) * 100) : 0}%`,
									}}
								></div>
							</div>
						</div>
					</div>

					{/* Secondary Summary */}
					<div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
						<h3 className="text-sm font-bold mb-6 text-gray-400 uppercase tracking-widest">
							Platform Insights
						</h3>
						<div className="space-y-6">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
									<Video size={22} className="text-orange-500" />
								</div>
								<div>
									<p className="text-2xl font-black text-gray-900">
										{dashboardStats?.totalMeetings || 0}
									</p>
									<p className="text-xs font-bold text-gray-400 uppercase">
										Virtual Meetings
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
									<ArrowUpRight size={22} className="text-emerald-500" />
								</div>
								<div>
									<p className="text-2xl font-black text-gray-900">
										{dashboardStats?.pendingReviews || 0}
									</p>
									<p className="text-xs font-bold text-gray-400 uppercase">
										Stories in Review
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<InviteMemberModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleInvite}
				isLoading={isPending}
			/>
		</div>
	);
}
