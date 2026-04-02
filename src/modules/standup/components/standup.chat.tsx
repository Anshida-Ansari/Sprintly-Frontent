import { Loader2, MessageSquare, Plus, X, CalendarDays, TrendingUp, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useListStandups } from "../hooks/useListStandup";
import { StandupCard } from "./standup.card";
import { StandupForm } from "./standup.form";

interface StandupChatProps {
	projectId: string;
	sprintId: string;
	userRole?: "admin" | "developer";
}

export const StandupChat = ({
	projectId,
	sprintId,
	userRole = "developer",
}: StandupChatProps) => {
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const { data: standups, isLoading } = useListStandups(projectId, sprintId, selectedDate || undefined);
	const [showForm, setShowForm] = useState(false);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full min-h-[400px]">
				<div className="relative">
					<div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
					<Loader2 className="w-10 h-10 animate-spin text-indigo-600 relative z-10" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-transparent relative">
			{/* Header */}
			<div className="flex items-center justify-between p-6 border-b border-gray-100/50 sticky top-0 z-20 bg-white/60 backdrop-blur-xl">
				<div className="flex items-center gap-5">
					<div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200/50">
						<MessageSquare size={26} strokeWidth={2.5} />
					</div>
					<div>
						<h3 className="text-2xl font-black text-gray-900 tracking-tight">Standup Updates</h3>
						<div className="flex items-center gap-2 mt-1">
							<TrendingUp size={14} className="text-emerald-500" />
							<p className="text-sm font-bold text-gray-500">
								{standups?.length || 0} updates this sprint
							</p>
						</div>
					</div>
				</div>

				{userRole === "developer" && !showForm && (
					<button
						onClick={() => setShowForm(true)}
						className="group flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-95"
					>
						<Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
						<span>Post Update</span>
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
				{/* Form Section - Stylish Overlay Card */}
				{showForm && (
					<div className="mb-10 animate-in slide-in-from-top-8 fade-in duration-500">
						<div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
							<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
							<button
								onClick={() => setShowForm(false)}
								className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all duration-200 ease-out"
							>
								<X size={20} className="stroke-[2.5]" />
							</button>
							<div className="mb-8">
								<h4 className="font-extrabold text-gray-900 text-2xl flex items-center gap-3">
									<span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">✨</span>
									Daily Update
								</h4>
								<p className="text-gray-500 font-medium mt-2">What did you accomplish and what's next?</p>
							</div>
							<StandupForm
								projectId={projectId}
								sprintId={sprintId}
								onClose={() => setShowForm(false)}
							/>
						</div>
					</div>
				)}

				{!selectedDate ? (
					<div className="space-y-4 max-w-4xl mx-auto">
						{(() => {
							if (!standups || standups.length === 0) {
								return (
									<div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
										<div className="w-24 h-24 bg-gradient-to-tr from-gray-50 to-gray-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm border border-gray-200/50">
											<MessageSquare size={40} className="text-gray-300" />
										</div>
										<h3 className="text-2xl font-black text-gray-900 mb-3">No updates yet</h3>
										<p className="text-gray-500 font-medium max-w-sm mx-auto text-base leading-relaxed">
											Be the first to share your progress with the team for this sprint.
										</p>
									</div>
								);
							}
							
							const uniqueDates = Array.from(new Set(standups.map(s => new Date(s.createdAt).toISOString().split('T')[0])));
							
							return (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{uniqueDates.map(date => {
										const dateObj = new Date(date);
										const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
										const isToday = new Date().toISOString().split('T')[0] === date;

										return (
										<button
											key={date}
											onClick={() => setSelectedDate(date)}
											className="group flex flex-col items-start p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-indigo-500 hover:shadow-[0_8px_30px_rgb(79,70,229,0.12)] transition-all duration-300 text-left relative overflow-hidden h-40"
										>
											<div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors duration-500"></div>
											<div className="flex items-center gap-3 mb-auto">
												<div className={`p-3 rounded-2xl ${isToday ? 'bg-indigo-600' : 'bg-gray-100'}`}>
													<CalendarDays size={20} className={isToday ? 'text-white' : 'text-gray-500'} />
												</div>
												<div>
													<span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isToday ? "Today" : "Update Log"}</span>
													<h4 className="text-lg font-black text-gray-900 mt-0.5">{formattedDate}</h4>
												</div>
											</div>
											<div className="w-full mt-4 flex items-center justify-between">
												<span className="text-sm font-bold text-gray-500 group-hover:text-indigo-600 transition-colors">View entries</span>
												<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
													<ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-600" />
												</div>
											</div>
										</button>
									)})}
								</div>
							);
						})()}
					</div>
				) : (
					<div className="space-y-8 max-w-4xl mx-auto animate-in slide-in-from-right-8 fade-in duration-500">
						<button 
							onClick={() => setSelectedDate(null)}
							className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl transition-all"
						>
							&larr; Back to Timeline
						</button>
						
						<div className="flex items-center gap-4 py-4 mb-4 border-b border-gray-100">
							<div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
								<CalendarDays size={24} />
							</div>
							<div>
								<h2 className="text-2xl font-black text-gray-900">
									{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
								</h2>
								<p className="text-gray-500 font-medium text-sm mt-1">Daily updates for this date</p>
							</div>
						</div>

						<div className="grid gap-6">
							{standups && standups.length > 0 ? (
								standups.map((standup) => (
									<StandupCard
										key={standup._id}
										standup={standup}
										projectId={projectId}
										sprintId={sprintId}
									/>
								))
							) : (
								<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 font-bold bg-gray-50 rounded-[2rem] border border-gray-100 border-dashed">
									No updates found for this date
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
