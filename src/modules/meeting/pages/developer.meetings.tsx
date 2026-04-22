import {
	ArrowUpRight,
	Calendar,
	Clock,
	Filter,
	Search,
	User,
	Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeetings } from "../../admin/hooks/useMeetings";
import { useProjects } from "../../admin/hooks/useProjects";

export default function DeveloperMeetings() {
	const navigate = useNavigate();
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const { data: projectsRes } = useProjects({ page: 1, limit: 100 });
	const { meetings, isLoading } = useMeetings(selectedProjectId);

	const projects = useMemo(() => projectsRes?.data || [], [projectsRes?.data]);
	useEffect(() => {
		if (!selectedProjectId && projects.length > 0) {
			setSelectedProjectId(projects[0].id);
		}
	}, [projects, selectedProjectId]);

	return (
		<div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
				<div>
					<h1 className="text-4xl font-black text-gray-900 tracking-tight">
						Team Meetings
					</h1>
					<p className="text-gray-500 mt-2 font-bold text-lg">
						Scheduled syncs for your projects
					</p>
				</div>
				<button
					onClick={() => navigate("history")}
					className="flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-2xl font-black border-2 border-gray-100 shadow-sm transition-all active:scale-95"
				>
					<Clock size={24} className="text-indigo-600" />
					<span>View History</span>
				</button>
			</div>

			{/* Filters & Search */}
			<div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
				<div className="flex-1 min-w-[300px] relative">
					<Search
						className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
						size={20}
					/>
					<input
						placeholder="Search meetings..."
						className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl font-bold transition-all outline-none"
					/>
				</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<Filter
							className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-600"
							size={20}
						/>
						<select
							value={selectedProjectId}
							onChange={(e) => setSelectedProjectId(e.target.value)}
							className="pl-14 pr-8 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl font-bold transition-all outline-none appearance-none cursor-pointer min-w-[200px]"
						>
							<option value="" disabled>
								Select Project
							</option>
							{projects?.map((p: any) => (
								<option key={p.id} value={p.id}>
									{p.name}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Meetings List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{!selectedProjectId ? (
					<div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-200">
						<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
							<Filter size={40} />
						</div>
						<h3 className="text-2xl font-black text-gray-400">
							Select a project
						</h3>
						<p className="text-gray-400 font-bold mt-2">
							Please select a project to view its meetings
						</p>
					</div>
				) : isLoading ? (
					[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 animate-pulse h-[280px]"
						/>
					))
				) : meetings?.length > 0 ? (
					meetings.map((meeting: any) => (
						<div
							key={meeting.id}
							className="group bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-gray-100 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
						>
							<div>
								<div className="flex justify-between items-start mb-6">
									<div className="p-4 bg-indigo-50 rounded-3xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
										<Video size={28} />
									</div>
									<div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-sm uppercase tracking-wider">
										{meeting.status}
									</div>
								</div>
								<h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors uppercase">
									{meeting.title}
								</h3>
								<div className="space-y-3">
									<div className="flex items-center gap-3 text-gray-500 font-bold">
										<Calendar size={18} className="text-indigo-400" />
										<span>{new Date(meeting.date).toLocaleDateString()}</span>
									</div>
									<div className="flex items-center gap-3 text-gray-500 font-bold">
										<Clock size={18} className="text-indigo-400" />
										<span>
											{new Date(meeting.date).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>
									<div className="flex items-center gap-3 text-gray-400 font-bold pt-4 border-t border-gray-50">
										<User size={18} />
										<span>
											{meeting.participants?.length || 0} Members assigned
										</span>
									</div>
								</div>
							</div>

							<button
								disabled={
									meeting.status === "COMPLETED" ||
									meeting.status === "CANCELLED" ||
									meeting.status === "SCHEDULED"
								}
								onClick={() => navigate(`/meeting/${meeting.roomId}`)}
								className={`mt-8 w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 ${
									meeting.status === "COMPLETED" ||
									meeting.status === "CANCELLED"
										? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
										: meeting.status === "SCHEDULED"
											? "bg-indigo-50 text-indigo-400 cursor-not-allowed"
											: "bg-gray-900 group-hover:bg-indigo-600 text-white"
								}`}
							>
								{meeting.status === "COMPLETED"
									? "Meeting Ended"
									: meeting.status === "CANCELLED"
										? "Meeting Cancelled"
										: meeting.status === "SCHEDULED"
											? "Waiting for Host"
											: "Join Meeting"}
								{meeting.status === "ONGOING" && (
									<ArrowUpRight
										size={20}
										className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
									/>
								)}
							</button>
						</div>
					))
				) : (
					<div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-200">
						<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
							<Video size={40} />
						</div>
						<h3 className="text-2xl font-black text-gray-400">
							No meetings scheduled
						</h3>
						<p className="text-gray-400 font-bold mt-2">
							No upcoming meetings for this project
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
