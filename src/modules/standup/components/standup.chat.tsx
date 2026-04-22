import {
	addDays,
	addMonths,
	endOfMonth,
	endOfWeek,
	format,
	isAfter,
	isSameDay,
	isSameMonth,
	startOfMonth,
	startOfWeek,
	subMonths,
} from "date-fns";
import {
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Loader2,
	MessageSquare,
	Plus,
	TrendingUp,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
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
	const todayStr = format(new Date(), "yyyy-MM-dd");
	const [selectedDate, setSelectedDate] = useState<string>(todayStr);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [showCalendar, setShowCalendar] = useState(false);

	const { data: standups, isLoading } = useListStandups(
		projectId,
		sprintId,
		selectedDate,
	);
	const [showForm, setShowForm] = useState(false);

	const handleDateChange = (days: number) => {
		const newDate = addDays(new Date(selectedDate), days);
		const newDateStr = format(newDate, "yyyy-MM-dd");
		if (isAfter(newDate, new Date())) return;
		setSelectedDate(newDateStr);
		setCurrentMonth(newDate);
	};

	const calendarDays = useMemo(() => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(monthStart);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);

		const days = [];
		let day = startDate;

		while (day <= endDate) {
			days.push(day);
			day = addDays(day, 1);
		}
		return days;
	}, [currentMonth]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full min-h-[400px]">
				<Loader2 className="w-10 h-10 animate-spin text-indigo-600 opacity-20" />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-transparent overflow-hidden relative">
			{/* Compact Clean Header */}
			<div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4 border-b border-gray-100/60 bg-white/40 sticky top-0 z-20 backdrop-blur-md">
				<div className="flex items-center gap-4">
					<div className="flex items-center bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200/50 relative group/picker transition-all hover:bg-gray-100">
						<button
							onClick={() => handleDateChange(-1)}
							className="p-1.5 hover:bg-white hover:text-indigo-600 rounded-xl transition-all text-gray-400 theme-transition z-10 hover:shadow-sm"
						>
							<ChevronLeft size={18} />
						</button>

						<div
							onClick={() => setShowCalendar(!showCalendar)}
							className="px-4 flex items-center gap-3 font-black text-gray-800 text-sm min-w-[200px] justify-center cursor-pointer hover:text-indigo-600 transition-colors py-1 relative"
						>
							<div className="p-1.5 bg-white rounded-lg shadow-sm group-hover/picker:bg-indigo-50 transition-colors">
								<CalendarIcon size={14} className="text-indigo-500" />
							</div>
							<span className="tracking-tight">
								{selectedDate === todayStr
									? "Today"
									: format(new Date(selectedDate), "MMM d, yyyy")}
							</span>
						</div>

						<button
							onClick={() => handleDateChange(1)}
							disabled={selectedDate === todayStr}
							className="p-1.5 hover:bg-white hover:text-indigo-600 rounded-xl transition-all text-gray-400 disabled:opacity-20 theme-transition z-10 hover:shadow-sm"
						>
							<ChevronRight size={18} />
						</button>

						{selectedDate !== todayStr && (
							<button
								onClick={() => {
									setSelectedDate(todayStr);
									setCurrentMonth(new Date());
								}}
								className="ml-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100/50"
							>
								Today
							</button>
						)}

						{/* Custom Premium Calendar Dropdown */}
						{showCalendar && (
							<div className="absolute top-full left-0 mt-4 bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-5 z-[100] w-72 animate-in zoom-in-95 duration-200 origin-top">
								<div className="flex items-center justify-between mb-4 px-1">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setCurrentMonth(subMonths(currentMonth, 1));
										}}
										className="p-1.5 hover:bg-gray-50 rounded-xl transition-colors"
									>
										<ChevronLeft size={16} />
									</button>
									<span className="text-sm font-black text-gray-800 uppercase tracking-widest pl-1">
										{format(currentMonth, "MMMM yyyy")}
									</span>
									<button
										onClick={(e) => {
											e.stopPropagation();
											setCurrentMonth(addMonths(currentMonth, 1));
										}}
										className="p-1.5 hover:bg-gray-50 rounded-xl transition-colors"
									>
										<ChevronRight size={16} />
									</button>
								</div>

								<div className="grid grid-cols-7 gap-1 mb-2">
									{["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: static list
											key={`day-header-${d}-${idx}`}
											className="text-center text-[9px] font-black text-gray-400 py-1"
										>
											{d}
										</div>
									))}
								</div>

								<div className="grid grid-cols-7 gap-1">
									{calendarDays.map((day) => {
										const isSelected = isSameDay(day, new Date(selectedDate));
										const isCurrentMonth = isSameMonth(day, currentMonth);
										const isToday = isSameDay(day, new Date());
										const isDisabled = isAfter(day, new Date());

										return (
											<button
												key={day.toISOString()}
												disabled={isDisabled}
												onClick={(e) => {
													e.stopPropagation();
													if (!isDisabled) {
														setSelectedDate(format(day, "yyyy-MM-dd"));
														setShowCalendar(false);
													}
												}}
												className={`
													aspect-square p-2 rounded-xl text-[11px] font-bold transition-all relative
													${isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" : ""}
													${!isSelected && isCurrentMonth && !isDisabled ? "hover:bg-indigo-50 text-gray-700" : ""}
													${!isCurrentMonth || isDisabled ? "text-gray-200" : ""}
													${isToday && !isSelected ? "text-indigo-600 ring-2 ring-indigo-50" : ""}
												`}
											>
												{format(day, "d")}
											</button>
										);
									})}
								</div>
							</div>
						)}
					</div>

					<div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
						<TrendingUp size={10} />
						{standups?.length || 0} updates
					</div>
				</div>

				{userRole === "developer" &&
					!showForm &&
					selectedDate === todayStr &&
					!!sprintId && (
						<button
							onClick={() => setShowForm(true)}
							className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
						>
							<Plus size={18} />
							<span>Post Update</span>
						</button>
					)}
			</div>

			<div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-none">
				{/* Modern Form Overlay */}
				{showForm && (
					<div className="animate-in slide-in-from-top-4 fade-in duration-500 max-w-3xl mx-auto w-full">
						<div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative group overflow-hidden">
							<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
							<button
								onClick={() => setShowForm(false)}
								className="absolute top-6 right-6 p-2 text-gray-300 hover:text-rose-500 transition-colors"
							>
								<X size={20} />
							</button>
							<div className="mb-8">
								<h4 className="font-black text-gray-900 text-2xl tracking-tight">
									Daily Status
								</h4>
								<p className="text-gray-400 font-medium text-sm mt-1">
									Sync your progress with the team
								</p>
							</div>
							<StandupForm
								projectId={projectId}
								sprintId={sprintId}
								onClose={() => setShowForm(false)}
							/>
						</div>
					</div>
				)}

				<div className="grid gap-10 max-w-4xl mx-auto w-full pb-20">
					{standups && standups.length > 0 ? (
						standups.map((standup) => (
							<StandupCard key={standup._id} standup={standup} />
						))
					) : (
						<div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95 duration-700">
							<div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100">
								<MessageSquare size={32} className="text-gray-200" />
							</div>
							<h3 className="text-xl font-black text-gray-900 mb-2">
								No logs found
							</h3>
							<p className="text-gray-400 font-medium max-w-xs mx-auto text-sm">
								{selectedDate === todayStr
									? "Be the first to share your progress today."
									: "No one submitted their standup for this date."}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
