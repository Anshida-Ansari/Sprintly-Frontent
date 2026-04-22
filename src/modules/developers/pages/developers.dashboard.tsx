import {
	Activity,
	ArrowRight,
	Calendar,
	CheckCircle2,
	Clock,
	FileText,
	Layout,
	ListTodo,
	MessageSquare,
	PlayCircle,
	Target,
	TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { socket } from "../../../lib/socket";
import { UserAuth } from "../../auth/store/store";
import { useDeveloperDashboardStats } from "../hooks/useDeveloperDashboardStats";

export default function DashboardPage() {
	const navigate = useNavigate();
	const user = UserAuth((state) => state.user);
	const [date, setDate] = useState(new Date());

	const { data: statsRes, isLoading } = useDeveloperDashboardStats();
	const stats = statsRes?.data;

	useEffect(() => {
		const timer = setInterval(() => setDate(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	const getGreeting = () => {
		const hour = date.getHours();
		if (hour < 12) return "Good Morning";
		if (hour < 18) return "Good Afternoon";
		return "Good Evening";
	};

	useEffect(() => {
		if (!user?.id) return;
		socket.connect();
		socket.emit("register-user", user.id);
		const handleMeetingScheduled = (data: any) => {
			toast.custom(
				(id) => (
					<div className="animate-in fade-in zoom-in duration-300 max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border border-indigo-100">
						<div className="flex-1 w-0 p-4">
							<div className="flex items-start">
								<div className="flex-shrink-0 pt-0.5">
									<div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
										<Calendar className="h-6 w-6 text-indigo-600" />
									</div>
								</div>
								<div className="ml-3 flex-1">
									<p className="text-sm font-bold text-gray-900">New Meeting</p>
									<p className="mt-1 text-sm text-gray-500 line-clamp-1">
										{data.title}
									</p>
									<p className="mt-1 text-xs text-indigo-600 font-semibold tracking-wide uppercase">
										{new Date(data.date).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>
							</div>
						</div>
						<div className="flex border-l border-gray-100">
							<button
								onClick={() => {
									toast.dismiss(id);
									navigate(`/admin/meeting/${data.roomId}`);
								}}
								className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-bold text-indigo-600 hover:text-indigo-500 hover:bg-indigo-50 transition-all uppercase tracking-wider"
							>
								Join
							</button>
						</div>
					</div>
				),
				{ duration: 8000 },
			);
		};
		socket.on("meeting-scheduled", handleMeetingScheduled);
		return () => {
			socket.off("meeting-scheduled", handleMeetingScheduled);
		};
	}, [user, navigate]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60vh]">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
					<p className="text-gray-500 font-medium animate-pulse">
						Loading your briefing...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto space-y-8 pb-12">
			{/* 1. Dynamic Header Section */}
			<div className="relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
				<div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
				<div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-emerald-50 rounded-full opacity-50 blur-3xl pointer-events-none" />

				<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
								Developer Briefing
							</span>
							<span className="text-gray-400 text-xs">•</span>
							<span className="text-gray-500 text-xs font-medium">
								{date.toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
							</span>
						</div>
						<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
							{getGreeting()},{" "}
							<span className="text-indigo-600">
								{user?.name?.split(" ")[0]}
							</span>
							.
						</h1>
						<p className="text-gray-500 text-lg">
							You have{" "}
							<span className="font-bold text-gray-900">
								{stats?.todayTasks?.length || 0}
							</span>{" "}
							tasks requiring attention today.
						</p>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
						<div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl text-center shadow-sm">
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
								Weekly Tasks
							</p>
							<p className="text-2xl font-black text-emerald-600">
								{stats?.performance?.tasksCompletedThisWeek || 0}
							</p>
						</div>
						<div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl text-center shadow-sm">
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
								Hours Logged
							</p>
							<p className="text-2xl font-black text-indigo-600">
								{stats?.performance?.hoursWorkedThisWeek || 0}h
							</p>
						</div>
						<div className="hidden sm:block bg-slate-50 border border-gray-100 p-4 rounded-2xl text-center shadow-sm">
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
								Completion
							</p>
							<p className="text-2xl font-black text-amber-600">
								{stats?.performance?.completionRate || 0}%
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Left Content (8/12) */}
				<div className="lg:col-span-8 space-y-8">
					{/* A. Focus Section: Current Working & Today's List */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
								<Target className="text-indigo-600" size={24} />
								Today's Work
							</h3>
							{stats?.todayTasks?.length > 0 && (
								<span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
									{stats.todayTasks.filter((t: any) => t.isOverdue).length}{" "}
									Overdue
								</span>
							)}
						</div>

						{/* Active Focus Card */}
						{stats?.currentFocus ? (
							<div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group hover:scale-[1.01] transition-all cursor-pointer shadow-xl shadow-indigo-100">
								<div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
									<Target size={140} />
								</div>
								<div className="relative z-10">
									<div className="flex items-center gap-2 mb-6">
										<span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/30 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-500/30">
											<PlayCircle size={12} /> Active Task
										</span>
										<span className="text-gray-500 text-xs">
											— {stats.currentFocus.projectName}
										</span>
									</div>
									<h2 className="text-3xl font-bold mb-4 group-hover:text-indigo-300 transition-colors">
										{stats.currentFocus.title}
									</h2>
									<div className="flex flex-wrap items-center gap-6 mb-8">
										<div className="flex items-center gap-2">
											<Clock className="text-indigo-400" size={18} />
											<span className="text-sm font-medium text-gray-300">
												{stats.currentFocus.actualHours}h /{" "}
												{stats.currentFocus.estimatedHours}h
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Calendar className="text-indigo-400" size={18} />
											<span className="text-sm font-medium text-gray-300">
												Due{" "}
												{stats.currentFocus.dueDate
													? new Date(
															stats.currentFocus.dueDate,
														).toLocaleDateString()
													: "No Date"}
											</span>
										</div>
									</div>
									<button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-lg">
										Resume Work <ArrowRight size={18} />
									</button>
								</div>
							</div>
						) : (
							<div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
								<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
									<ListTodo size={32} className="text-gray-300" />
								</div>
								<h2 className="text-xl font-bold text-gray-900 mb-2">
									No active focus detected
								</h2>
								<p className="text-gray-500 max-w-xs mx-auto mb-6">
									Ready to dive in? Start by picking a task from your pending
									queue below.
								</p>
								<button className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center gap-1 mx-auto">
									Go to Kanban Board <ArrowRight size={16} />
								</button>
							</div>
						)}

						{/* Today's Tasks List */}
						<div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
							{stats?.todayTasks?.length > 0
								? stats.todayTasks.map((task: any) => (
										<div
											key={task.id}
											className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group"
										>
											<div className="flex items-center gap-4">
												<div
													className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${task.isOverdue ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400"}`}
												>
													{task.isOverdue ? (
														<Clock size={20} />
													) : (
														<FileText size={20} />
													)}
												</div>
												<div>
													<p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
														{task.title}
													</p>
													<div className="flex items-center gap-3 mt-1">
														<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
															{task.projectName}
														</p>
														<span className="w-1 h-1 bg-gray-300 rounded-full" />
														<p
															className={`text-[10px] font-bold uppercase ${task.isOverdue ? "text-red-500" : "text-gray-400"}`}
														>
															{task.isOverdue
																? "Overdue"
																: `Due ${new Date(task.dueDate).toLocaleDateString()}`}
														</p>
													</div>
												</div>
											</div>
											<button className="text-gray-400 hover:text-indigo-600 transition-colors">
												<ArrowRight size={20} />
											</button>
										</div>
									))
								: !stats?.currentFocus && (
										<div className="p-12 text-center text-gray-400 font-medium">
											Your schedule for today looks clear.
										</div>
									)}
						</div>
					</div>

					{/* B. All My Tasks Section (Grouped) */}
					<div className="space-y-4 pt-4">
						<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
							<Layout className="text-indigo-600" size={24} />
							My Roadmap
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Pending */}
							<div className="bg-slate-50/50 p-6 rounded-3xl border border-gray-100">
								<div className="flex items-center gap-2 mb-4">
									<div className="w-2 h-2 rounded-full bg-slate-300" />
									<h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
										Pending
									</h4>
									<span className="ml-auto text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
										{stats?.myTasks?.pending?.length || 0}
									</span>
								</div>
								<div className="space-y-3">
									{stats?.myTasks?.pending?.slice(0, 3).map((t: any) => (
										<div
											key={t.id}
											className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-200 transition-all cursor-pointer"
										>
											<p className="text-xs font-bold text-gray-800 line-clamp-2">
												{t.title}
											</p>
											<p className="text-[10px] font-medium text-gray-400 mt-2">
												{t.projectName}
											</p>
										</div>
									))}
									{(stats?.myTasks?.pending?.length || 0) > 3 && (
										<button className="w-full text-center text-[10px] font-bold text-indigo-600 py-1 hover:underline">
											+ {stats.myTasks.pending.length - 3} more
										</button>
									)}
								</div>
							</div>

							{/* In Progress */}
							<div className="bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100/50">
								<div className="flex items-center gap-2 mb-4">
									<div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
									<h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
										Active
									</h4>
									<span className="ml-auto text-[10px] font-bold text-indigo-500 bg-white px-2 py-0.5 rounded-full border border-indigo-100">
										{stats?.myTasks?.inProgress?.length || 0}
									</span>
								</div>
								<div className="space-y-3">
									{stats?.myTasks?.inProgress?.slice(0, 3).map((t: any) => (
										<div
											key={t.id}
											className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
										>
											<p className="text-xs font-bold text-gray-800 line-clamp-2">
												{t.title}
											</p>
											<div className="flex items-center gap-2 mt-2">
												<div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden">
													<div
														className="h-full bg-indigo-500 rounded-full"
														style={{
															width: `${(t.actualHours / t.estimatedHours) * 100 || 0}%`,
														}}
													/>
												</div>
												<span className="text-[9px] font-bold text-indigo-600">
													{Math.round(
														(t.actualHours / t.estimatedHours) * 100 || 0,
													)}
													%
												</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Completed */}
							<div className="bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100/50">
								<div className="flex items-center gap-2 mb-4">
									<div className="w-2 h-2 rounded-full bg-emerald-500" />
									<h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
										Done
									</h4>
									<span className="ml-auto text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-100">
										{stats?.myTasks?.completed?.length || 0}
									</span>
								</div>
								<div className="space-y-3 opacity-80">
									{stats?.myTasks?.completed?.slice(0, 3).map((t: any) => (
										<div
											key={t.id}
											className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-2"
										>
											<CheckCircle2
												size={14}
												className="text-emerald-500 shrink-0"
											/>
											<p className="text-xs font-bold text-gray-600 line-clamp-1 line-through">
												{t.title}
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Sidebar (4/12) */}
				<div className="lg:col-span-4 space-y-8">
					{/* Active Sprint Widget */}
					{stats?.activeSprint ? (
						<div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden group">
							<div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-500">
								<TrendingUp size={100} />
							</div>
							<div className="relative z-10">
								<div className="flex items-center gap-2 mb-6">
									<span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider rounded-full">
										Active Sprint
									</span>
									<span className="text-gray-400 text-xs font-medium">
										{stats.activeSprint.daysLeft} days left
									</span>
								</div>

								<h3 className="text-2xl font-black text-gray-900 mb-6">
									{stats.activeSprint.name}
								</h3>

								<div className="space-y-6">
									<div>
										<div className="flex justify-between items-end mb-2">
											<p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
												Your Progress
											</p>
											<p className="text-xs font-black text-indigo-600">
												{stats.activeSprint.completionPercentage}%
											</p>
										</div>
										<div className="h-4 w-full bg-gray-50 rounded-full p-1 border border-gray-100 shadow-inner">
											<div
												className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000"
												style={{
													width: `${stats.activeSprint.completionPercentage}%`,
												}}
											/>
										</div>
										<p className="text-[10px] font-bold text-gray-400 mt-2 text-center uppercase tracking-widest">
											{stats.activeSprint.completedTasks} of{" "}
											{stats.activeSprint.totalTasks} tasks completed
										</p>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="bg-slate-50 p-3 rounded-2xl border border-gray-100 text-center">
											<p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
												Remaining
											</p>
											<p className="text-lg font-black text-gray-800">
												{stats.activeSprint.totalTasks -
													stats.activeSprint.completedTasks}
											</p>
										</div>
										<div className="bg-slate-50 p-3 rounded-2xl border border-gray-100 text-center">
											<p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
												Health
											</p>
											<p className="text-lg font-black text-emerald-600">
												On Track
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="bg-slate-50 p-8 rounded-3xl border border-gray-200 border-dashed text-center">
							<p className="text-sm font-bold text-gray-400">
								No active sprint
							</p>
						</div>
					)}

					{/* Today's Schedule */}
					<div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								<Calendar size={20} className="text-indigo-600" />
								Meetings
							</h3>
							<button
								onClick={() => navigate("/developers/meetings")}
								className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider"
							>
								View All
							</button>
						</div>

						<div className="space-y-6">
							{stats?.schedule?.length > 0 ? (
								stats.schedule.map((meeting: any) => (
									<div
										key={meeting.id}
										className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-indigo-100"
									>
										<div className="absolute left-[-2.5px] top-2 w-1.5 h-1.5 rounded-full bg-indigo-600 ring-4 ring-white" />
										<p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
											{new Date(meeting.date).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
										<p className="text-sm font-bold text-gray-900 line-clamp-1">
											{meeting.title}
										</p>
										<p className="text-[10px] font-medium text-gray-400 mt-0.5">
											Google Meet • Sync
										</p>
									</div>
								))
							) : (
								<div className="text-center py-4">
									<p className="text-xs font-medium text-gray-400 italic">
										No meetings today.
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Recent Activity */}
					<div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
						<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
							<Activity size={20} className="text-indigo-600" />
							Activity Log
						</h3>

						<div className="space-y-6">
							{stats?.recentActivity?.length > 0 ? (
								stats.recentActivity.map((activity: any) => (
									<div key={activity.id} className="flex gap-4">
										<div
											className={`mt-1 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${activity.type === "COMMENT_ADDED" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}
										>
											{activity.type === "COMMENT_ADDED" ? (
												<MessageSquare size={16} />
											) : (
												<FileText size={16} />
											)}
										</div>
										<div className="flex-1">
											<p className="text-sm font-bold text-gray-900 leading-snug">
												{activity.title}
											</p>
											<p className="text-xs text-gray-500 line-clamp-1 mt-1">
												{activity.message}
											</p>
											<p className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-wide">
												{new Date(activity.timestamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
										</div>
									</div>
								))
							) : (
								<p className="text-xs text-center text-gray-400 font-medium italic">
									No recent activity.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
