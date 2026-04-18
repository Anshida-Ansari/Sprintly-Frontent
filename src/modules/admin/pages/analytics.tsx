import { useState } from "react";
import { 
    BarChart, Bar, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,

} from "recharts";
import { 
    Users, Target, CheckCircle2, 
    AlertCircle, Filter, ChevronDown,  Zap, BarChart3
} from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import { useProjects } from "../hooks/useProjects";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Analytics() {
    const [selectedProject, setSelectedProject] = useState<string>("");
    const { data: projects } = useProjects();
    const { data: analytics, isLoading } = useAnalytics(selectedProject);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-sm">Quantifying Brilliance...</p>
            </div>
        );
    }

    const { 
        taskDistribution = [], 
        userProductivity = [], 
        overallHealth = { totalStories: 0, completedStories: 0, totalEstimation: 0 },
        overdueCount = 0 
    } = analytics || {};

    const projectCompletionRate = overallHealth.totalStories > 0 
        ? Math.round((overallHealth.completedStories / overallHealth.totalStories) * 100) 
        : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white">
                            <BarChart3 size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Project Intelligence</h1>
                    </div>
                    <p className="text-gray-500 font-medium text-lg italic">"Data is the new oil, but analytics is the engine."</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-[1.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-2 text-indigo-600 font-bold text-sm bg-indigo-50 rounded-xl">
                        <Filter size={16} />
                        <span>Filter Workspace</span>
                    </div>
                    <div className="relative group">
                        <select 
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="appearance-none bg-gray-50 border-none rounded-xl px-4 py-2 pr-10 font-black text-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer min-w-[200px]"
                        >
                            <option value="">All Projects</option>
                            {(projects as any)?.data?.map((project: any) => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                    </div>
                </div>
            </div>

            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    title="Overall Completion" 
                    value={`${projectCompletionRate}%`} 
                    subtitle={`${overallHealth.completedStories} / ${overallHealth.totalStories} Stories`}
                    icon={<Target className="text-indigo-600" />}
                    color="indigo"
                />
                <MetricCard 
                    title="Total Estimation" 
                    value={overallHealth.totalEstimation} 
                    subtitle="Points in backlog"
                    icon={<Zap className="text-amber-500" />}
                    color="amber"
                />
                <MetricCard 
                    title="Active Workload" 
                    value={userProductivity.length} 
                    subtitle="Team members active"
                    icon={<Users className="text-emerald-600" />}
                    color="emerald"
                />
                <MetricCard 
                    title="Overdue Tasks" 
                    value={overdueCount} 
                    subtitle="Requires attention"
                    icon={<AlertCircle className="text-rose-500" />}
                    color="rose"
                    alert={overdueCount > 0}
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Status Distribution */}
                <ChartContainer title="Workflow State" subtitle="Distribution of tasks across the pipeline">
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={taskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {taskDistribution.map((_item: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartContainer>

                {/* Team Productivity */}
                <ChartContainer title="Team Throughput" subtitle="Tasks completed vs Total hours logged" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={userProductivity} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#64748b" fontStyle="black" />
                            <YAxis yAxisId="left" stroke="#6366f1" fontSize={12} label={{ value: 'Tasks', angle: -90, position: 'insideLeft', offset: -5 }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} label={{ value: 'Hours', angle: 90, position: 'insideRight', offset: 15 }} />
                            <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}
                            />
                            <Legend verticalAlign="top"/>
                            <Bar yAxisId="left" dataKey="completedTasks" name="Tasks Completed" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                            <Bar yAxisId="right" dataKey="totalHours" name="Total Hours" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

        </div>
    );
}

function MetricCard({ title, value, subtitle, icon, color, alert }: any) {
    const bgColors: any = {
        indigo: "bg-indigo-50 text-indigo-600",
        amber: "bg-amber-50 text-amber-600",
        emerald: "bg-emerald-50 text-emerald-600",
        rose: "bg-rose-50 text-rose-600",
    };

    return (
        <div className={`bg-white p-6 rounded-[2.5rem] border ${alert ? 'border-rose-200 animate-pulse bg-rose-50/10' : 'border-gray-100'} shadow-sm transition-all hover:shadow-md group`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${bgColors[color]} rounded-2xl flex items-center justify-center shrink-0`}>
                    {icon}
                </div>
                {alert && <CheckCircle2 size={16} className="text-rose-500" />}
            </div>
            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">{title}</h3>
            <div className="text-3xl font-black text-gray-900 tracking-tight mb-1">{value}</div>
            <p className="text-gray-400 font-medium text-sm">{subtitle}</p>
        </div>
    );
}

function ChartContainer({ title, subtitle, children, className }: any) {
    return (
        <div className={`bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm ${className}`}>
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
                </div>
                <p className="text-gray-400 font-medium text-sm">{subtitle}</p>
            </div>
            {children}
        </div>
    );
}

