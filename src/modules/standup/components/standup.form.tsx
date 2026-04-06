import { useEffect, useState } from "react";
import { useSubmitStandup } from "../hooks/useSubmitStandup";
import { useTodayStandup } from "../hooks/useTodayStandup";
import { CheckCircle2, Clock, AlertCircle, Send, Loader2, Sparkles } from "lucide-react";

interface StandupFormProps {
	projectId: string;
	sprintId: string;
	onClose?: () => void;
}

export const StandupForm = ({
	projectId,
	sprintId,
	onClose,
}: StandupFormProps) => {
	const [yesterday, setYesterday] = useState("");
	const [today, setToday] = useState("");
	const [blockers, setBlockers] = useState("");

	const { data: todayStandup, isLoading: isLoadingExisting } = useTodayStandup(
		projectId,
		sprintId,
	);
	const { mutate, isPending } = useSubmitStandup(projectId, sprintId);

	useEffect(() => {
		if (todayStandup) {
			setYesterday(todayStandup.yesterday || "");
			setToday(todayStandup.today || "");
			setBlockers(todayStandup.blockers || "");
		}
	}, [todayStandup]);

	const handleSubmit = () => {
		mutate({ yesterday, today, blockers });
	};

	if (isLoadingExisting) {
		return (
			<div className="flex flex-col items-center justify-center py-8 gap-3">
				<Loader2 className="w-6 h-6 animate-spin text-indigo-600 opacity-30" />
				<p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Syncing draft...</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 animate-in fade-in duration-500">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Yesterday */}
				<div className="space-y-1.5 group">
					<label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
						<CheckCircle2 size={12} />
						Yesterday
					</label>
					<textarea
						className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 rounded-xl p-3 text-[13px] text-gray-700 font-medium transition-all duration-300 outline-none min-h-[70px] resize-none"
						placeholder="What was done?"
						onChange={(e) => setYesterday(e.target.value)}
						value={yesterday}
					/>
				</div>

				{/* Today */}
				<div className="space-y-1.5 group">
					<label className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
						<Clock size={12} />
						Focus
					</label>
					<textarea
						className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 rounded-xl p-3 text-[13px] text-gray-800 font-bold transition-all duration-300 outline-none min-h-[70px] resize-none"
						placeholder="What's for today?"
						onChange={(e) => setToday(e.target.value)}
						value={today}
					/>
				</div>
			</div>

			{/* Blockers - Full Width but Slim */}
			<div className="space-y-1.5 group">
				<label className="text-[9px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
					<AlertCircle size={12} />
					Blockers
				</label>
				<textarea
					className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-50 rounded-xl p-3 text-[13px] text-gray-700 font-medium transition-all duration-300 outline-none min-h-[50px] resize-none"
					placeholder="Any impediments? (Optional)"
					onChange={(e) => setBlockers(e.target.value)}
					value={blockers}
				/>
			</div>

			<div className="pt-4 flex items-center justify-between gap-4 border-t border-gray-50 mt-2">
				<div className="flex items-center gap-2">
                    <Sparkles size={10} className="text-indigo-400 animate-pulse" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Sync</span>
                </div>
                
                <div className="flex items-center gap-2">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 font-bold text-[11px] hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={() => {
                            handleSubmit();
                            if (onClose && !isPending) setTimeout(onClose, 800);
                        }}
                        disabled={isPending || !yesterday.trim() || !today.trim()}
                        className="group flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs hover:bg-indigo-700 transition-all shadow-sm active:scale-95 disabled:opacity-20"
                    >
                        {isPending ? "Syncing..." : todayStandup ? "Update" : "Publish"}
                        {!isPending && <Send size={14} />}
                    </button>
                </div>
			</div>
		</div>
	);
};
