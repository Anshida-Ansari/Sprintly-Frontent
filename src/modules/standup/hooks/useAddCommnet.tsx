import { useMutation, useQueryClient } from "@tanstack/react-query";
import { standupService } from "../services/standup.service";

export const useAddComment = (projectId: string, sprintId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ standupId, message }: { standupId: string; message: string }) =>
            standupService.addComment(projectId, sprintId, standupId, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["standups", projectId, sprintId] });
        },
    });
};
