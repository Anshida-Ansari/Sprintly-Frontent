import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Edit2,
	Eye,
	Flag,
	PlayCircle,
	Plus,
	Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import {
	useCreateUserStory,
	useGetUserStories,
	useUpdateUserStory,
} from "../hooks/useUserStories";
import {
	type IMember,
	type IUserStory,
	PriorityStatus,
	UserStoryStatus,
} from "../types/types";
import UserStoryDetailModal from "./user-story-detail-modal";
import UserStoryModal from "./user-story-modal";

interface UserStoryListProps {
	projectId: string;
	showHeader?: boolean;
	members?: IMember[];
}

export default function UserStoryList({
	projectId,
	showHeader = true,
	members = [],
}: UserStoryListProps) {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [page, setPage] = useState(1);
	const limit = 10; // Increased limit for list view
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStory, setSelectedStory] = useState<IUserStory | undefined>();

	// Detail Modal State
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [selectedDetailStory, setSelectedDetailStory] = useState<
		IUserStory | undefined
	>();

	const { data: userStoriesRes, isLoading } = useGetUserStories(projectId, {
		search: debouncedSearch,
		status: statusFilter || undefined,
		page,
		limit,
	});

	// Sync selectedDetailStory with fresh data from the list
	useEffect(() => {
		if (selectedDetailStory && userStoriesRes?.data) {
			const updatedStory = userStoriesRes.data.find(
				(s: IUserStory) => s.id === selectedDetailStory.id,
			);
			if (updatedStory) {
				setSelectedDetailStory(updatedStory);
			}
		}
	}, [userStoriesRes, selectedDetailStory?.id]);

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, statusFilter]);

	const { mutate: createStory, isPending: isCreating } = useCreateUserStory();
	const { mutate: updateStory, isPending: isUpdating } = useUpdateUserStory();

	const handleOpenCreateModal = () => {
		setSelectedStory(undefined);
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (e: React.MouseEvent, story: IUserStory) => {
		e.stopPropagation();
		setSelectedStory(story);
		setIsModalOpen(true);
	};

	const handleOpenDetailModal = (story: IUserStory) => {
		setSelectedDetailStory(story);
		setIsDetailModalOpen(true);
	};

	const handleSubmit = (data: any) => {
		if (selectedStory) {
			updateStory(
				{
					projectId,
					userStoryId: selectedStory.id,
					data,
				},
				{
					onSuccess: () => setIsModalOpen(false),
				},
			);
		} else {
			createStory(
				{
					projectId,
					data,
				},
				{
					onSuccess: () => setIsModalOpen(false),
				},
			);
		}
	};

	const priorityColors = {
		[PriorityStatus.LOW]: "text-emerald-500 bg-emerald-50",
		[PriorityStatus.MEDIUM]: "text-amber-500 bg-amber-50",
		[PriorityStatus.HIGH]: "text-rose-500 bg-rose-50",
	};

	const statusIcons = {
		[UserStoryStatus.IN_PENDING]: <Clock size={16} className="text-gray-400" />,
		[UserStoryStatus.IN_PROGRESS]: (
			<PlayCircle size={16} className="text-blue-500" />
		),
		[UserStoryStatus.IN_REVIEW]: <Flag size={16} className="text-purple-500" />,
		[UserStoryStatus.DONE]: (
			<CheckCircle2 size={16} className="text-emerald-500" />
		),
	};

	const totalPages = userStoriesRes
		? Math.ceil(userStoriesRes.total / limit)
		: 0;

	// Helper to get assignee details
	const getAssigneeDetails = (assigneeIds?: string[]) => {
		if (!assigneeIds || assigneeIds.length === 0) return null;
		// Return only the first assignee for the list view to keep it clean
		const member = members.find(m => m.id === assigneeIds[0] || m._id === assigneeIds[0]);
		return member;
	};

	return (
		<div className="space-y-4">
			{/* Header Actions */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
				<div className="relative flex-1 w-full md:max-w-md">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						size={16}
					/>
					<input
						type="text"
						placeholder="Filter issues..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-9 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 placeholder:text-gray-400"
					/>
				</div>

				<div className="flex items-center gap-2 w-full md:w-auto px-2">
					<div className="h-4 w-px bg-gray-200 mx-1 hidden md:block"></div>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="bg-transparent text-sm font-medium text-gray-600 border-none focus:ring-0 cursor-pointer hover:text-gray-900"
					>
						<option value="">All Statuses</option>
						{(Object.values(UserStoryStatus) as string[]).map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
					<button
						onClick={handleOpenCreateModal}
						className="ml-auto md:ml-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
					>
						<Plus size={14} strokeWidth={3} />
						New Issue
					</button>
				</div>
			</div>

			{/* List View */}
			<div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
				{isLoading ? (
					<div className="flex items-center justify-center h-64">
						<div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
					</div>
				) : userStoriesRes?.data && userStoriesRes.data.length > 0 ? (
					<div className="grid grid-cols-1 gap-4">
						{userStoriesRes.data.map((story) => (
							<div
								key={story.id}
								onClick={() => handleOpenDetailModal(story)}
								className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group relative overflow-hidden cursor-pointer"
							>
								<div className="flex items-start justify-between gap-4 relative z-10">
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<span
												className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${priorityColors[story.priority]}`}
											>
												{story.priority} Priority
											</span>
											<div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
												{statusIcons[story.status]}
												<span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
													{story.status}
												</span>
											</div>
										</div>

										<h4 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
											{story.title}
										</h4>

										<p className="text-gray-500 text-sm font-medium line-clamp-2 max-w-2xl leading-relaxed">
											{story.description}
										</p>

										{/* Assignees (New) */}
										{story.assignedTo && story.assignedTo.length > 0 && (
											<div className="flex items-center gap-2 pt-1">
												<div className="flex -space-x-2">
													{story.assignedTo.slice(0, 3).map((assigneeId, idx) => {
														const member = members.find(m => m.id === assigneeId || m._id === assigneeId);
														return member ? (
															<img
																key={idx}
																src={`https://ui-avatars.com/api/?name=${member.name}&background=random&color=fff&size=32`}
																alt={member.name}
																className="w-6 h-6 rounded-full ring-2 ring-white"
																title={member.name}
															/>
														) : null;
													})}
												</div>
												{story.assignedTo.length > 3 && (
													<span className="text-xs text-gray-400 font-medium">+{story.assignedTo.length - 3}</span>
												)}
											</div>
										)}
									</div>

									<div className="flex gap-2">
										<button
											onClick={(e) => handleOpenEditModal(e, story)}
											className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm bg-white border border-gray-100"
										>
											<Edit2 size={20} />
										</button>
										<div className="p-3 text-gray-300 group-hover:text-indigo-600 rounded-2xl transition-all">
											<Eye size={20} />
										</div>
									</div>
								</div>

								{/* Decorative background element */}
								<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50/40 transition-colors"></div>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-20 bg-white">
						<div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
							<Search className="text-gray-300" size={20} />
						</div>
						<h4 className="text-gray-900 font-medium text-sm mb-1">No issues found</h4>
						<button
							onClick={handleOpenCreateModal}
							className="mt-2 text-indigo-600 text-xs font-semibold hover:underline"
						>
							Create Issue
						</button>
					</div>
				)}
			</div>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between px-2">
					<p className="text-xs text-gray-500 font-medium">
						Showing page {page} of {totalPages}
					</p>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							className="p-1.5 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-500"
						>
							<ChevronLeft size={16} />
						</button>
						<button
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
							className="p-1.5 text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-500"
						>
							<ChevronRight size={16} />
						</button>
					</div>
				</div>
			)}

			<UserStoryModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleSubmit}
				userStory={selectedStory}
				isLoading={isCreating || isUpdating}
			/>

			{selectedDetailStory && (
				<UserStoryDetailModal
					isOpen={isDetailModalOpen}
					onClose={() => setIsDetailModalOpen(false)}
					story={selectedDetailStory}
				/>
			)}
		</div>
	);
}
