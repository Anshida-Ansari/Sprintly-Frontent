import {
	Activity,
	ArrowDown,
	ArrowUp,
	ArrowUpRight,
	BarChart3,
	Briefcase,
	Building2,
	CheckCircle,
	ChevronRight,
	Clock,
	Crown,
	DollarSign,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { companyService } from "../services/company.services";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from "recharts";

export default function SuperAdminDashboard() {
	const navigate = useNavigate();

	const { data: dashRaw, isLoading: dashLoading } = useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: () => companyService.getDashboardStats(),
	});

	const { data: revRaw, isLoading: revLoading } = useQuery({
		queryKey: ["revenue-analytics"],
		queryFn: () => companyService.getRevenueAnalytics(),
	});

	const { data: metRaw, isLoading: metLoading } = useQuery({
		queryKey: ["subscription-metrics"],
		queryFn: () => companyService.getSubscriptionMetrics(),
	});

	const { data: platRaw, isLoading: platLoading } = useQuery({
		queryKey: ["platform-analytics"],
		queryFn: () => companyService.getPlatformAnalytics(),
	});

	const isLoading = dashLoading || revLoading || metLoading || platLoading;

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-100px)] items-center justify-center">
				<div className="text-center space-y-3">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto" />
					<p className="text-sm font-bold text-gray-400 animate-pulse">Loading platform overview...</p>
				</div>
			</div>
		);
	}

	const dash = dashRaw?.data || {};
	const rev = revRaw?.data || {};
	const met = metRaw?.data || {};
	const plat = platRaw?.data || {};

	// Company stats
	const totalCompanies = dash.totalCompanies ?? 0;
	const approvedCompanies = dash.approvedCompanies ?? 0;
	const pendingCompanies = dash.pendingCompanies ?? 0;
	const recentCompanies = dash.recentCompanies ?? [];

	// Revenue
	const totalRevenue = rev.totalLifetimeRevenue ?? 0;
	const monthlyRevenue = rev.currentMonthRevenue ?? 0;
	const revenueGrowth: number = rev.revenueGrowthPercentage ?? 0;
	const revenueHistory: any[] = rev.revenueHistory ?? [];

	// Subscription
	const freeUsers = met.freeUsers ?? 0;
	const paidUsers = met.paidUsers ?? 0;
	const activeSubs = met.activeSubscriptions ?? 0;
	const conversionRate = met.totalUsers > 0
		? Math.round((paidUsers / met.totalUsers) * 100)
		: 0;
	const growthTrends: any[] = met.growthTrends ?? [];

	// Platform (Projects + Users)
	const totalProjects = plat.projectStats?.totalProjects ?? 0;
	const activeProjects = plat.projectStats?.activeProjects ?? 0;
	const completedProjects = plat.projectStats?.completedProjects ?? 0;
	const avgProjects = plat.projectStats?.avgProjectsPerCompany ?? 0;
	const totalUsers = plat.userStats?.totalUsers ?? 0;
	const dauUsers = plat.userStats?.activeUsers ?? 0;
	const avgUsersPerCompany = plat.userStats?.avgUsersPerCompany ?? 0;
	const companyGrowthRate = plat.companyStats?.growthRate ?? 0;

	const kpiCards = [
		{
			label: "Total Revenue",
			value: `₹${totalRevenue.toLocaleString()}`,
			sub: `₹${monthlyRevenue.toLocaleString()} this month`,
			icon: DollarSign,
			growth: revenueGrowth,
			color: "indigo",
		},
		{
			label: "Total Companies",
			value: totalCompanies,
			sub: `${pendingCompanies} pending approval`,
			icon: Building2,
			growth: companyGrowthRate,
			color: "blue",
		},
		{
			label: "Pro Subscribers",
			value: paidUsers,
			sub: `${conversionRate}% conversion rate`,
			icon: Crown,
			color: "amber",
		},
		{
			label: "Total Users",
			value: totalUsers,
			sub: `${dauUsers} active today (DAU)`,
			icon: Users,
			color: "emerald",
		},
		{
			label: "Active Subs",
			value: activeSubs,
			sub: `${freeUsers} on free plan`,
			icon: Zap,
			color: "purple",
		},
		{
			label: "Total Projects",
			value: totalProjects,
			sub: `${activeProjects} active · ${completedProjects} done`,
			icon: Briefcase,
			color: "rose",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black tracking-tight text-gray-900">Platform Overview</h1>
					<p className="text-gray-500 font-medium mt-1">Real-time business intelligence across your entire SaaS.</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => navigate("/superadmin/analytics")}
						className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm font-bold"
					>
						<BarChart3 size={17} /> Full Analytics
					</button>
					<button
						onClick={() => navigate("/superadmin/companies")}
						className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 text-sm font-bold"
					>
						<Building2 size={17} /> View Companies
					</button>
				</div>
			</div>

			{/* KPI Grid - 6 cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{kpiCards.map((card, i) => (
					<div
						key={i}
						className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
					>
						<div className="flex items-start justify-between mb-4">
							<div className={`p-2.5 rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
								<card.icon size={22} />
							</div>
							{"growth" in card && card.growth !== undefined && (
								<div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${card.growth >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
									{card.growth >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
									{Math.abs(card.growth)}%
								</div>
							)}
						</div>
						<h3 className="text-2xl font-black text-gray-900">{card.value}</h3>
						<p className="text-sm font-semibold text-gray-400 mt-0.5">{card.label}</p>
						<p className="text-xs text-gray-400 mt-1 font-medium">{card.sub}</p>
					</div>
				))}
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Revenue Trend */}
				<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
							<p className="text-xs text-gray-400 font-medium mt-0.5">Monthly revenue over last 6 months</p>
						</div>
						<span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
							{revenueGrowth >= 0 ? "+" : ""}{revenueGrowth}% MoM
						</span>
					</div>
					<div className="h-[220px]">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={revenueHistory}>
								<defs>
									<linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
										<stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
								<XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }} dy={8} />
								<YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }} />
								<Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.12)" }} />
								<Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#revGrad)" />
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* User Growth Trend */}
				<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-lg font-bold text-gray-900">Company Growth</h3>
							<p className="text-xs text-gray-400 font-medium mt-0.5">New company registrations over time</p>
						</div>
						<span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Last 7 Days</span>
					</div>
					<div className="h-[220px]">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={growthTrends}>
								<defs>
									<linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
										<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
								<XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }} dy={8} />
								<YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }} />
								<Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.12)" }} />
								<Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#growthGrad)" />
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Bottom Row: Quick Stats + Recent Companies */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Subscription Breakdown */}
				<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
					<h3 className="text-base font-bold text-gray-900 mb-5">Subscription Breakdown</h3>
					<div className="space-y-4">
						{[
							{ label: "Free Plan", value: freeUsers, total: totalCompanies, color: "#f59e0b" },
							{ label: "Pro Plan", value: paidUsers, total: totalCompanies, color: "#6366f1" },
							{ label: "Active Subs", value: activeSubs, total: paidUsers || 1, color: "#10b981" },
						].map((item) => {
							const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
							return (
								<div key={item.label}>
									<div className="flex justify-between items-center mb-1.5">
										<p className="text-xs font-bold text-gray-600">{item.label}</p>
										<p className="text-xs font-bold text-gray-900">{item.value} <span className="text-gray-400 font-medium">({pct}%)</span></p>
									</div>
									<div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
										<div
											className="h-full rounded-full transition-all duration-700"
											style={{ width: `${pct}%`, backgroundColor: item.color }}
										/>
									</div>
								</div>
							);
						})}
						<div className="pt-4 mt-2 border-t border-gray-50 grid grid-cols-2 gap-3">
							<div className="bg-indigo-50 rounded-2xl p-3 text-center">
								<p className="text-xl font-black text-indigo-700">{conversionRate}%</p>
								<p className="text-[10px] font-bold text-indigo-500 uppercase mt-0.5">Conversion</p>
							</div>
							<div className="bg-emerald-50 rounded-2xl p-3 text-center">
								<p className="text-xl font-black text-emerald-700">{avgProjects}</p>
								<p className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">Avg Projects</p>
							</div>
						</div>
					</div>
				</div>

				{/* Project & User Snapshot */}
				<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
					<h3 className="text-base font-bold text-gray-900 mb-5">Platform Health</h3>
					<div className="space-y-3">
						{[
							{ label: "Active Projects", value: activeProjects, icon: TrendingUp, color: "text-indigo-500 bg-indigo-50" },
							{ label: "Completed Projects", value: completedProjects, icon: CheckCircle, color: "text-emerald-500 bg-emerald-50" },
							{ label: "Approved Companies", value: approvedCompanies, icon: Building2, color: "text-blue-500 bg-blue-50" },
							{ label: "Pending Approvals", value: pendingCompanies, icon: Clock, color: "text-amber-500 bg-amber-50" },
							{ label: "DAU (Active Today)", value: dauUsers, icon: Activity, color: "text-rose-500 bg-rose-50" },
							{ label: "Avg Users / Company", value: avgUsersPerCompany, icon: Users, color: "text-purple-500 bg-purple-50" },
						].map((item) => (
							<div key={item.label} className="flex items-center justify-between group">
								<div className="flex items-center gap-3">
									<div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
										<item.icon size={15} />
									</div>
									<p className="text-sm font-semibold text-gray-600">{item.label}</p>
								</div>
								<p className="text-sm font-black text-gray-900">{item.value}</p>
							</div>
						))}
					</div>
				</div>

				{/* Recent Registrations */}
				<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
					<div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
						<h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
							<Activity className="text-indigo-600" size={18} />
							Recent Registrations
						</h3>
						<button
							onClick={() => navigate("/superadmin/companies")}
							className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-0.5"
						>
							View All <ChevronRight size={14} />
						</button>
					</div>
					<div className="divide-y divide-gray-50 flex-1">
						{recentCompanies.length > 0 ? (
							recentCompanies.slice(0, 5).map((company: any, i: number) => {
								const statusColors: any = {
									approved: "bg-emerald-50 text-emerald-700",
									rejected: "bg-rose-50 text-rose-700",
									pending: "bg-amber-50 text-amber-700",
								};
								return (
									<div
										key={i}
										className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/60 cursor-pointer transition-colors"
										onClick={() => navigate(`/superadmin/companies/${company._id}`)}
									>
										<div className="flex items-center gap-3">
											<div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
												{company.companyName?.charAt(0).toUpperCase()}
											</div>
											<div>
												<p className="text-sm font-bold text-gray-900 leading-none">{company.companyName}</p>
												<p className="text-[11px] text-gray-400 mt-0.5">{new Date(company.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
											</div>
										</div>
										<span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[company.status] || "bg-gray-50 text-gray-500"}`}>
											{company.status}
										</span>
									</div>
								);
							})
						) : (
							<div className="p-8 text-center text-gray-400 text-sm">No recent registrations.</div>
						)}
					</div>
					<div className="px-6 py-4 border-t border-gray-50">
						<button
							onClick={() => navigate("/superadmin/analytics")}
							className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
						>
							<BarChart3 size={16} /> View Full Analytics <ArrowUpRight size={14} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
