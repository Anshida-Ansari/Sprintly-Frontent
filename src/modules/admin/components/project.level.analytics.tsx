import {
	Activity,
	AlertCircle,
	CheckCircle2,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useAnalytics } from "../hooks/useAnalytics";

interface ProjectLevelAnalyticsProps {
	projectId: string;
}

const COLORS = [
	"#6366f1",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#ec4899",
];

export function ProjectLevelAnalytics({
	projectId,
}: ProjectLevelAnalyticsProps) {
	const { data: analytics, isLoading } = useAnalytics(projectId);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="h-32 bg-gray-100 rounded-2xl border border-gray-100"
					></div>
				))}
				<div className="lg:col-span-2 h-80 bg-gray-100 rounded-2xl border border-gray-100"></div>
				<div className="lg:col-span-2 h-80 bg-gray-100 rounded-2xl border border-gray-100"></div>
			</div>
		);
	}

	if (!analytics)
		return (
			<div className="p-8 text-center text-gray-500 italic">
				No analytics data available for this project.
			</div>
		);

	const {
		taskDistribution = [],
		tasksOverTime = [],
		userProductivity = [],
		sprintAnalytics = [],
		overallHealth = {
			totalStories: 0,
			completedStories: 0,
			totalEstimation: 0,
		},
		overdueCount = 0,
	} = analytics;

	const healthPercentage =
		overallHealth.totalStories > 0
			? Math.round(
					(overallHealth.completedStories / overallHealth.totalStories) * 100,
				)
			: 0;

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* --- Stats Overview --- */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Project Health"
					value={`${healthPercentage}%`}
					subtitle={`${overallHealth.completedStories} / ${overallHealth.totalStories} Stories Done`}
					icon={<Target className="text-indigo-600" size={24} />}
					color="from-indigo-50 to-white"
				/>
				<StatCard
					title="Overdue Tasks"
					value={overdueCount}
					subtitle="Requires immediate attention"
					icon={<AlertCircle className="text-rose-600" size={24} />}
					color="from-rose-50 to-white"
				/>
				<StatCard
					title="Total Estimation"
					value={overallHealth.totalEstimation}
					subtitle="Sprint points total"
					icon={<Activity className="text-amber-600" size={24} />}
					color="from-amber-50 to-white"
				/>
				<StatCard
					title="Active Team"
					value={userProductivity.length}
					subtitle="Contributors this project"
					icon={<Users className="text-emerald-600" size={24} />}
					color="from-emerald-50 to-white"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* --- Task Trends (Line Chart) --- */}
				<div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
								<TrendingUp size={20} className="text-indigo-600" />
								Completion Trends
							</h3>
							<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
								Last 30 Days Output
							</p>
						</div>
					</div>
					<div className="h-72 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={tasksOverTime}>
								<defs>
									<linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="#f1f5f9"
								/>
								<XAxis
									dataKey="date"
									stroke="#94a3b8"
									fontSize={10}
									fontWeight={700}
									axisLine={false}
									tickLine={false}
								/>
								<YAxis
									stroke="#94a3b8"
									fontSize={10}
									fontWeight={700}
									axisLine={false}
									tickLine={false}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: "16px",
										border: "none",
										boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
										fontWeight: "bold",
									}}
								/>
								<Area
									type="monotone"
									dataKey="completedTasks"
									stroke="#6366f1"
									strokeWidth={3}
									fillOpacity={1}
									fill="url(#colorTasks)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* --- Task Distribution (Pie Chart) --- */}
				<div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
								<CheckCircle2 size={20} className="text-indigo-600" />
								Status Distribution
							</h3>
							<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
								Current Task Breakdown
							</p>
						</div>
					</div>
					<div className="h-72 w-full flex items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={taskDistribution}
									cx="50%"
									cy="50%"
									innerRadius={70}
									outerRadius={100}
									paddingAngle={8}
									dataKey="count"
									nameKey="_id"
								>
									{taskDistribution.map((index: number) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
											stroke="none"
										/>
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										borderRadius: "16px",
										border: "none",
										boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
										fontWeight: "bold",
									}}
								/>
								<Legend verticalAlign="bottom" height={36} iconType="circle" />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* --- Team Productivity (Bar Chart) --- */}
				<div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm lg:col-span-2">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
								<Users size={20} className="text-indigo-600" />
								Team Productivity
							</h3>
							<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
								Tasks Completed vs Hours Logged
							</p>
						</div>
					</div>
					<div className="h-80 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={userProductivity}
								margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="#f1f5f9"
								/>
								<XAxis
									dataKey="name"
									stroke="#94a3b8"
									fontSize={11}
									fontWeight={800}
									axisLine={false}
									tickLine={false}
								/>
								<YAxis
									yAxisId="left"
									orientation="left"
									stroke="#6366f1"
									fontSize={10}
									fontWeight={800}
									axisLine={false}
									tickLine={false}
								/>
								<YAxis
									yAxisId="right"
									orientation="right"
									stroke="#10b981"
									fontSize={10}
									fontWeight={800}
									axisLine={false}
									tickLine={false}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: "16px",
										border: "none",
										boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
										fontWeight: "bold",
									}}
								/>
								<Bar
									yAxisId="left"
									dataKey="completedTasks"
									fill="#6366f1"
									radius={[10, 10, 0, 0]}
									name="Tasks Done"
								/>
								<Bar
									yAxisId="right"
									dataKey="totalHours"
									fill="#10b981"
									radius={[10, 10, 0, 0]}
									name="Hours Logged"
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* --- Sprint Completion (Bar Chart) --- */}
				<div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm lg:col-span-2">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
								<Activity size={20} className="text-indigo-600" />
								Sprint Performance
							</h3>
							<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
								Completion Rate % per Sprint
							</p>
						</div>
					</div>
					<div className="h-80 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={sprintAnalytics}>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="#f1f5f9"
								/>
								<XAxis
									dataKey="name"
									stroke="#94a3b8"
									fontSize={11}
									fontWeight={800}
									axisLine={false}
									tickLine={false}
								/>
								<YAxis
									stroke="#94a3b8"
									fontSize={10}
									fontWeight={800}
									axisLine={false}
									tickLine={false}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: "16px",
										border: "none",
										boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
										fontWeight: "bold",
									}}
								/>
								<Bar
									dataKey="completionRate"
									fill="#8b5cf6"
									radius={[10, 10, 0, 0]}
									name="Completion %"
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
}

function StatCard({ title, value, subtitle, icon, color }: any) {
	return (
		<div
			className={`p-6 rounded-[2rem] bg-gradient-to-br ${color} border border-gray-100 shadow-sm flex items-start gap-4 transition-transform hover:scale-[1.02] duration-300`}
		>
			<div className="p-3 bg-white rounded-2xl shadow-sm">{icon}</div>
			<div>
				<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
					{title}
				</p>
				<p className="text-2xl font-black text-gray-900 leading-none mb-1">
					{value}
				</p>
				<p className="text-[10px] font-bold text-gray-500">{subtitle}</p>
			</div>
		</div>
	);
}
