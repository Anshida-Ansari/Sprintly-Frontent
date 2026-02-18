import { Calendar, Layout, Loader2, Target, X } from "lucide-react";
import { useEffect } from "react";
import type { ISprint } from "../types/types.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sprintSchema, type SprintFormData } from "../schemas/admin.schemas";

interface SprintModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: any) => void;
	sprint?: ISprint;
	isLoading?: boolean;
	minDate?: string;
	maxDate?: string;
}

export default function SprintModal({
	isOpen,
	onClose,
	onSubmit,
	sprint,
	isLoading,
	minDate,
	maxDate,
}: SprintModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<SprintFormData>({
		resolver: zodResolver(sprintSchema),
		defaultValues: {
			name: "",
			goal: "",
			startDate: "",
			endDate: "",
		},
	});

	useEffect(() => {
		if (sprint) {
			setValue("name", sprint.name);
			setValue("goal", sprint.goal || "");
			setValue("startDate", new Date(sprint.startDate).toISOString().split("T")[0]);
			setValue("endDate", new Date(sprint.endDate).toISOString().split("T")[0]);
		} else {
			reset();
		}
	}, [sprint, isOpen, reset, setValue]);

	if (!isOpen) return null;

	const handleFormSubmit = (data: SprintFormData) => {
		const payload = {
			...data,
			...(sprint && { status: sprint.status }),
		};
		onSubmit(payload);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
			<div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
				<div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
					<div>
						<h2 className="text-2xl font-black text-gray-900 leading-tight">
							{sprint ? "Update Sprint" : "New Sprint"}
						</h2>
						<p className="text-gray-500 font-bold text-sm">
							Define your next milestone
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm group"
					>
						<X
							size={20}
							className="text-gray-400 group-hover:text-gray-900 transition-colors"
						/>
					</button>
				</div>

				<form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-6" noValidate>
					{minDate && maxDate && (
						<div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2 text-xs font-bold text-amber-600">
							<span className="mt-0.5">⚠️</span>
							<span>
								Sprint dates must be within project timeline: <br />
								{new Date(minDate).toLocaleDateString()} -{" "}
								{new Date(maxDate).toLocaleDateString()}
							</span>
						</div>
					)}

					<div className="space-y-2">
						<label className="text-sm font-black text-gray-700 ml-1 flex items-center gap-2">
							<Layout size={16} className="text-indigo-500" /> Sprint Name
						</label>
						<input
							{...register("name")}
							placeholder="e.g. Sprint 1: Foundation"
							className={`w-full px-5 py-4 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-${errors.name ? 'red' : 'indigo'}-500 focus:ring-4 focus:ring-${errors.name ? 'red' : 'indigo'}-500/10 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400`}
						/>
						{errors.name && (
							<p className="text-red-500 text-xs mt-1 font-medium">
								{errors.name.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-black text-gray-700 ml-1 flex items-center gap-2">
							<Target size={16} className="text-orange-500" /> Sprint Goal
						</label>
						<textarea
							{...register("goal")}
							placeholder="What do we want to achieve?"
							className={`w-full px-5 py-4 bg-gray-50 border ${errors.goal ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-${errors.goal ? 'red' : 'indigo'}-500 focus:ring-4 focus:ring-${errors.goal ? 'red' : 'indigo'}-500/10 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-none`}
						/>
						{errors.goal && (
							<p className="text-red-500 text-xs mt-1 font-medium">
								{errors.goal.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-black text-gray-700 ml-1 flex items-center gap-2">
								<Calendar size={16} className="text-emerald-500" /> Start Date
							</label>
							<input
								{...register("startDate")}
								type="date"
								min={
									minDate
										? new Date(minDate).toISOString().split("T")[0]
										: undefined
								}
								max={
									maxDate
										? new Date(maxDate).toISOString().split("T")[0]
										: undefined
								}
								className={`w-full px-5 py-4 bg-gray-50 border ${errors.startDate ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-${errors.startDate ? 'red' : 'indigo'}-500 focus:ring-4 focus:ring-${errors.startDate ? 'red' : 'indigo'}-500/10 transition-all outline-none font-bold text-gray-900`}
							/>
							{errors.startDate && (
								<p className="text-red-500 text-xs mt-1 font-medium">
									{errors.startDate.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<label className="text-sm font-black text-gray-700 ml-1 flex items-center gap-2">
								<Calendar size={16} className="text-rose-500" /> End Date
							</label>
							<input
								{...register("endDate")}
								type="date"
								min={
									minDate
										? new Date(minDate).toISOString().split("T")[0]
										: undefined
								}
								max={
									maxDate
										? new Date(maxDate).toISOString().split("T")[0]
										: undefined
								}
								className={`w-full px-5 py-4 bg-gray-50 border ${errors.endDate ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-${errors.endDate ? 'red' : 'indigo'}-500 focus:ring-4 focus:ring-${errors.endDate ? 'red' : 'indigo'}-500/10 transition-all outline-none font-bold text-gray-900`}
							/>
							{errors.endDate && (
								<p className="text-red-500 text-xs mt-1 font-medium">
									{errors.endDate.message}
								</p>
							)}
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-3 group mt-4"
					>
						{isLoading ? (
							<Loader2 className="animate-spin" size={24} />
						) : (
							<>{sprint ? "Update Sprint" : "Create Sprint"}</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
