import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sprintService } from "../services/sprint.service.tsx";
import toast from "react-hot-toast";
import type { CreateSprintPayload, EditSprintPayload, SprintStatus } from "../types/types.tsx";

export function useGetSprints(projectId: string, params: { page: number; limit: number; search?: string; status?: SprintStatus }) {
    return useQuery({
        queryKey: ["sprints", projectId, params],
        queryFn: () => sprintService.getSprints(projectId, params),
        enabled: !!projectId,
    });
}

export function useCreateSprint(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSprintPayload) => sprintService.createSprint(projectId, payload),
        onSuccess: () => {
            toast.success("Sprint created successfully");
            queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create sprint");
        },
    });
}

export function useEditSprint(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ sprintId, payload }: { sprintId: string; payload: EditSprintPayload }) =>
            sprintService.editSprint(projectId, sprintId, payload),
        onSuccess: () => {
            toast.success("Sprint updated successfully");
            queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update sprint");
        },
    });
}
