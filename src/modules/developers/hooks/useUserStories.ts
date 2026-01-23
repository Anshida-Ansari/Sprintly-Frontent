import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userStoryService } from "../services/userstory.service";

export const useGetActiveSprintStories = (projectId: string) => {
	return useQuery({
		queryKey: ["active-sprint-stories", projectId],
		queryFn: () => userStoryService.getActiveSprintStories(projectId),
		enabled: !!projectId,
	});
};

export const useUpdateUserStoryStatus = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			userStoryId,
			status,
		}: {
			userStoryId: string;
			status: string;
		}) => userStoryService.updateUserStoryStatus(userStoryId, status),
		onSuccess: (res: any) => {
			queryClient.invalidateQueries({
				queryKey: ["active-sprint-stories", projectId],
			});
			toast.success(res.message || "Story status updated successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to update story status",
			);
		},
	});
};
