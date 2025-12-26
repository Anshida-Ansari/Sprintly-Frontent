import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectService } from "../services/project.service";
import type { EditProjectPayload } from "../types/types";

export function useEditProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: EditProjectPayload) => projectService.updateProject(payload),
        onSuccess: (res) => {
            toast.success(res.message || "Project updated successfully");
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update project");
        }
    });
}
