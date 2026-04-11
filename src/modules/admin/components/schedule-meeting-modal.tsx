import { ArrowRight, Check, ChevronDown, Loader2, Users, Video, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetProject } from "../hooks/useGetProject";
import { useMeetings } from "../hooks/useMeetings";
import { useProjects } from "../hooks/useProjects";

interface ScheduleMeetingModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface FormData {
	title: string;
	projectId: string;
	date: string;
	type: "single" | "group";
	participants: string[];
}

export default function ScheduleMeetingModal({
	isOpen,
	onClose,
}: ScheduleMeetingModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			type: "group",
		},
	});

	const selectedProjectId = watch("projectId");
	const { data: projectRes } = useGetProject(selectedProjectId);

	const { data: projectsRes } = useProjects({ page: 1, limit: 100 });
	const { scheduleMeeting, isScheduling } = useMeetings();
	const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
		[],
	);

	const projects = projectsRes?.data || [];
	const projectMembers = projectRes?.data?.members || [];



	const toggleParticipant = (userId: string) => {
		setSelectedParticipants((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	};

	const onSubmit = (data: FormData) => {
		scheduleMeeting(
			{
				...data,
				participants: selectedParticipants,
			},
			{
				onSuccess: () => {
					reset();
					setSelectedParticipants([]);
					onClose();
				},
			},
		);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
			<div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">

				{/* Header */}
				<div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
					<div className="space-y-1">
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-2">
							<Video size={14} className="text-blue-600" />
							<span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
								Collaboration
							</span>
						</div>
						<h2 className="text-3xl font-black tracking-tight text-slate-900">
							SCHEDULE <span className="text-blue-600">MEETING</span>
						</h2>
						<p className="text-slate-500 font-bold text-sm">
							Organize a session with your team.
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all duration-300"
					>
						<X size={24} />
					</button>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="px-8 py-6 space-y-5 max-h-[70vh] overflow-y-auto"
				>
					{/* Title Input */}
					<div className={`group relative bg-slate-50 border-2 ${errors.title ? 'border-red-500' : 'border-transparent group-hover:border-slate-200'} rounded-2xl p-3 focus-within:bg-white focus-within:border-${errors.title ? 'red' : 'blue'}-600 focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all duration-300`}>
						<p className={`text-[10px] font-black uppercase tracking-widest ${errors.title ? 'text-red-600' : 'text-slate-400 group-focus-within:text-blue-600'} mb-1 ml-1`}>
							Meeting Title
						</p>
						<input
							{...register("title", { required: "Title is required" })}
							placeholder="e.g. Daily Standup"
							className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-300 text-slate-900"
						/>
					</div>


					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{/* Project Selection */}
						<div className={`group relative bg-slate-50 border-2 ${errors.projectId ? 'border-red-500' : 'border-transparent group-hover:border-slate-200'} rounded-2xl p-3 focus-within:bg-white focus-within:border-${errors.projectId ? 'red' : 'blue'}-600 focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all duration-300`}>
							<p className={`text-[10px] font-black uppercase tracking-widest ${errors.projectId ? 'text-red-600' : 'text-slate-400 group-focus-within:text-blue-600'} mb-1 ml-1`}>
								Project Context
							</p>
							<div className="relative">
								<select
									{...register("projectId", { required: "Project is required" })}
									className="w-full bg-transparent outline-none font-bold text-base text-slate-900 appearance-none cursor-pointer py-1 pr-8"
								>
									<option value="">Select Project...</option>
									{projects?.map((p: any) => (
										<option key={p.id} value={p.id}>
											{p.name}
										</option>
									))}
								</select>
								<div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
									<ChevronDown size={18} strokeWidth={2.5} />
								</div>
							</div>
						</div>

						{/* Date Selection */}
						<div className="space-y-1">
							<div className={`group relative bg-slate-50 border-2 ${errors.date ? 'border-red-500' : 'border-transparent group-hover:border-slate-200'} rounded-2xl p-3 focus-within:bg-white focus-within:border-${errors.date ? 'red' : 'blue'}-600 focus-within:shadow-lg focus-within:shadow-blue-500/10 transition-all duration-300`}>
								<p className={`text-[10px] font-black uppercase tracking-widest ${errors.date ? 'text-red-600' : 'text-slate-400 group-focus-within:text-blue-600'} mb-1 ml-1`}>
									Date & Time
								</p>
								<input
									type="datetime-local"
									{...register("date", {
										required: "Date is required",
										validate: (value) => {
											const selectedDate = new Date(value);
											const now = new Date();
											return selectedDate > now || "Date must be in the future";
										}
									})}
									min={new Date().toISOString().slice(0, 16)}
									className="w-full bg-transparent outline-none font-bold text-base text-slate-900 placeholder:text-slate-300"
								/>
							</div>
							{errors.date && (
								<p className="ml-1 text-[10px] font-bold text-red-500 uppercase tracking-tight">
									{errors.date.message}
								</p>
							)}
						</div>
					</div>

					{/* Members Selection */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Users size={16} className="text-slate-400" />
							<p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
								Assign Members
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{projectMembers.length > 0 ? (
								projectMembers.map((member: any) => (
									<button
										key={member.id}
										type="button"
										onClick={() => toggleParticipant(member.id)}
										className={`group relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${selectedParticipants.includes(member.id)
											? "border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-100"
											: "border-slate-100 hover:border-blue-200 bg-white"
											}`}
									>
										<div
											className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedParticipants.includes(member.id)
												? "bg-blue-600 text-white rotate-3"
												: "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
												}`}
										>
											{selectedParticipants.includes(member.id) ? (
												<Check size={20} strokeWidth={3} />
											) : (
												<span className="text-sm font-black">{member.name.charAt(0)}</span>
											)}
										</div>
										<div className="flex flex-col items-start">
											<span className={`font-bold text-sm transition-colors ${selectedParticipants.includes(member.id) ? "text-blue-900" : "text-slate-700"
												}`}>
												{member.name}
											</span>
											<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
												{member.role || "Member"}
											</span>
										</div>

										{selectedParticipants.includes(member.id) && (
											<div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
										)}
									</button>
								))
							) : (
								<div className="col-span-2 py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2 bg-slate-50/50">
									<Users size={32} className="text-slate-300 mb-2" />
									<p className="text-slate-900 font-bold">No Members Available</p>
									<p className="text-slate-500 text-sm max-w-xs">
										{selectedProjectId
											? "This project hasn't been assigned any members yet."
											: "Select a project above to view available team members."}
									</p>
								</div>
							)}
						</div>
					</div>
				</form>

				{/* Footer Steps */}
				<div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 py-4 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl font-black border-2 border-slate-200 hover:border-slate-300 transition-all uppercase tracking-wide text-sm"
					>
						Cancel Assignment
					</button>
					<button
						disabled={isScheduling}
						onClick={handleSubmit(onSubmit)}
						className="flex-[2] py-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.98]"
					>
						{isScheduling ? (
							<>
								<Loader2 size={20} className="animate-spin" />
								<span>PROCESSING...</span>
							</>
						) : (
							<>
								<span className="tracking-wide">CONFIRM SCHEDULE</span>
								<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
