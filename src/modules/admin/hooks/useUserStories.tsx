import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userStoryService } from "../services/userstory.service";
import type {
	AddCommentPayload,
	CreateUserStoryPayload,
	EditUserStoryPayload,
} from "../types/types";

export const useGetUserStories = (projectId: string, params?: any) => {
	return useQuery({
		queryKey: ["user-stories", projectId, params],
		queryFn: () => userStoryService.getUserStories(projectId, params),
		enabled: !!projectId,
	});
};

export const useCreateUserStory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			projectId,
			data,
		}: {
			projectId: string;
			data: CreateUserStoryPayload;
		}) => userStoryService.createUserStory(projectId, data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["user-stories"] });
			toast.success(res.message || "User story created successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to create user story",
			);
		},
	});
};

export const useUpdateUserStory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			projectId,
			userStoryId,
			data,
		}: {
			projectId: string;
			userStoryId: string;
			data: EditUserStoryPayload;
		}) => userStoryService.updateUserStory(projectId, userStoryId, data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["user-stories"] });
			toast.success(res.message || "User story updated successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to update user story",
			);
		},
	});
};

export const useAssignUserStoryToSprint = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			projectId,
			userStoryId,
			sprintId,
		}: {
			projectId: string;
			userStoryId: string;
			sprintId: string | null;
		}) =>
			userStoryService.assignUserStoryToSprint(
				projectId,
				userStoryId,
				sprintId,
			),
		onSuccess: (res: any) => {
			queryClient.invalidateQueries({ queryKey: ["user-stories"] });
			queryClient.invalidateQueries({ queryKey: ["sprints"] });
			toast.success(res.message || "User story assigned successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to assign user story",
			);
		},
	});
};

export const useAssignUserStoryToMember = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			userStoryId,
			developerId,
		}: {
			projectId: string;
			userStoryId: string;
			developerId: string;
		}) => userStoryService.assignUserStoryToMember(userStoryId, developerId),
		onSuccess: (res: any) => {
			queryClient.invalidateQueries({ queryKey: ["user-stories"] });
			toast.success(res.message || "Member assigned successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to assign member");
		},
	});
};

export const useAddComment = (userStoryId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: AddCommentPayload) =>
			userStoryService.addComment(userStoryId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-stories"] });
			queryClient.invalidateQueries({ queryKey: ["my-user-stories"] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to post comment");
		},
	});
};
