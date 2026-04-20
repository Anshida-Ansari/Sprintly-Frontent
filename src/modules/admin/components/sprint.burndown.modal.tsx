import { X, Zap } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { BurnDownChart } from "../../../shared/components/charts/BurnDownChart";
import { useSprintBurndown } from "../../../shared/hooks/useBurndown";
import type { ISprint } from "../types/types";

interface SprintBurndownModalProps {
	isOpen: boolean;
	onClose: () => void;
	sprint: ISprint | null;
}

export const SprintBurndownModal: React.FC<SprintBurndownModalProps> = ({
	isOpen,
	onClose,
	sprint,
}) => {
	const [type, setType] = useState<"hours" | "points">("hours");
	const { data, isLoading } = useSprintBurndown(sprint?._id || null, type);

	if (!isOpen || !sprint) return null;

	const modalContent = (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
			<div
				className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 relative mx-4"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header - More Compact */}
				<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
							<Zap size={20} className="fill-current" />
						</div>
						<div className="min-w-0">
							<div className="flex items-center gap-2 mb-0">
								<span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
									Analytics
								</span>
							</div>
							<h2 className="text-lg font-black text-gray-900 leading-tight truncate">
								{sprint.name}
							</h2>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-white rounded-xl transition-all shadow-sm group border border-transparent hover:border-gray-100"
					>
						<X
							size={18}
							className="text-gray-400 group-hover:text-gray-900 transition-colors"
						/>
					</button>
				</div>

				{/* Chart Content - Refined Padding */}
				<div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
					<div className="mb-4">
						<h3 className="text-xl font-black text-gray-900 tracking-tight">
							{type === "hours" ? "Hourly" : "Story Point"} Evolution
						</h3>
						<p className="text-xs text-gray-500 font-bold">
							Projected vs. actual remaining effort
						</p>
					</div>

					<div className="bg-gray-50/30 rounded-3xl p-4 border border-gray-100/50">
						<BurnDownChart
							data={data || null}
							isLoading={isLoading}
							type={type}
							onTypeChange={setType}
							title="" // Title handled above
							description="" // Description handled above
						/>
					</div>

					{/* Quick Stats - More Compact Grid */}
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
							<p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
								Ideal
							</p>
							<p className="text-[11px] font-bold text-gray-600 leading-snug">
								Uniform target burn rate.
							</p>
						</div>
						<div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
							<p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
								Actual
							</p>
							<p className="text-[11px] font-bold text-gray-600 leading-snug">
								Real-time remaining work.
							</p>
						</div>
						<div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
							<p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
								Insight
							</p>
							<p className="text-[11px] font-bold text-indigo-900 leading-snug">
								Above line = behind schedule.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return createPortal(modalContent, document.body);
};
