import { useQuery } from "@tanstack/react-query";
import { 
    Clock, 
    Users, 
    FolderOpen, 
    Zap,
    Filter,
    Loader2,
    TrendingUp,
    BarChart3,
    User,
    ChevronDown,
    Download
} from "lucide-react";
import { useState } from "react";
import { workLogService } from "../../developers/services/worklog.service";
import { useProjects } from "../hooks/useProjects";
import { useGetMembers } from "../hooks/useGetmembers";
import { useGetSprints } from "../hooks/useSprints";
import { format } from "date-fns";

export default function AdminWorkLogs() {
    // Filter states
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedSprintId, setSelectedSprintId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const { data: projectsRes } = useProjects({ page: 1, limit: 100 });
    const { data: membersRes } = useGetMembers({ page: 1, limit: 100 });
    const { data: sprintsRes } = useGetSprints(selectedProjectId, { page: 1, limit: 100 });

    const projects = projectsRes?.data || [];
    const members = membersRes?.data || [];
    const sprints = sprintsRes?.data || [];

    const { data: analyticsRes, isLoading } = useQuery({
        queryKey: ["admin-work-logs", selectedUserId, selectedProjectId, selectedSprintId, startDate, endDate],
        queryFn: () => workLogService.getAdminWorkLogs({
            userId: selectedUserId,
            projectId: selectedProjectId,
            sprintId: selectedSprintId,
            startDate,
            endDate
        }),
    });

    const analytics = analyticsRes?.data || { logs: [], totalHours: 0, hoursPerUser: [], hoursPerSprint: [] };

    const resetFilters = () => {
        setSelectedUserId("");
        setSelectedProjectId("");
        setSelectedSprintId("");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <BarChart3 className="text-indigo-600" size={32} />
                        Team Work Logs
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        Analyze productivity and track time allocation across the organization.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-100 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <Download size={18} />
                        Export Report
                    </button>
                    <button 
                        onClick={resetFilters}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                        <Clock size={24} />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Hours Logged</p>
                    <h3 className="text-3xl font-black text-gray-900">{analytics.totalHours}h</h3>
                    <div className="flex items-center gap-1 mt-2 text-emerald-500 text-xs font-bold">
                        <TrendingUp size={14} />
                        <span>Team Momentum</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                        <Users size={24} />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Developers</p>
                    <h3 className="text-3xl font-black text-gray-900">{analytics.hoursPerUser?.length || 0}</h3>
                    <p className="text-xs font-medium text-gray-400 mt-2">Contributing time</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                        <Zap size={24} />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sprints Covered</p>
                    <h3 className="text-3xl font-black text-gray-900">{analytics.hoursPerSprint?.length || 0}</h3>
                    <p className="text-xs font-medium text-gray-400 mt-2">Across active sprints</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                        <FolderOpen size={24} />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Entries</p>
                    <h3 className="text-3xl font-black text-gray-900">{analytics.logs?.length || 0}</h3>
                    <p className="text-xs font-medium text-gray-400 mt-2">Unique logs recorded</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Filter size={18} className="text-indigo-600" />
                    <h3 className="font-bold text-gray-900">Filter Analytics</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Developer</label>
                        <select 
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
                        >
                            <option value="">All Developers</option>
                            {members.map((m: any) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Project</label>
                        <select 
                            value={selectedProjectId}
                            onChange={(e) => {
                                setSelectedProjectId(e.target.value);
                                setSelectedSprintId(""); // Reset sprint when project changes
                            }}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
                        >
                            <option value="">All Projects</option>
                            {projects.map((p: any) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Sprint</label>
                        <select 
                            value={selectedSprintId}
                            onChange={(e) => setSelectedSprintId(e.target.value)}
                            disabled={!selectedProjectId}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none disabled:opacity-50"
                        >
                            <option value="">All Sprints</option>
                            {sprints.map((s: any) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Start Date</label>
                        <input 
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">End Date</label>
                        <input 
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Content Tabs / Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Aggregated Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Users size={20} className="text-indigo-600" />
                            Hours per Dev
                        </h3>
                        {analytics.hoursPerUser?.length > 0 ? (
                            <div className="space-y-6">
                                {analytics.hoursPerUser.map((userStats: any) => (
                                    <div key={userStats.userId}>
                                        <div className="flex justify-between items-end mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 text-xs font-bold uppercase">
                                                    {userStats.userName?.substring(0, 2)}
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">{userStats.userName}</span>
                                            </div>
                                            <span className="text-sm font-black text-indigo-600">{userStats.totalHours}h</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min((userStats.totalHours / (analytics.totalHours || 1)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <User size={40} className="text-gray-200 mb-2" />
                                <p className="text-sm text-gray-400 font-medium">No contributor data available</p>
                            </div>
                        )}

                        <div className="mt-12 pt-8 border-t border-gray-50">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Zap size={20} className="text-emerald-600" />
                                Hours per Sprint
                            </h3>
                            <div className="space-y-6">
                                {analytics.hoursPerSprint?.map((sprintStats: any) => (
                                    <div key={sprintStats.sprintId}>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-bold text-gray-700">{sprintStats.sprintName}</span>
                                            <span className="text-sm font-black text-emerald-600">{sprintStats.totalHours}h</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min((sprintStats.totalHours / (analytics.totalHours || 1)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table of logs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden h-full">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">Work Log Detailed Entries</h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>Recent</span>
                                <ChevronDown size={14} />
                            </div>
                        </div>
                        
                        {isLoading ? (
                            <div className="flex justify-center py-24">
                                <Loader2 className="animate-spin text-indigo-500" size={40} />
                            </div>
                        ) : analytics.logs?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Developer</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Task / Subtask</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Date</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {analytics.logs.map((log: any) => (
                                            <tr key={log._id} className="hover:bg-indigo-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                            {log.userId?.name?.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900">{log.userId?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="max-w-xs">
                                                        <p className="text-sm font-bold text-gray-900 truncate">{log.taskId?.title}</p>
                                                        <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{log.subTaskId?.title}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                                                        {format(new Date(log.date), "MMM dd, yyyy")}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <span className="text-base font-black text-indigo-600">{parseFloat(log.hours.toFixed(2))}h</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <Clock size={48} className="text-gray-100 mb-4" />
                                <h4 className="text-lg font-bold text-gray-900">No logs found for current filters</h4>
                                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters to see more results.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
