import { useState } from "react";
import { useSubmitStandup } from "../hooks/useSubmitStandup";
import { CheckCircle2, Clock, AlertCircle, Send } from "lucide-react";

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

	const { mutate, isPending } = useSubmitStandup(projectId, sprintId);

	const handleSubmit = () => {
		mutate({ yesterday, today, blockers });
	};

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			<div className="space-y-3 group">
				<label className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
					<CheckCircle2 size={16} />
					What did you do yesterday?
				</label>
				<textarea
					className="w-full bg-emerald-50/30 border-2 border-emerald-100/50 focus:bg-white focus:border-emerald-500 rounded-2xl p-5 text-gray-700 font-medium transition-all duration-300 outline-none min-h-[100px] resize-none focus:ring-4 focus:ring-emerald-50 placeholder:text-emerald-300/70 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
					placeholder="e.g., Completed the new authentication flow and wrote tests..."
					onChange={(e) => setYesterday(e.target.value)}
					value={yesterday}
				/>
			</div>

			<div className="space-y-3 group">
				<label className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
					<Clock size={16} />
					What will you do today?
				</label>
				<textarea
					className="w-full bg-blue-50/30 border-2 border-blue-100/50 focus:bg-white focus:border-blue-500 rounded-2xl p-5 text-gray-700 font-medium transition-all duration-300 outline-none min-h-[100px] resize-none focus:ring-4 focus:ring-blue-50 placeholder:text-blue-300/70 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
					placeholder="e.g., Starting work on the dashboard analytics components..."
					onChange={(e) => setToday(e.target.value)}
					value={today}
				/>
			</div>

			<div className="space-y-3 group">
				<label className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
					<AlertCircle size={16} />
					Any blockers? <span className="text-gray-400 font-medium normal-case ml-1 tracking-normal">(Optional)</span>
				</label>
				<textarea
					className="w-full bg-rose-50/30 border-2 border-rose-100/50 focus:bg-white focus:border-rose-500 rounded-2xl p-5 text-gray-700 font-medium transition-all duration-300 outline-none min-h-[80px] resize-none focus:ring-4 focus:ring-rose-50 placeholder:text-rose-300/70 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
					placeholder="e.g., Waiting for the API documentation from the backend team..."
					onChange={(e) => setBlockers(e.target.value)}
					value={blockers}
				/>
			</div>

			<div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-100">
				{onClose && (
					<button
						onClick={onClose}
						className="px-6 py-3.5 text-gray-500 font-bold hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200"
					>
						Cancel
					</button>
				)}
				<button
					onClick={() => {
						handleSubmit();
						if (onClose && !isPending) setTimeout(onClose, 600);
					}}
					disabled={isPending || !yesterday.trim() || !today.trim()}
					className="group flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
				>
					{isPending ? "Submitting..." : "Publish Update"}
					{!isPending && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
				</button>
			</div>
		</div>
	);
};
