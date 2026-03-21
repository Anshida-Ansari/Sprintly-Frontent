import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CheckCircle2, Clock, Zap } from "lucide-react";
import { useState } from "react";
import { TaskCard } from "./task.card";

interface KanbanBoardProps {
	tasks: any[];
	onTaskMove: (taskId: string, newStatus: string) => void;
	onSubtaskUpdate: (subtaskId: string, status: string) => void;
	onSubtaskTimeUpdate?: (subtaskId: string, actualHours: number) => void;
}

const COLUMNS = [
	{ id: "Pending", title: "Pending", icon: Clock, color: "gray" },
	{ id: "In Progress", title: "In Progress", icon: Zap, color: "indigo" },
	{ id: "Done", title: "Done", icon: CheckCircle2, color: "emerald" },
];

export function KanbanBoard({
	tasks,
	onTaskMove,
	onSubtaskUpdate,
	onSubtaskTimeUpdate,
}: KanbanBoardProps) {
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const getTasksByStatus = (status: string) => {
		const normalizedStatus = status.toLowerCase().replace(" ", "-");
		return tasks.filter((task) => {
			const taskStatus = (task.status || "pending")
				.toLowerCase()
				.replace(" ", "-");

			// Map common variances
			if (normalizedStatus === "pending" && taskStatus === "to-do") return true;

			return taskStatus === normalizedStatus;
		});
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) {
			setActiveId(null);
			return;
		}

		const activeId = active.id;
		const overId = over.id as string;

		const isColumn = COLUMNS.some((col) => col.id === overId);
		let newStatus = overId;

		if (!isColumn) {
			const overTask = tasks.find((t) => t.id === overId);
			if (overTask) {
				newStatus = overTask.status;
			}
		}

		const mapColumnToStatus = (colId: string) => {
			switch (colId) {
				case "Pending":
					return "Pending";
				case "In Progress":
					return "In Progress";
				case "Done":
					return "Done";
				default:
					return colId;
			}
		};

		const backendStatus = mapColumnToStatus(newStatus);
		const activeTask = tasks.find((t) => t.id === activeId);
		const currentStatus = (activeTask?.status || "")
			.toLowerCase()
			.replace(" ", "-");
		const targetJsonStatus = backendStatus.toLowerCase().replace(" ", "-");

		if (currentStatus !== targetJsonStatus) {
			onTaskMove(activeId as string, backendStatus);
		}

		setActiveId(null);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="flex h-full gap-6 overflow-x-auto pb-4">
				{COLUMNS.map((col) => {
					const Icon = col.icon;
					const stories = getTasksByStatus(col.id);

					return (
						<div
							key={col.id}
							className="flex-shrink-0 w-80 rounded-[32px] border border-white/[0.05] bg-white/[0.02] flex flex-col min-h-[500px]"
						>
							<div className="p-6 border-b border-white/[0.05] flex items-center gap-3">
								<div
									className={`p-2 rounded-xl bg-${col.color}-500/10 border border-${col.color}-500/20`}
								>
									<Icon size={18} className={`text-${col.color}-400`} />
								</div>
								<div>
									<h3 className="font-black text-white text-lg">{col.title}</h3>
									<span className="text-xs text-gray-500 font-bold">
										{stories.length} tasks
									</span>
								</div>
							</div>

							<SortableContext
								id={col.id}
								items={stories.map((t) => t.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="flex-1 p-4 overflow-y-auto space-y-3">
									{stories.map((task) => (
										<TaskCard
											key={task.id}
											task={task}
											onSubtaskUpdate={onSubtaskUpdate}
											onSubtaskTimeUpdate={onSubtaskTimeUpdate}
										/>
									))}
									{stories.length === 0 && (
										<div className="py-10 text-center">
											<p className="text-xs font-bold text-gray-600">
												No tasks
											</p>
										</div>
									)}
								</div>
							</SortableContext>
						</div>
					);
				})}
			</div>

			<DragOverlay>
				{activeId ? (
					<div className="opacity-80 w-80">
						<div className="bg-[#16161A] p-4 rounded-2xl border border-indigo-500 shadow-xl">
							<p className="text-white font-bold">Moving task...</p>
						</div>
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
