import { useState } from "react";
import { useProjects } from "../../admin/hooks/useProjects";
import { useListStandups } from "../hooks/useListStandup";
import { Calendar, Filter, LayoutGrid, Search, User, MoreHorizontal, ArrowUpRight, MessageSquare, AlertCircle } from "lucide-react";

export default function AdminProjectStandupPage() {
    const todayStr = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [selectedProjectId, setSelectedProjectId] = useState("");

    const { data: projectsRes } = useProjects({ limit: 100 });
    const projects = projectsRes?.data || [];

    const { data: standups, isLoading } = useListStandups(
        selectedProjectId || undefined,
        undefined,
        selectedDate
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider border border-indigo-100">
                        <LayoutGrid size={12} />
                        Standup Analytics
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Team Standups</h1>
                    <p className="text-gray-500 font-medium">Track daily progress and identify blockers across projects.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm min-w-[240px]">
                        <Filter size={18} className="text-indigo-500" />
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 w-full cursor-pointer"
                        >
                            <option value="">All Projects</option>
                            {projects.map((p: any) => (
                                <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-100">
                        <Calendar size={18} className="text-indigo-500" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[600px] flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-bold">Fetching standup records...</p>
                    </div>
                ) : standups && standups.length > 0 ? (
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Developer</th>
                                    <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Yesterday's Progress</th>
                                    <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Today's Focus</th>
                                    <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Blockers</th>
                                    <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {standups.map((s: any) => (
                                    <tr key={s._id} className="group hover:bg-gray-50/50 transition-colors duration-200">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-100 to-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm border border-indigo-100 shadow-sm shadow-indigo-100/20 group-hover:scale-105 transition-transform">
                                                    {s.user?.name?.substring(0, 2).toUpperCase() || <User size={18} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{s.user?.name || "Unknown User"}</div>
                                                    <div className="text-xs font-medium text-gray-400">{s.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="max-w-md text-sm font-medium text-gray-600 leading-relaxed line-clamp-2 italic">
                                                "{s.yesterday}"
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="max-w-md text-sm font-bold text-gray-800 leading-relaxed line-clamp-2">
                                                {s.today}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {s.blockers && s.blockers !== "None" ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 animate-pulse">
                                                    <AlertCircle size={14} />
                                                    {s.blockers}
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-xs font-bold tracking-widest uppercase italic">Clear</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-gray-100">
                            <Search size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No standups found</h3>
                        <p className="text-gray-400 font-medium max-w-sm mx-auto">
                            We couldn't find any standup updates for the selected date and project filters.
                        </p>
                    </div>
                )}

                {/* Footer / Stats bar */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Sprint</span>
                         </div>
                         <div className="flex items-center gap-2 text-indigo-600">
                            <MessageSquare size={14} />
                            <span className="text-xs font-black uppercase tracking-widest">{standups?.length || 0} Total Submissions</span>
                         </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-indigo-600 transition-all active:scale-95">
                            <MoreHorizontal size={20} />
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
