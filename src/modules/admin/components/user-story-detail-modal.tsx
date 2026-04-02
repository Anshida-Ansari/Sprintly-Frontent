import {
	AlertCircle,
	CheckSquare,
	Edit3,
	Loader2,
	Plus,
	Save,
	Trash2,
	Users,
	Search,
	X,
	CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";

import { UserAuth } from "../../auth/store/store";
import { AttachmentButton } from "../../../shared/components/attachment-button";
import { SecureAttachmentLink } from "../../../shared/components/secure-attachment-link";
import { useGetMembers } from "../hooks/useGetmembers";
import { useGetProject } from "../hooks/useGetProject";
import {
	useAssignSubtask,
	useCreateSubtask,
	useDeleteSubtask,
	useGetSubtasks,
	useUpdateSubtaskStatus,
	useAddSubtaskComment,
} from "../hooks/useSubtasks";
import {
	useAssignUserStoryToMember,
	useUpdateUserStory,
	useAddComment,
} from "../hooks/useUserStories";
import { type ISubtask, type IUserStory, UserStoryStatus } from "../types/types";
import CommentSection from "./comment-section";
import DeleteConfirmationModal from "./delete-confirmation-modal";

interface UserStoryDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	story: IUserStory;
}

export default function UserStoryDetailModal({
	isOpen,
	onClose,
	story,
}: UserStoryDetailModalProps) {
	const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
	const [newSubtaskEstimatedHours, setNewSubtaskEstimatedHours] = useState<number | "">("");
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [editedDescription, setEditedDescription] = useState(story.description);
	const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
	const [assignSearchQuery, setAssignSearchQuery] = useState("");

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [subtaskToDelete, setSubtaskToDelete] = useState<string | null>(null);
	const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

	const user = UserAuth((state) => state.user);
	const addSubtaskComment = useAddSubtaskComment(story.id);
	const isAdmin = user?.role === "admin";
	const isLead = user?.role === "lead";
	const isAdminOrLead = isAdmin || isLead;

	const { data: projectRes } = useGetProject(story?.projectId);
	const project = projectRes?.data;

	const { data: subtasksRes, isLoading: loadingSubtasks } = useGetSubtasks(
		story.id,
	);
	const { data: membersRes } = useGetMembers({
		page: 1,
		limit: 100,
		search: "",
	});

	const createSubtask = useCreateSubtask(story.id);
	const updateStatus = useUpdateSubtaskStatus(story.id);
	const assignSubtask = useAssignSubtask(story.id);
	const deleteSubtask = useDeleteSubtask(story.id);
	const updateStory = useUpdateUserStory();
	const assignMember = useAssignUserStoryToMember();
	const addComment = useAddComment(story.id);

	const subtasks = subtasksRes?.data || [];
	const members = membersRes?.data || [];

	// Build a userId → name map so CommentSection can resolve old comments stored with only userId
	const membersMap: Record<string, string> = {};
	members.forEach((m: any) => {
		const id = m._id || m.id;
		if (id && m.name) membersMap[id] = m.name;
	});

	// Filter developers: Must be 'developer' role AND member of the project
	const projectMemberIds = (project?.members || []).map((pm: any) =>
		typeof pm === "string" ? pm : (pm.id || pm._id),
	);

	const developers = members.filter(
		(m: any) =>
			(m.role === "developers" || m.role === "developer") &&
			projectMemberIds.includes(m._id || m.id),
	);

	const completedCount = subtasks.filter(
		(s) => s.status === "Done",
	).length;
	const totalCount = subtasks.length;
	const progressPercent =
		totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	useEffect(() => {
		setEditedDescription(story.description);
	}, [story.description]);

	if (!isOpen) return null;

	const handleCreateSubtask = () => {
		if (newSubtaskTitle.trim()) {
			createSubtask.mutate(
				{ 
					title: newSubtaskTitle,
					estimatedHours: newSubtaskEstimatedHours === "" ? undefined : Number(newSubtaskEstimatedHours)
				},
				{
					onSuccess: () => {
						setNewSubtaskTitle("");
						setNewSubtaskEstimatedHours("");
					}
				},
			);
		}
	};

	const handleToggleSubtask = (subtask: ISubtask) => {
		const newStatus = subtask.status === "Done" ? "In pending" : "Done";
		updateStatus.mutate({ subtaskId: subtask.id, status: newStatus });
	};

	const handleAssignSubtask = (subtaskId: string, developerId: string) => {
		assignSubtask.mutate({ subtaskId, payload: { assignedTo: developerId } });
	};

	// ... existing logic

	const handleAssignMemberToStory = (memberId: string) => {
		assignMember.mutate(
			{
				projectId: story.projectId,
				userStoryId: story.id,
				developerId: memberId,
			},
			{
				onSuccess: () => {
					setIsAssignDropdownOpen(false);
					setAssignSearchQuery("");
				},
			},
		);
	};

	const handleRemoveMemberFromStory = () => {
		assignMember.mutate({
			projectId: story.projectId,
			userStoryId: story.id,
			developerId: "", // Empty string to unassign
		});
	};

	const handleSaveDescription = () => {
		updateStory.mutate(
			{
				projectId: story.projectId,
				userStoryId: story.id,
				data: { description: editedDescription },
			},
			{
				onSuccess: () => setIsEditingDescription(false),
			},
		);
	};

	const handleDeleteClick = (subtaskId: string) => {
		setSubtaskToDelete(subtaskId);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = () => {
		if (subtaskToDelete) {
			deleteSubtask.mutate(subtaskToDelete, {
				onSuccess: () => {
					setIsDeleteModalOpen(false);
					setSubtaskToDelete(null);
				},
			});
		}
	};
	
	const handleMarkAsDone = () => {
		updateStory.mutate({
			projectId: story.projectId,
			userStoryId: story.id,
			data: { status: UserStoryStatus.DONE },
		});
	};

	const getPriorityStyle = (priority: string) => {
		switch (priority) {
			case "High":
				return "bg-rose-50 text-rose-700 border-rose-200";
			case "Medium":
				return "bg-amber-50 text-amber-700 border-amber-200";
			default:
				return "bg-emerald-50 text-emerald-700 border-emerald-200";
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
			<div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
				{/* Header */}
				<div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
					<div className="flex-1 pr-4">
						<div className="flex items-center gap-3 mb-2">
							<h2 className="text-2xl font-black text-gray-900 leading-tight">
								{story.title}
							</h2>
							<span
								className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${getPriorityStyle(story.priority)}`}
							>
								{story.priority}
							</span>
						</div>
						<div className="flex items-center gap-4 text-sm">
							<span className="text-gray-500 font-bold">
								Status: <span className="text-gray-900">{story.status}</span>
							</span>
							<span className="text-gray-300">•</span>
							<span className="text-gray-500 font-bold">
								{completedCount}/{totalCount} subtasks completed
							</span>
							{isAdminOrLead && story.status === UserStoryStatus.IN_REVIEW && totalCount > 0 && completedCount === totalCount && (
								<button
									onClick={handleMarkAsDone}
									disabled={updateStory.isPending}
									className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-all text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
								>
									{updateStory.isPending ? (
										<Loader2 size={14} className="animate-spin" />
									) : (
										<CheckCircle2 size={14} strokeWidth={3} />
									)}
									Mark as Done
								</button>
							)}
							<span className="text-gray-300">•</span>
							<span className="text-gray-500 font-bold">
								Role:{" "}
								<span
									className={isAdmin ? "text-green-600" : "text-orange-600"}
								>
									{user?.role || "unknown"}
								</span>
							</span>
						</div>
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

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-8 space-y-8">
					{/* Description Section */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
								<AlertCircle size={16} className="text-indigo-500" />
								Description
							</h3>
							{isAdmin && !isEditingDescription && (
								<button
									onClick={() => setIsEditingDescription(true)}
									className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-indigo-600"
								>
									<Edit3 size={16} />
								</button>
							)}
						</div>
						{isEditingDescription ? (
							<div className="space-y-3">
								<textarea
									value={editedDescription}
									onChange={(e) => setEditedDescription(e.target.value)}
									className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-gray-900 min-h-[120px] resize-none"
									placeholder="Add a description..."
								/>
								<div className="flex gap-2">
									<button
										onClick={handleSaveDescription}
										disabled={updateStory.isPending}
										className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
									>
										<Save size={16} />
										Save
									</button>
									<button
										onClick={() => {
											setIsEditingDescription(false);
											setEditedDescription(story.description);
										}}
										className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<p className="text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl">
								{story.description || "No description provided."}
							</p>
						)}
					</div>

					{/* Estimation & Acceptance Criteria */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Estimation */}
						<div className="space-y-2">
							<h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
								Estimation
							</h3>
							<div className="flex items-center gap-2">
								<span className="text-3xl font-black text-indigo-600">
									{story.estimationPoints || 0}
								</span>
								<span className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">
									Points
								</span>
							</div>
						</div>

						{/* Acceptance Criteria */}
						<div className="space-y-3">
							<h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
								Acceptance Criteria
							</h3>
							{story.acceptanceCriteria && story.acceptanceCriteria.length > 0 ? (
								<ul className="space-y-2">
									{story.acceptanceCriteria.map((criteria: string, index: number) => (
										<li key={index} className="flex items-start gap-3 text-sm font-medium text-gray-600">
											<div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
											{criteria}
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-gray-400 italic">
									No criteria defined.
								</p>
							)}
						</div>
					</div>

					{/* Progress Bar */}
					{totalCount > 0 && (
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-600 font-bold">
									Overall Progress
								</span>
								<span className="text-gray-900 font-black">
									{Math.round(progressPercent)}%
								</span>
							</div>
							<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
									style={{ width: `${progressPercent}%` }}
								/>
							</div>
						</div>
					)}

					{/* Assignee Section (Single) */}
					<div className="space-y-4">
						<h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
							<Users size={16} className="text-indigo-500" />
							Assignee
						</h3>

						<div className="flex items-center gap-3">
							{story.assignedTo ? (
								(() => {
									const member = members.find((m: any) => m._id === story.assignedTo || m.id === story.assignedTo);
									return member ? (
										<div
											key={member._id}
											className="flex items-center gap-2 pr-2 pl-1 py-1 bg-white border border-gray-200 rounded-full shadow-sm hover:border-indigo-200 transition-colors group/member"
										>
											<div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-[10px] font-black text-indigo-700 uppercase border border-white">
												{member.name?.substring(0, 2)}
											</div>
											<span className="text-xs font-bold text-gray-700">
												{member.name}
											</span>
											{(isAdmin || user?.role === "lead") && (
												<button
													onClick={() => handleRemoveMemberFromStory()}
													className="p-0.5 hover:bg-rose-50 text-gray-300 hover:text-rose-500 rounded-full transition-colors ml-1"
													title="Unassign"
												>
													<X size={12} strokeWidth={3} />
												</button>
											)}
										</div>
									) : (
										<span className="text-xs text-red-400">
											Assigned member not found
										</span>
									);
								})()
							) : (
								<p className="text-xs text-gray-400 font-medium italic">Unassigned</p>
							)}

							{/* Assign/Reassign Button & Dropdown */}
							{(isAdmin || user?.role === "lead") && (
								<div className="relative">
									<button
										onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
										className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
										title={story.assignedTo ? "Change Assignee" : "Assign Member"}
									>
										{story.assignedTo ? (
											<Edit3 size={14} strokeWidth={2.5} />
										) : (
											<Plus size={16} strokeWidth={3} />
										)}
									</button>

									{isAssignDropdownOpen && (
										<>
											<div
												className="fixed inset-0 z-10"
												onClick={() => setIsAssignDropdownOpen(false)}
											/>
											<div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
												<div className="relative mb-2">
													<Search
														size={14}
														className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
													/>
													<input
														type="text"
														value={assignSearchQuery}
														onChange={(e) => setAssignSearchQuery(e.target.value)}
														placeholder="Search members..."
														autoFocus
														className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-lg text-xs font-bold text-gray-900 placeholder:text-gray-400 outline-none transition-all"
													/>
												</div>
												<div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
													{developers
														.filter(
															(d: any) =>
																d._id !== story.assignedTo &&
																d.name
																	.toLowerCase()
																	.includes(assignSearchQuery.toLowerCase()),
														)
														.map((dev: any) => (
															<button
																key={dev._id}
																onClick={() => handleAssignMemberToStory(dev._id)}
																className="w-full flex items-center gap-3 p-2 hover:bg-indigo-50 rounded-lg transition-colors group/option text-left"
															>
																<div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover/option:bg-indigo-100 group-hover/option:text-indigo-600 transition-colors">
																	{dev.name?.substring(0, 2)}
																</div>
																<span className="text-sm font-medium text-gray-600 group-hover/option:text-gray-900 truncate">
																	{dev.name}
																</span>
															</button>
														))}
													{developers.filter(
														(d: any) =>
															d._id !== story.assignedTo &&
															d.name
																.toLowerCase()
																.includes(assignSearchQuery.toLowerCase()),
													).length === 0 && (
															<div className="p-3 text-center text-xs text-gray-400 font-medium italic">
																No members found
															</div>
														)}
												</div>
											</div>
										</>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Subtasks Section */}
					<div className="space-y-4">
						<h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
							<CheckSquare size={16} className="text-indigo-500" />
							Subtasks ({totalCount})
						</h3>

						{loadingSubtasks ? (
							<div className="flex justify-center py-8">
								<Loader2 className="animate-spin text-indigo-600" size={24} />
							</div>
						) : (
							<div className="space-y-3">
								{subtasks.map((subtask) => {
									const assignedDev = developers.find(
										(d: any) => d._id === subtask.assignedTo,
									);

									return (
										<div key={subtask.id} className="flex flex-col gap-2">
											<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all group border border-transparent hover:border-gray-200">
											{/* Status: Checkbox for Developer, Badge for Admin */}
											{isAdmin ? (
												<div
													className={`
                                                    px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border
                                                    ${subtask.status ===
															"Done"
															? "bg-emerald-50 text-emerald-600 border-emerald-100"
															: "bg-gray-200 text-gray-600 border-gray-300"
														}
                                                `}
												>
													{subtask.status === "Done" ? "DONE" : "TODO"}
												</div>
											) : (
												<input
													type="checkbox"
													checked={subtask.status === "Done"}
													onChange={() => handleToggleSubtask(subtask)}
													className="w-5 h-5 rounded-md border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
												/>
											)}

											<div className="flex-1 min-w-0 flex flex-col gap-2">
												<p
													className={`font-bold text-sm ${subtask.status === "Done" ? "line-through text-gray-400" : "text-gray-900"}`}
												>
													{subtask.title}
												</p>

												{/* Assignment UI */}
												<div className="flex items-center gap-2">
													{assignedDev ? (
														<div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
															<div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-[9px] font-black text-indigo-600 uppercase">
																{assignedDev.name?.slice(0, 2)}
															</div>
															<span className="text-xs font-bold text-gray-700">
																{assignedDev.name}
															</span>
															{isAdmin && (
																<button
																	onClick={() =>
																		handleAssignSubtask(subtask.id, "")
																	}
																	className="ml-1 p-0.5 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded transition-colors"
																	title="Unassign"
																>
																	<X size={12} />
																</button>
															)}
														</div>
													) : isAdmin ? (
														<select
															value=""
															onChange={(e) =>
																handleAssignSubtask(subtask.id, e.target.value)
															}
															className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-lg font-bold text-gray-500 hover:border-indigo-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
														>
															<option value="" disabled>
																Assign Member
															</option>
															{developers.map((dev: any) => (
																<option key={dev._id} value={dev._id}>
																	{dev.name}
																</option>
															))}
														</select>
													) : (
														<span className="text-xs font-medium text-gray-400 italic">
															Unassigned
														</span>
													)}

													{/* Time Tracking Badges */}
													{(subtask.estimatedHours !== undefined || subtask.actualHours !== undefined) && (
														<div className="flex gap-2 ml-auto">
															{subtask.estimatedHours !== undefined && (
																<span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
																	Est: {subtask.estimatedHours}h
																</span>
															)}
															{subtask.actualHours !== undefined && (
																<span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium border border-blue-100">
																	Act: {subtask.actualHours}h
																</span>
															)}
														</div>
													)}
													<button
														onClick={() => setExpandedComments(prev => ({ ...prev, [subtask.id]: !prev[subtask.id] }))}
														className="ml-2 text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-wider"
													>
														Comments ({subtask.comments?.length || 0})
													</button>
                                                    <AttachmentButton subtaskId={subtask.id} userStoryId={story.id} variant="icon" />
												</div>
                                                
                                                {/* Attachments List */}
                                                {(subtask as any).attachments && (subtask as any).attachments.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {(subtask as any).attachments.map((att: any, idx: number) => (
                                                            <SecureAttachmentLink 
                                                                key={idx} 
                                                                fileUrl={att.fileUrl} 
                                                                fileName={att.fileName} 
                                                            />
                                                        ))}
                                                    </div>
                                                )}
											</div>

											{/* Delete Button (Admin Only) */}
											{isAdmin && (
												<button
													onClick={() => handleDeleteClick(subtask.id)}
													className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-50 rounded-xl transition-all text-gray-400 hover:text-rose-600"
													title="Delete Subtask"
												>
													<Trash2 size={16} />
												</button>
											)}
										</div>
										{expandedComments[subtask.id] && (
											<div className="pl-12 pr-4 pb-2">
												<CommentSection
													initialComments={subtask.comments || []}
													currentUserName={user?.name}
													membersMap={membersMap}
													onSubmit={(message, onSuccess) => {
														addSubtaskComment.mutate(
															{ subtaskId: subtask.id, message },
															{ onSuccess }
														);
													}}
													isPending={addSubtaskComment.isPending}
													isError={addSubtaskComment.isError}
													error={addSubtaskComment.error}
												/>
											</div>
										)}
									</div>
								);
							})}

								{subtasks.length === 0 && (
									<div className="text-center py-8 text-gray-400 font-bold text-sm">
										No subtasks yet. Add one below!
									</div>
								)}
							</div>
						)}

						{/* Add Subtask (Developers Only) */}
						{user?.role === "developers" && (
							<div className="flex gap-2 pt-2">
								<input
									type="text"
									value={newSubtaskTitle}
									onChange={(e) => setNewSubtaskTitle(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && handleCreateSubtask()}
									placeholder="Add a new subtask..."
									className="flex-1 px-5 py-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400"
								/>
								<input
									type="number"
									min="0"
									step="0.5"
									value={newSubtaskEstimatedHours}
									onChange={(e) => setNewSubtaskEstimatedHours(e.target.value ? Number(e.target.value) : "")}
									placeholder="Est. Hours"
									className="w-28 px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400"
								/>
								<button
									onClick={handleCreateSubtask}
									disabled={!newSubtaskTitle.trim() || createSubtask.isPending}
									className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
								>
									<Plus size={18} />
									Add
								</button>
							</div>
						)}
					</div>

					{/* Comments Section */}
					<CommentSection
						initialComments={story.comments || []}
						currentUserName={user?.name}
						membersMap={membersMap}
						onSubmit={(message, onSuccess) => {
							addComment.mutate({ message }, { onSuccess });
						}}
						isPending={addComment.isPending}
						isError={addComment.isError}
						error={addComment.error}
					/>
				</div>
			</div>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleConfirmDelete}
				title="Delete Subtask"
				message="Are you sure you want to remove this subtask? This action cannot be undone."
				isLoading={deleteSubtask.isPending}
			/>
		</div>
	);
}
