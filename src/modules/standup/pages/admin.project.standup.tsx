import { useState, useEffect, useMemo } from "react";
import { useProjects } from "../../admin/hooks/useProjects";
import { useGetProject } from "../../admin/hooks/useGetProject";
import { useGetSprints } from "../../admin/hooks/useSprints";
import { useListStandups } from "../hooks/useListStandup";
import { Calendar, Filter, LayoutGrid, Search, User, MoreHorizontal, ArrowUpRight, MessageSquare, AlertCircle, ChevronRight, Target, Clock, Zap, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function AdminProjectStandupPage() {
    const todayStr = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedSprintId, setSelectedSprintId] = useState("");

    const { data: projectsRes } = useProjects({ limit: 100 });
    const projects = projectsRes?.data || [];

    const { data: sprintsRes } = useGetSprints(selectedProjectId, { page: 1, limit: 100 });
    const sprints = sprintsRes?.data || [];

    const { data: projectRes } = useGetProject(selectedProjectId);
    const projectMembers = projectRes?.data?.members || [];

    useEffect(() => {
        if (sprints.length > 0) {
            const activeSprint = sprints.find((s: any) => s.status === "ACTIVE");
            if (activeSprint) {
                setSelectedSprintId(activeSprint.id || (activeSprint as any)._id);
            } else {
                setSelectedSprintId("");
            }
        } else {
            setSelectedSprintId("");
        }
    }, [sprints]);

    const { data: standups, isLoading } = useListStandups(
        selectedProjectId || undefined,
        selectedSprintId || undefined,
        selectedDate
    );

    const teamStandups = useMemo(() => {
        if (!selectedProjectId) return [];
        
        return projectMembers.map((member: any) => {
            const memberId = member.id || member._id;
            const standup = standups?.find((s: any) => {
                const sUserId = s.userId || s.user?.id || s.user?._id;
                return sUserId?.toString() === memberId?.toString();
            });
            
            return {
                member,
                standup,
                isSubmitted: !!standup
            };
        });
    }, [projectMembers, standups, selectedProjectId]);

    const submissionStats = useMemo(() => {
        if (!projectMembers.length) return { submitted: 0, total: 0 };
        return {
            submitted: teamStandups.filter(t => t.isSubmitted).length,
            total: projectMembers.length
        };
    }, [teamStandups, projectMembers]);

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
                    {/* Project Selector */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm min-w-[200px]">
                        <Filter size={18} className="text-indigo-500" />
                        <select
                            value={selectedProjectId}
                            onChange={(e) => {
                                setSelectedProjectId(e.target.value);
                                setSelectedSprintId("");
                            }}
                            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 w-full cursor-pointer"
                        >
                            <option value="">Select Project...</option>
                            {projects.map((p: any) => (
                                <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sprint Selector */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm min-w-[200px]">
                        <Target size={18} className="text-indigo-500" />
                        <select
                            value={selectedSprintId}
                            onChange={(e) => setSelectedSprintId(e.target.value)}
                            disabled={!selectedProjectId}
                            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 w-full cursor-pointer disabled:opacity-50"
                        >
                            <option value="">All Sprints</option>
                            {sprints.map((s: any) => (
                                <option key={s.id || s._id} value={s.id || s._id}>
                                    {s.name} {s.status === 'ACTIVE' ? '(Active)' : ''}
                                </option>
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
            <div className="flex flex-col min-h-[600px]">
                {isLoading ? (
                    <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing team logs...</p>
                    </div>
                ) : !selectedProjectId ? (
                    <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-gray-100">
                            <LayoutGrid size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Select a Project</h3>
                        <p className="text-gray-400 font-medium max-w-sm mx-auto">
                            Choose a project above to view daily sync progress and member updates.
                        </p>
                    </div>
                ) : teamStandups.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                        {teamStandups.map(({ member, standup, isSubmitted }) => (
                            <div 
                                key={member.id || member._id}
                                className={`group bg-white rounded-[2.5rem] border p-1 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/30 ${isSubmitted ? 'border-gray-100 hover:border-indigo-200' : 'border-dashed border-gray-200 opacity-60 hover:opacity-100'}`}
                            >
                                <div className="p-7 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border shadow-sm transition-transform group-hover:scale-110 duration-500 ${isSubmitted ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                                {member.name?.substring(0, 2).toUpperCase() || <User size={24} />}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 tracking-tight">{member.name}</div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                    {isSubmitted ? 'Update Logged' : 'Pending Update'}
                                                </div>
                                            </div>
                                        </div>
                                        {isSubmitted ? (
                                            <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                                                <CheckCircle2 size={12} />
                                                Synced
                                            </div>
                                        ) : (
                                            <div className="px-4 py-1.5 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 flex items-center gap-2">
                                                <AlertTriangle size={12} />
                                                Wait
                                            </div>
                                        )}
                                    </div>

                                    {isSubmitted ? (
                                        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-700">
                                            <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-50 group-hover:bg-indigo-50/30 transition-colors duration-500">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">
                                                    <ArrowRight size={10} />
                                                    Yesterday
                                                </div>
                                                <p className="text-sm font-medium text-gray-600 leading-relaxed italic line-clamp-2">
                                                    "{standup.yesterday}"
                                                </p>
                                            </div>
                                            <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-50 group-hover:bg-indigo-50 transition-colors duration-500">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">
                                                    <Zap size={10} />
                                                    Focus Today
                                                </div>
                                                <p className="text-sm font-black text-gray-800 leading-relaxed">
                                                    {standup.today}
                                                </p>
                                            </div>
                                            {standup.blockers && standup.blockers !== "None" && (
                                                <div className="px-5 py-3 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-bold border border-rose-100 flex items-center gap-3">
                                                    <AlertCircle size={16} />
                                                    <span className="flex-1">{standup.blockers}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center gap-3 bg-gray-50/30 rounded-3xl border border-dashed border-gray-200">
                                            <Clock size={32} className="text-gray-200" />
                                            <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Awaiting daily sync</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-gray-100">
                            <Users size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No Members Joined</h3>
                        <p className="text-gray-400 font-medium max-w-sm mx-auto">
                            This project doesn't have any members yet. Add members to see their standup logs.
                        </p>
                    </div>
                )}

                {/* Footer / Stats bar */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                {submissionStats.submitted}/{submissionStats.total} Members Submitted
                            </span>
                         </div>
                         <div className="flex items-center gap-2 text-indigo-600">
                            <MessageSquare size={14} />
                            <span className="text-xs font-black uppercase tracking-widest">{standups?.length || 0} Total Updates</span>
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
