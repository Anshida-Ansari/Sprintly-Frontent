import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarIcon, GripVertical } from "lucide-react";
import { AttachmentButton } from "../../../shared/components/attachment-button";
import { SecureAttachmentLink } from "../../../shared/components/secure-attachment-link";
import { UserAuth } from "../../auth/store/store";

interface SubTask {
	_id: string;
	title: string;
	status: string;
	assignedTo: string;
	estimatedHours?: number;
	actualHours?: number;
	attachments?: Array<{ fileUrl: string; fileName: string }>;
}

interface UserStory {
	id: string;
	title: string;
	description: string;
	priority: string;
	createdAt: string;
	subtasks?: SubTask[];
	assignedTo?: string | string[];
	status: string;
}

interface TaskCardProps {
	task: UserStory;
	onSubtaskUpdate: (subtaskId: string, status: string) => void;
	onSubtaskTimeUpdate?: (subtaskId: string, actualHours: number) => void;
}

export function TaskCard({
	task,
	onSubtaskUpdate,
	onSubtaskTimeUpdate,
}: TaskCardProps) {
	const user = UserAuth((state) => state.user);

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const myId = user?.id;

	const getPriorityColor = (priority: string) => {
		switch (priority?.toLowerCase()) {
			case "high":
				return "bg-rose-500/10 text-rose-400 border-rose-500/20";
			case "medium":
				return "bg-amber-500/10 text-amber-400 border-amber-500/20";
			case "low":
				return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
			default:
				return "bg-gray-500/10 text-gray-400 border-gray-500/20";
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="mb-3 bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all group"
		>
			<div className="flex items-start justify-between mb-2">
				<div className="flex items-start gap-3 w-full">
					{/* Drag Handle */}
					<div
						{...attributes}
						{...listeners}
						className="mt-1 cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400"
					>
						<GripVertical size={16} />
					</div>
					<div className="flex-1 min-w-0">
						<h4 className="font-bold text-sm text-white leading-snug mb-2 truncate">
							{task.title}
						</h4>
						<div className="flex items-center gap-2 mt-1">
							<span
								className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getPriorityColor(task.priority)}`}
							>
								{task.priority || "Medium"}
							</span>
							{task.createdAt && (
								<div className="flex items-center text-[10px] text-gray-500 font-mono">
									<CalendarIcon size={10} className="mr-1" />
									{new Date(task.createdAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Subtasks Section */}
			<div className="mt-4 space-y-2">
				<p className="text-[10px] font-black text-gray-600 uppercase tracking-wider mb-2">
					Subtasks
				</p>
				{task.subtasks && task.subtasks.length > 0 ? (
					task.subtasks.map((subtask) => {
						const isAssignedToMe =
							subtask.assignedTo === myId ||
							(Array.isArray(task.assignedTo)
								? task.assignedTo.includes(myId || "")
								: task.assignedTo === myId);

						return (
							<div
								key={subtask._id}
								className="flex flex-col bg-black/20 p-2 rounded-lg border border-white/5"
							>
								<div className="flex items-center justify-between w-full">
									<span className="truncate flex-1 font-medium text-xs text-gray-300 mr-2">
										{subtask.title}
									</span>

									<div className="flex items-center gap-2">
										{subtask.estimatedHours !== undefined && (
											<span
												className="text-[9px] text-gray-400 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10"
												title="Estimated Hours"
											>
												E: {subtask.estimatedHours}h
											</span>
										)}

										{isAssignedToMe ? (
											<>
												<input
													type="number"
													min="0"
													step="0.5"
													className="w-12 h-6 text-[10px] px-1 bg-white/[0.05] border border-white/10 rounded text-gray-300 focus:outline-none focus:border-indigo-500 text-center placeholder:text-gray-600 font-mono"
													title="Actual Hours"
													placeholder="A: 0h"
													defaultValue={subtask.actualHours || ""}
													onBlur={(e) => {
														if (e.target.value !== "" && onSubtaskTimeUpdate) {
															const newVal = Number(e.target.value);
															if (newVal !== subtask.actualHours) {
																onSubtaskTimeUpdate(subtask._id, newVal);
															}
														}
													}}
												/>
												<select
													value={subtask.status}
													onChange={(e) =>
														onSubtaskUpdate(subtask._id, e.target.value)
													}
													className="h-6 text-[10px] px-1 bg-white/[0.05] border border-white/10 rounded text-gray-300 focus:outline-none focus:border-indigo-500"
												>
													<option value="pending" className="bg-gray-900">
														Pending
													</option>
													<option value="in-progress" className="bg-gray-900">
														In Progress
													</option>
													<option value="completed" className="bg-gray-900">
														Completed
													</option>
												</select>
											</>
										) : (
											<>
												{subtask.actualHours !== undefined && (
													<span
														className="text-[9px] text-indigo-300 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20"
														title="Actual Hours"
													>
														A: {subtask.actualHours}h
													</span>
												)}
												<span className="text-[10px] font-medium text-gray-500 bg-white/[0.05] px-2 py-0.5 rounded capitalize">
													{subtask.status}
												</span>
											</>
										)}
										{/* Upload Button */}
										<AttachmentButton
											subtaskId={subtask._id}
											userStoryId={task.id}
											variant="icon"
										/>
									</div>
								</div>

								{/* Render Attachment Links using Secure Links */}
								{subtask.attachments && subtask.attachments.length > 0 && (
									<div className="flex flex-wrap gap-1.5 mt-2 overflow-x-auto pb-1 hide-scrollbar">
										{subtask.attachments.map((att, idx) => (
											<SecureAttachmentLink
												key={idx}
												fileUrl={att.fileUrl}
												fileName={att.fileName}
											/>
										))}
									</div>
								)}
							</div>
						);
					})
				) : (
					<p className="text-[10px] text-gray-600 italic">No subtasks</p>
				)}
			</div>
		</div>
	);
}
