import {
	ArrowLeft,
	Calendar,
	Clock,
	Filter,
	Search,
	Users,
	Video,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeetings } from "../../admin/hooks/useMeetings";
import { useProjects } from "../../admin/hooks/useProjects";

const statusConfig = {
	COMPLETED: {
		label: "Completed",
		icon: CheckCircle,
		bg: "bg-emerald-50",
		text: "text-emerald-600",
		dot: "bg-emerald-500",
	},
	CANCELLED: {
		label: "Cancelled",
		icon: XCircle,
		bg: "bg-rose-50",
		text: "text-rose-500",
		dot: "bg-rose-500",
	},
} as const;

export default function MeetingHistory() {
	const navigate = useNavigate();
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState("");

	const { data: projectsRes } = useProjects({ page: 1, limit: 100 });
	const { history, isLoadingHistory } = useMeetings(selectedProjectId);

	const projects = projectsRes?.data || [];

	const filteredHistory = history.filter((meeting: any) =>
		meeting.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="p-8 max-w-[1400px] mx-auto min-h-screen">
			{/* Header */}
			<div className="mb-10">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-indigo-600 font-bold mb-6 hover:gap-3 transition-all text-sm"
				>
					<ArrowLeft size={18} />
					<span>Back to Meetings</span>
				</button>
				<div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
					<div>
						<h1 className="text-4xl font-black text-gray-900 tracking-tight">
							Meeting History
						</h1>
						<p className="text-gray-400 font-medium mt-2">
							{filteredHistory.length} past{" "}
							{filteredHistory.length === 1 ? "meeting" : "meetings"} found
						</p>
					</div>
					{/* Search & Filter row */}
					<div className="flex gap-3 flex-wrap">
						<div className="relative">
							<Search
								className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
								size={16}
							/>
							<input
								placeholder="Search by title..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 focus:border-indigo-500 rounded-xl font-medium text-sm transition-all outline-none w-56"
							/>
						</div>
						<div className="relative">
							<Filter
								className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
								size={16}
							/>
							<select
								value={selectedProjectId}
								onChange={(e) => setSelectedProjectId(e.target.value)}
								className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 focus:border-indigo-500 rounded-xl font-medium text-sm transition-all outline-none appearance-none cursor-pointer"
							>
								<option value="">All Projects</option>
								{projects?.map((p: any) => (
									<option key={p.id} value={p.id}>
										{p.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			{isLoadingHistory ? (
				<div className="space-y-3">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="bg-white rounded-2xl border border-gray-100 h-20 animate-pulse"
						/>
					))}
				</div>
			) : filteredHistory.length > 0 ? (
				<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
					{/* Table header */}
					<div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 border-b border-gray-100">
						<div className="col-span-4 text-xs font-black text-gray-400 uppercase tracking-widest">
							Meeting
						</div>
						<div className="col-span-2 text-xs font-black text-gray-400 uppercase tracking-widest">
							Date
						</div>
						<div className="col-span-2 text-xs font-black text-gray-400 uppercase tracking-widest">
							Time
						</div>
						<div className="col-span-2 text-xs font-black text-gray-400 uppercase tracking-widest">
							Duration
						</div>
						<div className="col-span-1 text-xs font-black text-gray-400 uppercase tracking-widest">
							Participants
						</div>
						<div className="col-span-1 text-xs font-black text-gray-400 uppercase tracking-widest">
							Status
						</div>
					</div>

					{/* Rows */}
					{filteredHistory.map((meeting: any, idx: number) => {
						const status = meeting.status as keyof typeof statusConfig;
						const cfg = statusConfig[status] || statusConfig.COMPLETED;
						const StatusIcon = cfg.icon;

						return (
							<div
								key={meeting.id}
								className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-indigo-50/30 transition-colors ${
									idx !== filteredHistory.length - 1 ? "border-b border-gray-50" : ""
								}`}
							>
								{/* Title + host */}
								<div className="col-span-4 flex items-center gap-3 min-w-0">
									<div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
										<Video size={18} className="text-gray-400" />
									</div>
									<div className="min-w-0">
										<p className="font-black text-gray-900 truncate">{meeting.title}</p>
										<p className="text-xs text-gray-400 font-medium truncate">
											By {meeting.createdBy?.name || "Member"}
										</p>
									</div>
								</div>

								{/* Date */}
								<div className="col-span-2 flex items-center gap-2 text-sm font-bold text-gray-600">
									<Calendar size={14} className="text-indigo-400 flex-shrink-0" />
									{new Date(meeting.date).toLocaleDateString(undefined, {
										day: "2-digit",
										month: "short",
										year: "numeric",
									})}
								</div>

								{/* Time */}
								<div className="col-span-2 flex items-center gap-2 text-sm font-bold text-gray-600">
									<Clock size={14} className="text-indigo-400 flex-shrink-0" />
									{new Date(meeting.date).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>

								{/* Duration */}
								<div className="col-span-2 text-sm font-bold text-gray-500">
									{meeting.duration ? (
										<span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg">
											{meeting.duration} min
										</span>
									) : (
										<span className="text-gray-300">—</span>
									)}
								</div>

								{/* Participants */}
								<div className="col-span-1 flex items-center gap-1.5 text-sm font-bold text-gray-500">
									<Users size={14} className="text-gray-400" />
									<span>{meeting.participants?.length || 0}</span>
								</div>

								{/* Status */}
								<div className="col-span-1">
									<span
										className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${cfg.bg} ${cfg.text}`}
									>
										<StatusIcon size={12} />
										{cfg.label}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
					<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
						<Video size={40} />
					</div>
					<h3 className="text-2xl font-black text-gray-400">No meeting history</h3>
					<p className="text-gray-400 font-medium mt-2">
						Completed meetings will appear here
					</p>
				</div>
			)}
		</div>
	);
}
