import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
	type IUserStory,
	PriorityStatus,
	UserStoryStatus,
} from "../types/types";

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
	const [formData, setFormData] = useState<{
		title: string;
		description: string;
		priority: PriorityStatus;
		status: UserStoryStatus;
	}>({
		title: "",
		description: "",
		priority: PriorityStatus.MEDIUM,
		status: UserStoryStatus.IN_PENDING,
	});

	useEffect(() => {
		if (userStory) {
			setFormData({
				title: userStory.title,
				description: userStory.description,
				priority: userStory.priority,
				status: userStory.status,
			});
		} else {
			setFormData({
				title: "",
				description: "",
				priority: PriorityStatus.MEDIUM,
				status: UserStoryStatus.IN_PENDING,
			});
		}
	}, [userStory, isOpen]);

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
				<div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
					<h2 className="text-2xl font-black text-gray-900 tracking-tight">
						{userStory ? "Edit User Story" : "Create User Story"}
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-200 rounded-full transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-8 space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
							Title
						</label>
						<input
							required
							minLength={3}
							maxLength={100}
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold text-gray-700"
							placeholder="User story title..."
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
							Description
						</label>
						<textarea
							required
							minLength={5}
							maxLength={500}
							rows={4}
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-gray-700 resize-none"
							placeholder="Detailed description of the user story..."
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
								Priority
							</label>
							<select
								value={formData.priority}
								onChange={(e) =>
									setFormData({
										...formData,
										priority: e.target.value as PriorityStatus,
									})
								}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold text-gray-700 bg-white"
							>
								{(Object.values(PriorityStatus) as string[]).map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</select>
						</div>

						{userStory && (
							<div className="space-y-2">
								<label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
									Status
								</label>
								<select
									value={formData.status}
									onChange={(e) =>
										setFormData({
											...formData,
											status: e.target.value as UserStoryStatus,
										})
									}
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold text-gray-700 bg-white"
								>
									{(Object.values(UserStoryStatus) as string[]).map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
							</div>
						)}
					</div>

					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm"
						>
							Cancel
						</button>
						<button
							disabled={isLoading}
							type="submit"
							className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<Loader2 className="animate-spin" size={20} />
							) : userStory ? (
								"Update Story"
							) : (
								"Create Story"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
