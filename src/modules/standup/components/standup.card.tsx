import { format } from "date-fns";
import {
	AlertCircle,
	CheckCircle2,
	Clock,
} from "lucide-react";
import type { Standup } from "../types/standup.types";

interface StandupCardProps {
	standup: Standup;
}

export const StandupCard = ({
	standup,
}: StandupCardProps) => {

	return (
		<div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden group">
			<div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-50">
				{/* User Info - Highly Compact */}
				<div className="p-4 md:p-6 bg-gray-50/30 flex items-center md:flex-col md:items-center gap-3 md:gap-4 md:w-32 shrink-0">
					<div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm md:text-lg shadow-sm border border-white shrink-0">
						{standup.user.name.charAt(0).toUpperCase()}
					</div>
					<div className="flex-1 md:text-center min-w-0">
						<h4 className="font-black text-gray-900 text-xs tracking-tight truncate">
							{standup.user.name.split(" ")[0]}
						</h4>
						<p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
							{format(new Date(standup.createdAt), "h:mm a")}
						</p>
					</div>
					{standup.blockers && (
						<div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
					)}
				</div>

				{/* Content Sections - 3 Column Grid */}
				<div className="flex-1 p-4 md:p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Yesterday */}
						<div className="group/section relative pl-4">
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full opacity-30 group-hover/section:opacity-100 transition-opacity" />
							<h5 className="font-black text-emerald-700 uppercase tracking-widest text-[9px] mb-2 flex items-center gap-2">
								<CheckCircle2 size={10} />
								Yesterday
							</h5>
							<p className="text-gray-600 text-[13px] font-medium leading-relaxed line-clamp-3 group-hover/section:line-clamp-none transition-all">
								{standup.yesterday}
							</p>
						</div>

						{/* Today */}
						<div className="group/section relative pl-4">
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full opacity-30 group-hover/section:opacity-100 transition-opacity" />
							<h5 className="font-black text-indigo-700 uppercase tracking-widest text-[9px] mb-2 flex items-center gap-2">
								<Clock size={10} />
								Focus
							</h5>
							<p className="text-gray-800 text-[13px] font-bold leading-relaxed line-clamp-3 group-hover/section:line-clamp-none transition-all">
								{standup.today}
							</p>
						</div>

						{/* Blockers */}
						<div className="group/section relative pl-4">
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-full opacity-30 group-hover/section:opacity-100 transition-opacity" />
							<h5 className="font-black text-rose-700 uppercase tracking-widest text-[9px] mb-2 flex items-center gap-2">
								<AlertCircle size={10} />
								Blockers
							</h5>
							<p className={`text-[13px] leading-relaxed line-clamp-3 group-hover/section:line-clamp-none transition-all ${
								standup.blockers ? 'text-rose-600 font-bold' : 'text-gray-300 font-medium italic'
							}`}>
								{standup.blockers || "No blockers"}
							</p>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

