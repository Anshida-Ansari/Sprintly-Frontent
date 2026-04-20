import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { subtaskService } from "../services/subtask.service.tsx";
import type {
	AssignSubtaskPayload,
	CreateSubtaskPayload,
	SubtaskStatus,
} from "../types/types";

export const useGetSubtasks = (userStoryId: string) => {
	return useQuery({
		queryKey: ["subtasks", userStoryId],
		queryFn: () => subtaskService.getSubtasks(userStoryId),
		enabled: !!userStoryId,
	});
};

export const useCreateSubtask = (userStoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateSubtaskPayload) =>
			subtaskService.createSubtask(userStoryId, payload),
		onSuccess: (res: any) => {
			queryClient.invalidateQueries({ queryKey: ["subtasks", userStoryId] });
			toast.success(res.message || "Subtask created successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create subtask");
		},
	});
};

export const useUpdateSubtaskStatus = (userStoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			subtaskId,
			status,
		}: {
			subtaskId: string;
			status: SubtaskStatus;
		}) => subtaskService.updateSubtaskStatus(subtaskId, status),
		onSuccess: (res: any) => {
			queryClient.invalidateQueries({ queryKey: ["subtasks", userStoryId] });
			toast.success(res.message || "Subtask status updated");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to update subtask status",
			);
		},
	});
};

export const useUpdateSubtaskTime = (userStoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			subtaskId,
			payload,
		}: {
			subtaskId: string;
			payload: { estimatedHours?: number; actualHours?: number };
		}) => subtaskService.updateSubtaskTime(subtaskId, payload),
		onSuccess: (res: any) => {
			queryClient.invalidateQueries({ queryKey: ["subtasks", userStoryId] });
			toast.success(res.message || "Subtask time updated");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to update subtask time",
			);
		},
	});
};

export const useAssignSubtask = (userStoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			subtaskId,
			payload,
		}: {
			subtaskId: string;
			payload: AssignSubtaskPayload;
		}) => subtaskService.assignSubtask(subtaskId, payload),
		onSuccess: (res: any) => {
			queryClient.invalidateQueries({ queryKey: ["subtasks", userStoryId] });
			toast.success(res.message || "Subtask assigned successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to assign subtask");
		},
	});
};

export const useDeleteSubtask = (userStoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (subtaskId: string) => subtaskService.deleteSubtask(subtaskId),
		onSuccess: (res: any) => {
			queryClient.invalidateQueries({ queryKey: ["subtasks", userStoryId] });
			toast.success(res.message || "Subtask deleted successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to delete subtask");
		},
	});
};

export const useAddSubtaskComment = (userStoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			subtaskId,
			message,
		}: {
			subtaskId: string;
			message: string;
		}) => subtaskService.addSubtaskComment(subtaskId, { message }),
		onSuccess: (res: any) => {
			queryClient.invalidateQueries({ queryKey: ["subtasks", userStoryId] });
			queryClient.invalidateQueries({ queryKey: ["active-sprint-stories"] });
			queryClient.invalidateQueries({ queryKey: ["my-user-stories"] });
			toast.success(res.message || "Comment added successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to post comment");
		},
	});
};
