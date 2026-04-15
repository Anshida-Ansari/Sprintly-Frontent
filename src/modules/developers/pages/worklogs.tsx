import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    Clock, 
    Plus, 
    Calendar, 
    FileText, 
    Loader2, 
    ArrowRight,
    Search,
    Layout
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { workLogService } from "../services/worklog.service";
import { userStoryService } from "../services/userstory.service";
import { format } from "date-fns";

export default function WorkLogsPage() {
    const queryClient = useQueryClient();
    const [isLogging, setIsLogging] = useState(false);
    
    
    const [selectedSubTaskId, setSelectedSubTaskId] = useState("");
    const [hours, setHours] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

 
    const [searchTerm, setSearchTerm] = useState("");


    const { data: tasksRes } = useQuery({
        queryKey: ["my-tasks-for-worklog"],
        queryFn: () => userStoryService.getMyUserStories(),
    });

 
    const allSubTasks = useMemo(() => {
        if (!tasksRes?.data) return [];
        return tasksRes.data.flatMap((story: any) => 
            (story.subtasks || []).map((sub: any) => ({
                ...sub,
                storyTitle: story.title,
                fullTitle: `${story.title} > ${sub.title}`
            }))
        );
    }, [tasksRes]);

    // Fetch My Work Logs
    const { data: logsRes, isLoading: logsLoading } = useQuery({
        queryKey: ["my-work-logs"],
        queryFn: () => workLogService.getMyWorkLogs(),
    });

    const logs = logsRes?.data?.logs || [];
    const totalHours = parseFloat((logsRes?.data?.totalHours || 0).toFixed(2));

    const createWorkLogMutation = useMutation({
        mutationFn: workLogService.createWorkLog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-work-logs"] });
            queryClient.invalidateQueries({ queryKey: ["my-user-stories"] });
            toast.success("Work log added successfully!");
            resetForm();
            setIsLogging(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add work log");
        }
    });

    const resetForm = () => {
        setSelectedSubTaskId("");
        setHours("");
        setDescription("");
        setDate(format(new Date(), "yyyy-MM-dd"));
    };

    const handleLogWork = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubTaskId || !hours || !date) {
            toast.error("Please fill all required fields");
            return;
        }

        createWorkLogMutation.mutate({
            subTaskId: selectedSubTaskId,
            hours: Number(hours),
            description,
            date: new Date(date)
        });
    };

    const filteredLogs = logs.filter((log: any) => 
        log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.subTaskId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.taskId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-2 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Clock className="text-indigo-600" size={32} />
                        Work Logs
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        Track your daily progress and time spent on tasks.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Logged</span>
                        <span className="text-xl font-black text-indigo-600">{totalHours}h</span>
                    </div>
                    <button 
                        onClick={() => setIsLogging(!isLogging)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${isLogging ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}`}
                    >
                        {isLogging ? "Close Form" : <><Plus size={20} /> Log Work</>}
                    </button>
                </div>
            </div>

            {/* Log Form Section */}
            {isLogging && (
                <div className="bg-white rounded-[32px] border border-indigo-100 shadow-xl shadow-indigo-50/50 p-8 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleLogWork} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Layout size={16} className="text-indigo-500" />
                                Select Subtask <span className="text-rose-500">*</span>
                            </label>
                            <select 
                                value={selectedSubTaskId}
                                onChange={(e) => setSelectedSubTaskId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium appearance-none"
                                required
                            >
                                <option value="">Choose a subtask...</option>
                                {allSubTasks.map((sub: any) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.fullTitle}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Clock size={16} className="text-indigo-500" />
                                Hours <span className="text-rose-500">*</span>
                            </label>
                            <input 
                                type="number"
                                step="0.5"
                                min="0.1"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                placeholder="e.g. 2.5"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar size={16} className="text-indigo-500" />
                                Date <span className="text-rose-500">*</span>
                            </label>
                            <input 
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <FileText size={16} className="text-indigo-500" />
                                Description
                            </label>
                            <input 
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What did you work on? (Optional)"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
                            />
                        </div>

                        <div className="flex items-end">
                            <button 
                                type="submit"
                                disabled={createWorkLogMutation.isPending}
                                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {createWorkLogMutation.isPending ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    "Save Log"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Logs Table Area */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Recent History
                        {searchTerm && (
                            <span className="text-sm font-medium text-indigo-500">
                                • {filteredLogs.length} matches
                            </span>
                        )}
                    </h2>
                    
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 w-full md:w-64 transition-all"
                        />
                    </div>
                </div>

                {logsLoading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-indigo-500" size={40} />
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-24 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Clock size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No work logs found</h3>
                        <p className="text-gray-500 mt-2 max-w-xs">
                            {searchTerm ? "Try adjusting your search terms to find what you're looking for." : "Start logging your time to see your progress here."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredLogs.map((log: any) => (
                            <div key={log._id} className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {format(new Date(log.date), "dd")}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                <span>{format(new Date(log.date), "MMMM yyyy")}</span>
                                                <span className="text-gray-200">•</span>
                                                <span className="text-indigo-500">{log.projectId?.name || "Project"}</span>
                                            </div>
                                            <h4 className="font-bold text-gray-900 truncate">
                                                {log.taskId?.title} <ArrowRight size={14} className="inline mx-1 text-gray-300" /> {log.subTaskId?.title}
                                            </h4>
                                            {log.description && (
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-1 italic">
                                                    "{log.description}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 md:text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-lg font-black text-gray-900">{parseFloat(log.hours.toFixed(2))}h</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Logged</span>
                                        </div>
                                        <div className="w-px h-8 bg-gray-100 hidden md:block" />
                                        <div className="hidden md:flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                            <span className="text-xs font-bold text-gray-400 uppercase">Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
