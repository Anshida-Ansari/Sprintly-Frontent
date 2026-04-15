import { useQuery } from "@tanstack/react-query";
import { 
    Area, 
    AreaChart, 
    Bar, 
    BarChart, 
    CartesianGrid, 
    Cell, 
    Pie, 
    PieChart, 
    ResponsiveContainer, 
    Tooltip, 
    XAxis, 
    YAxis
} from "recharts";
import { companyService } from "../services/company.services";
import { ArrowDown, ArrowUp, DollarSign, Users, Zap, TrendingUp, Briefcase, Activity } from "lucide-react";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function SuperAdminAnalytics() {
	const { data: revenue, isLoading: revLoading } = useQuery({
		queryKey: ["revenue-analytics"],
		queryFn: () => companyService.getRevenueAnalytics(),
	});

	const { data: metrics, isLoading: metLoading } = useQuery({
		queryKey: ["subscription-metrics"],
		queryFn: () => companyService.getSubscriptionMetrics(),
	});

    const { data: topCompanies, isLoading: topLoading } = useQuery({
        queryKey: ["top-companies"],
        queryFn: () => companyService.getTopCompanies(),
    });

    const { data: platform, isLoading: platLoading } = useQuery({
        queryKey: ["platform-analytics"],
        queryFn: () => companyService.getPlatformAnalytics(),
    });

	if (revLoading || metLoading || topLoading || platLoading) {
		return (
			<div className="flex h-[calc(100vh-100px)] items-center justify-center font-bold text-gray-400 animate-pulse">
				Loading platform analytics...
			</div>
		);
	}

	const revData = revenue?.data;
	const metData = metrics?.data;
    const topData = topCompanies?.data || [];
    const platData = platform?.data;

    // Calculate Conversion Rate
    const conversionRate = Math.round((metData.paidUsers / metData.totalUsers) * 100);

	const stats = [
		{
			label: "Lifetime Revenue",
			value: `₹${revData.totalLifetimeRevenue.toLocaleString()}`,
			icon: DollarSign,
			color: "indigo",
		},
		{
			label: "Monthly Revenue",
			value: `₹${revData.currentMonthRevenue.toLocaleString()}`,
			growth: revData.revenueGrowthPercentage,
			icon: TrendingUp,
			color: "emerald",
		},
		{
			label: "Total Projects",
			value: platData.projectStats.totalProjects,
			icon: Briefcase,
			color: "blue",
		},
		{
			label: "Active Users (DAU)",
			value: platData.userStats.activeUsers,
			icon: Activity,
			color: "rose",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Analytics</h1>
				<p className="text-gray-500 font-medium">Comprehensive insights into growth, revenue, and usage.</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
					>
						<div className="flex items-center justify-between mb-4">
							<div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
								<stat.icon size={22} />
							</div>
							{stat.growth !== undefined && (
								<div className={`flex items-center gap-1 text-sm font-bold ${stat.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
									{stat.growth >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
									{Math.abs(stat.growth)}%
								</div>
							)}
						</div>
						<p className="text-sm font-bold text-gray-500 uppercase tracking-tight">{stat.label}</p>
						<h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
					</div>
				))}
			</div>

            {/* Platform Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Company Growth Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl font-bold text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="opacity-80 text-sm uppercase tracking-wider mb-2">Company Growth</p>
                        <h3 className="text-4xl font-black leading-none mb-4">{platData.companyStats.growthRate}%</h3>
                        <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full w-fit">
                            <TrendingUp size={14} />
                            <span>{platData.companyStats.newCompaniesThisMonth} new this month</span>
                        </div>
                    </div>
                    <Users className="absolute -right-4 -bottom-4 text-white/10" size={120} />
                </div>

                {/* Conversion Rate Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl font-bold text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="opacity-80 text-sm uppercase tracking-wider mb-2">Conversion (Free &rarr; Pro)</p>
                        <h3 className="text-4xl font-black leading-none mb-4">{conversionRate}%</h3>
                        <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full w-fit">
                            <Zap size={14} />
                            <span>{metData.paidUsers} / {metData.totalUsers} companies</span>
                        </div>
                    </div>
                    <Zap className="absolute -right-4 -bottom-4 text-white/10" size={120} />
                </div>

                {/* Platform Utilization */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl font-bold text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="opacity-80 text-sm uppercase tracking-wider mb-2">Projects per Company</p>
                        <h3 className="text-4xl font-black leading-none mb-4">{platData.projectStats.avgProjectsPerCompany}</h3>
                        <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full w-fit">
                            <Briefcase size={14} />
                            <span>{platData.projectStats.totalProjects} total projects</span>
                        </div>
                    </div>
                    <Briefcase className="absolute -right-4 -bottom-4 text-white/10" size={120} />
                </div>
            </div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Revenue Trends */}
				<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-8">
						<h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
						<span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Last 6 Months</span>
					</div>
					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={revData.revenueHistory}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
								<XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontWeight: 600, fontSize: 12}} dy={10} />
								<YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontWeight: 600, fontSize: 12}} />
								<Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
								<Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Project Health Chart */}
				<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-8">
						<h3 className="text-lg font-bold text-gray-900">Project Health</h3>
						<span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Overall Status</span>
					</div>
					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={[
                                { name: "Active", count: platData.projectStats.activeProjects, fill: "#6366f1" },
                                { name: "Completed", count: platData.projectStats.completedProjects, fill: "#10b981" }
                            ]}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
								<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontWeight: 600, fontSize: 12}} dy={10} />
								<YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontWeight: 600, fontSize: 12}} />
								<Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#F3F4F6' }} />
								<Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={60}>
                                    {
                                        [
                                            { name: "Active", count: platData.projectStats.activeProjects, fill: "#6366f1" },
                                            { name: "Completed", count: platData.projectStats.completedProjects, fill: "#10b981" }
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))
                                    }
                                </Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Top Performing Companies */}
				<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
					<h3 className="text-lg font-bold text-gray-900 mb-8">Top Power Users</h3>
					<div className="space-y-6">
						{topData.map((company: any, idx: number) => (
							<div key={idx} className="flex items-center justify-between group">
								<div className="flex items-center gap-4">
									<div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
										{idx + 1}
									</div>
									<div>
										<p className="font-bold text-gray-900">{company.companyName}</p>
										<p className="text-xs text-gray-500 font-medium">{company.userCount} Active Users</p>
									</div>
								</div>
								<div className="text-right">
									<p className="font-black text-gray-900">{company.projectCount}</p>
									<p className="text-[10px] font-bold text-gray-400 uppercase">Projects</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Plan Distribution */}
				<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
					<h3 className="text-lg font-bold text-gray-900 mb-8">Revenue Distribution</h3>
					<div className="h-[250px] w-full flex items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={metData.planDistribution}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={100}
									paddingAngle={8}
									dataKey="value"
								>
									{metData.planDistribution.map((_: any, index: number) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
									))}
								</Pie>
								<Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
							</PieChart>
						</ResponsiveContainer>
					</div>
                    <div className="flex justify-center gap-8 mt-4">
                        {metData.planDistribution.map((plan: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}} />
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">{plan.name} ({plan.value})</span>
                            </div>
                        ))}
                    </div>
				</div>
			</div>
		</div>
	);
}
