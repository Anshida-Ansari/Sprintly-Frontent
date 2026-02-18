import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type IUserStory,
	PriorityStatus,
	UserStoryStatus,
} from "../types/types";
import { userStorySchema, type UserStoryFormData } from "../schemas/admin.schemas";

interface UserStoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: any) => void;
	userStory?: IUserStory;
	isLoading?: boolean;
}

export default function UserStoryModal({
	isOpen,
	onClose,
	onSubmit,
	userStory,
	isLoading,
}: UserStoryModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<UserStoryFormData>({
		resolver: zodResolver(userStorySchema),
		defaultValues: {
			title: "",
			description: "",
			priority: PriorityStatus.MEDIUM,
			status: UserStoryStatus.IN_PENDING,
			estimationPoints: 0,
			acceptanceCriteria: [],
			acceptanceCriteriaText: "",
		},
	});

	useEffect(() => {
		if (isOpen) {
			if (userStory) {
				setValue("title", userStory.title);
				setValue("description", userStory.description);
				setValue("priority", userStory.priority);
				setValue("status", userStory.status);
				setValue("estimationPoints", userStory.estimationPoints || 0);
				setValue("acceptanceCriteria", userStory.acceptanceCriteria || []);
				setValue(
					"acceptanceCriteriaText",
					userStory.acceptanceCriteria?.join("\n") || ""
				);
			} else {
				reset({
					title: "",
					description: "",
					priority: PriorityStatus.MEDIUM,
					status: UserStoryStatus.IN_PENDING,
					estimationPoints: 0,
					acceptanceCriteria: [],
					acceptanceCriteriaText: "",
				});
			}
		}
	}, [userStory, isOpen, reset, setValue]);

	if (!isOpen) return null;

	const handleFormSubmit = (data: UserStoryFormData) => {
		// Convert text area back to array for acceptance criteria
		const criteriaArray = data.acceptanceCriteriaText
			? data.acceptanceCriteriaText.split("\n").filter((line) => line.trim() !== "")
			: [];

		const payload = {
			...data,
			acceptanceCriteria: criteriaArray,
		};

		// Remove helper field
		delete (payload as any).acceptanceCriteriaText;

		onSubmit(payload);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>

			{/* Modal Panel */}
			<div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-gray-100">

				{/* Header */}
				<div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 shrink-0">
					<h2 className="text-lg font-semibold text-gray-900">
						{userStory ? "Edit Issue" : "New Issue"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent hover:bg-gray-100 p-1.5 rounded-md"
					>
						<X size={18} />
					</button>
				</div>

				{/* Scrollable Content */}
				<div className="overflow-y-auto p-6 custom-scrollbar flex-1">
					<form
						id="user-story-form"
						onSubmit={handleSubmit(handleFormSubmit)}
						className="space-y-5"
						noValidate
					>
						<div className="space-y-1.5">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Title
							</label>
							<input
								{...register("title")}
								placeholder="Issue title..."
								autoFocus
								className={`w-full px-3 py-2.5 bg-white border ${errors.title ? "border-red-500" : "border-gray-200"
									} rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400`}
							/>
							{errors.title && (
								<p className="text-red-500 text-xs mt-0.5">
									{errors.title.message}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Description
							</label>
							<textarea
								{...register("description")}
								rows={4}
								placeholder="Add a description..."
								className={`w-full px-3 py-2.5 bg-white border ${errors.description ? "border-red-500" : "border-gray-200"
									} rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm text-gray-900 placeholder:text-gray-400 resize-none leading-relaxed`}
							/>
							{errors.description && (
								<p className="text-red-500 text-xs mt-0.5">
									{errors.description.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-2 gap-5">
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
									Priority
								</label>
								<div className="relative">
									<select
										{...register("priority")}
										className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium text-gray-900 appearance-none cursor-pointer"
									>
										{(Object.values(PriorityStatus) as string[]).map((p) => (
											<option key={p} value={p}>
												{p}
											</option>
										))}
									</select>
									<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
										▼
									</div>
								</div>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
									Estimate
								</label>
								<input
									{...register("estimationPoints")}
									type="number"
									min={0}
									className={`w-full px-3 py-2.5 bg-white border ${errors.estimationPoints
										? "border-red-500"
										: "border-gray-200"
										} rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400`}
								/>
							</div>

							{userStory && (
								<div className="space-y-1.5 col-span-2">
									<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
										Status
									</label>
									<div className="relative">
										<select
											{...register("status")}
											className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium text-gray-900 appearance-none cursor-pointer"
										>
											{(Object.values(UserStoryStatus) as string[]).map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
										<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
											▼
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Acceptance Criteria <span className="text-gray-400 font-normal lowercase">(one per line)</span>
							</label>
							<textarea
								{...register("acceptanceCriteriaText")}
								rows={3}
								placeholder="- Criteria 1..."
								className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm text-gray-900 placeholder:text-gray-400 resize-none font-mono text-xs"
							/>
						</div>
					</form>
				</div>

				{/* Footer */}
				<div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-xl shrink-0">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="user-story-form" // Connects to form id
						disabled={isLoading}
						className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-shadow shadow-sm disabled:opacity-50 flex items-center gap-2"
					>
						{isLoading && <Loader2 className="animate-spin" size={14} />}
						{userStory ? "Save Changes" : "Create Issue"}
					</button>
				</div>
			</div>
		</div>
	);
}
