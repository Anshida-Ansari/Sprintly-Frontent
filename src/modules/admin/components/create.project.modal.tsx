import { Calendar, FileText, GitBranch, Github, Type, User, X } from "lucide-react";
import { useGetMembers } from "../hooks/useGetmembers";
import { useState } from "react";
import type { CreateProjectPayload } from "../types/types";
import { useGitHubStatus } from "../hooks/useGitHubStatus";

interface CreateProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CreateProjectPayload) => void;
	isLoading?: boolean;
}

export default function CreateProjectModal({
	isOpen,
	onClose,
	onSubmit,
	isLoading = false,
}: CreateProjectModalProps) {
	const [formData, setFormData] = useState<CreateProjectPayload>({
		name: "",
		description: "",
		startDate: "",
		endDate: "",
		gitRepoUrl: "",
		leadId: "",
	});

	const { data: membersData } = useGetMembers({
		page: 1,
		limit: 100,
	});

	const { data: githubStatus } = useGitHubStatus();
	const isGitHubConnected = githubStatus?.isConnected || false;

	const potentialLeads =
		membersData?.data?.filter(
			(m: any) => m.role === "lead" || m.role === "admin",
		) || [];

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.startDate || !formData.endDate) return;
		onSubmit(formData);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Overlay */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>

			{/* Modal Card */}
			<div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
				<div className="p-8 flex-1 overflow-y-auto">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								Create New Project
							</h2>
							<p className="text-gray-500 text-sm mt-1">
								Initialize a new workspace for your team.
							</p>
						</div>
						<button
							onClick={onClose}
							className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
							disabled={isLoading}
						>
							<X size={20} className="text-gray-500" />
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
								<Type size={16} className="text-indigo-500" /> Project Name
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
								placeholder="e.g. Website Redesign"
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50/50"
								disabled={isLoading}
							/>
						</div>

						<div>
							<label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
								<FileText size={16} className="text-indigo-500" /> Description
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								required
								placeholder="Briefly describe the goals..."
								rows={3}
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50/50 resize-none"
								disabled={isLoading}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
									<Calendar size={16} className="text-emerald-500" /> Start Date
								</label>
								<input
									type="date"
									name="startDate"
									value={formData.startDate.toString()}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50/50"
									disabled={isLoading}
								/>
							</div>
							<div>
								<label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
									<Calendar size={16} className="text-rose-500" /> End Date
								</label>
								<input
									type="date"
									name="endDate"
									value={formData.endDate.toString()}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition bg-gray-50/50"
									disabled={isLoading}
								/>
							</div>
						</div>

						{/* GitHub Integration */}
						{isGitHubConnected ? (
							<div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
								<div className="flex items-start gap-3">
									<div className="p-2 bg-white rounded-lg shadow-sm">
										<Github size={20} className="text-purple-600" />
									</div>
									<div className="flex-1">
										<h4 className="font-bold text-gray-900 mb-1">
											GitHub Repository Auto-Creation
										</h4>
										<p className="text-sm text-gray-600">
											A private repository will be automatically created as <span className="font-mono bg-white px-2 py-0.5 rounded border border-purple-200">{formData.name.toLowerCase().replace(/\s+/g, '-')}</span>
										</p>
										<p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
											<span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
											Connected as @{githubStatus?.githubUsername}
										</p>
									</div>
								</div>
							</div>
						) : (
							<div>
								<label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
									<GitBranch size={16} className="text-gray-500" /> Git Repository
									(Optional)
								</label>
								<input
									type="url"
									name="gitRepoUrl"
									value={formData.gitRepoUrl}
									onChange={handleChange}
									placeholder="https://github.com/org/repo"
									className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition bg-gray-50/50"
									disabled={isLoading}
								/>
								<p className="text-xs text-gray-500 mt-2">
									💡 Connect GitHub in Settings to auto-create repositories
								</p>
							</div>
						)}

						<div>
							<label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
								<User size={16} className="text-indigo-500" /> Assign Lead
								(Optional)
							</label>
							<select
								name="leadId"
								value={formData.leadId || ""}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, leadId: e.target.value }))
								}
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50/50"
								disabled={isLoading}
							>
								<option value="">Select a Lead</option>
								{potentialLeads.map((lead: any) => (
									<option key={lead.id} value={lead.id}>
										{lead.name} ({lead.role})
									</option>
								))}
							</select>
						</div>

						{/* Footer Buttons */}
						<div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
							<button
								type="button"
								onClick={onClose}
								disabled={isLoading}
								className="flex-1 px-5 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isLoading || !formData.name}
								className="flex-1 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
							>
								{isLoading ? (
									<>
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Creating...
									</>
								) : (
									"Create Project"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
