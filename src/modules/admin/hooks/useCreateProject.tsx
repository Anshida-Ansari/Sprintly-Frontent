import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectService } from "../services/project.service";
import type { CreateProjectPayload } from "../types/types";

export function useCreateProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateProjectPayload) =>
			projectService.createProject(payload),
		onSuccess: (res) => {
			toast.success(res.message || "Project created successfully");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
		onError: (err: any) => {
			toast.error(err.response?.data?.message || "Failed to create project");
		},
	});
}
