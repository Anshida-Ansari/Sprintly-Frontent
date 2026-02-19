import {
	Calendar,
	Clock,
	ArrowRight,
	Target,
	AlertCircle,
	MoreHorizontal,
	Briefcase
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { socket } from "../../../lib/socket";
import { UserAuth } from "../../auth/store/store";
import { useProjects } from "../../admin/hooks/useProjects";

export default function DashboardPage() {
	const navigate = useNavigate();
	const user = UserAuth((state) => state.user);
	const [date, setDate] = useState(new Date());

	const { data: projectsData } = useProjects({ page: 1, limit: 1 });
	const currentProject = projectsData?.data?.[0];

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
					<div className="animate-in fade-in zoom-in duration-300 max-w-sm w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden">
						<div className="flex-1 w-0 p-4">
							<div className="flex items-start">
								<div className="flex-shrink-0 pt-0.5">
									<Calendar className="h-10 w-10 text-indigo-600 p-2 bg-indigo-50 rounded-full" />
								</div>
								<div className="ml-3 flex-1">
									<p className="text-sm font-medium text-gray-900">
										New Meeting
									</p>
									<p className="mt-1 text-sm text-gray-500">
										{data.title}
									</p>
									<p className="mt-1 text-xs text-indigo-600 font-medium">
										{new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
								className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:bg-indigo-50 focus:outline-none transition-colors"
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

	return (
		<div className="max-w-5xl mx-auto space-y-8">
			{/* 1. Header Section */}
			<header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
						{getGreeting()}, {user?.name?.split(' ')[0] || "Developer"}.
					</h1>
					<p className="text-gray-500 mt-1 text-lg">
						Here's your briefing for {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
					<Clock size={16} className="text-indigo-600" />
					<span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
				</div>
			</header>

			{/* 2. Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

				{/* Left Column: Immediate Focus (2/3 width) */}
				<div className="lg:col-span-2 space-y-8">

					{/* Project Context Card */}
					{currentProject && (
						<div
							onClick={() => navigate(`/developers/projects/${currentProject.id}`)}
							className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center cursor-pointer hover:border-indigo-300 transition-all group"
						>
							<div className="h-16 w-16 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
								<Briefcase size={32} className="text-indigo-600" />
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-1">
									<h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{currentProject.name}</h2>
									<span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${currentProject.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
										{currentProject.status}
									</span>
								</div>
								<p className="text-gray-500 text-sm line-clamp-2 mb-3">
									{currentProject.description}
								</p>
								<div className="flex items-center gap-4 text-xs font-medium text-gray-500">
									<div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
										<Calendar size={12} />
										<span>Start: {new Date(currentProject.startDate).toLocaleDateString()}</span>
									</div>
									<div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
										<Target size={12} />
										<span>End: {new Date(currentProject.endDate).toLocaleDateString()}</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Primary Widget: Current Focus */}
					<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-colors">
						<div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
							<Target size={120} className="text-indigo-600 transform rotate-12" />
						</div>

						<div className="relative z-10">
							<div className="flex items-center gap-2 mb-4">
								<span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
									Current Focus
								</span>
								<span className="text-gray-400 text-xs font-medium">Sprint 42</span>
							</div>

							<h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
								Implement WebSockets for Real-time Updates
							</h2>
							<p className="text-gray-500 mb-6 max-w-lg">
								Ensure low latency delivery of socket events for the task board updates. Handle reconnection logic gracefully.
							</p>

							<div className="flex items-center gap-4">
								<button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm">
									Continue Working <ArrowRight size={16} />
								</button>
								<span className="text-sm text-gray-500 font-medium">Estimated: 4h remaining</span>
							</div>
						</div>
					</div>

					{/* Secondary Widget: Today's Queue */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-bold text-gray-900">Up Next</h3>
							<button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
						</div>
						<div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
							{[
								{ id: 'TASK-402', title: 'Fix navigation overflow on mobile', priority: 'High', due: 'Today' },
								{ id: 'TASK-405', title: 'Code review for Authentication module', priority: 'Normal', due: 'Tomorrow' },
								{ id: 'TASK-411', title: 'Update dependencies to latest versions', priority: 'Low', due: 'Next Week' },
							].map((task) => (
								<div key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
									<div className="flex items-center gap-4">
										<div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-amber-500' : task.priority === 'Normal' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
										<div>
											<p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
												{task.title}
											</p>
											<p className="text-xs text-gray-500 font-mono mt-0.5">
												{task.id} • Due {task.due}
											</p>
										</div>
									</div>
									<button className="text-gray-400 hover:text-gray-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<MoreHorizontal size={18} />
									</button>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Right Column: Context & Stats (1/3 width) */}
				<div className="space-y-6">

					{/* Schedule Widget */}
					<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
						<h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Schedule</h3>
						<div className="space-y-6">
							<div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-indigo-100">
								<div className="absolute left-[-2.5px] top-2 w-1.5 h-1.5 rounded-full bg-indigo-600 ring-4 ring-white" />
								<p className="text-xs text-indigo-600 font-bold mb-1">11:00 AM (In 30m)</p>
								<p className="text-sm font-bold text-gray-900">Daily Standup</p>
								<p className="text-xs text-gray-500">Google Meet</p>
							</div>
							<div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
								<div className="absolute left-[-2.5px] top-2 w-1.5 h-1.5 rounded-full bg-gray-300 ring-4 ring-white" />
								<p className="text-xs text-gray-500 font-bold mb-1">02:00 PM</p>
								<p className="text-sm font-medium text-gray-700">Design Review: Dashboard</p>
								<p className="text-xs text-gray-400">Zoom</p>
							</div>
						</div>
						<button className="w-full mt-6 py-2 text-sm text-gray-500 hover:text-gray-900 font-medium border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
							View Calendar
						</button>
					</div>

					{/* Stats / Health Widget */}
					<div className="bg-slate-50 p-6 rounded-2xl border border-gray-200">
						<h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Daily Targets</h3>
						<div className="space-y-4">
							<div>
								<div className="flex justify-between text-xs mb-1">
									<span className="font-medium text-gray-700">Tasks Completed</span>
									<span className="text-gray-500">3/5</span>
								</div>
								<div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
									<div className="h-full bg-emerald-500 w-[60%]" />
								</div>
							</div>
							<div>
								<div className="flex justify-between text-xs mb-1">
									<span className="font-medium text-gray-700">Hours Logged</span>
									<span className="text-gray-500">4.5/8</span>
								</div>
								<div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
									<div className="h-full bg-indigo-500 w-[55%]" />
								</div>
							</div>
						</div>
					</div>

					{/* Blocker Alert (Conditional) */}
					<div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
						<AlertCircle className="text-amber-600 shrink-0" size={20} />
						<div>
							<p className="text-sm font-bold text-amber-900">1 Blocker Detected</p>
							<p className="text-xs text-amber-700 mt-0.5 line-clamp-2">
								API endpoint returning 500 triggers on user sync.
							</p>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}
