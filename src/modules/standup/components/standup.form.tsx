import { useState } from "react";
import { useSubmitStandup } from "../hooks/useSubmitStandup";

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
		<div className="space-y-4">
			<div className="space-y-2">
				<label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
					What did you do yesterday?
				</label>
				<textarea
					className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl p-4 text-sm font-medium transition-all outline-none min-h-[80px] resize-none"
					placeholder="e.g. Completed user authentication flow..."
					onChange={(e) => setYesterday(e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
					What will you do today?
				</label>
				<textarea
					className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl p-4 text-sm font-medium transition-all outline-none min-h-[80px] resize-none"
					placeholder="e.g. Working on dashboard analytics..."
					onChange={(e) => setToday(e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
					Any blockers?
				</label>
				<textarea
					className="w-full bg-rose-50 border-transparent focus:bg-white focus:border-rose-500 rounded-xl p-4 text-sm font-medium transition-all outline-none min-h-[60px] resize-none text-rose-700 placeholder:text-rose-300"
					placeholder="e.g. Waiting for API documentation..."
					onChange={(e) => setBlockers(e.target.value)}
				/>
			</div>

			<div className="pt-2 flex justify-end gap-3">
				{onClose && (
					<button
						onClick={onClose}
						className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
					>
						Cancel
					</button>
				)}
				<button
					onClick={() => {
						handleSubmit();
						if (onClose && !isPending) setTimeout(onClose, 500); // Close shortly after submit if provided (logic handled in mutation success usually, but this is a quick patch)
					}}
					disabled={isPending}
					className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending ? "Submitting..." : "Submit Update"}
				</button>
			</div>
		</div>
	);
};
