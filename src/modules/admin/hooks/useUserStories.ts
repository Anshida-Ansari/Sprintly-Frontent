import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userStoryService } from "../services/userstory.service";
import type { CreateUserStoryPayload, EditUserStoryPayload } from "../types/types";
import { toast } from "sonner";

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
        mutationFn: ({ projectId, data }: { projectId: string; data: CreateUserStoryPayload }) =>
            userStoryService.createUserStory(projectId, data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["user-stories"] });
            toast.success(res.message || "User story created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create user story");
        },
    });
};

export const useUpdateUserStory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, userStoryId, data }: { projectId: string; userStoryId: string; data: EditUserStoryPayload }) =>
            userStoryService.updateUserStory(projectId, userStoryId, data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["user-stories"] });
            toast.success(res.message || "User story updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update user story");
        },
    });
};
