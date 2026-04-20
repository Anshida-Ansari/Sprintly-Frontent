import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectService } from "../services/project.service.tsx";

export function useAddMemberToProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			projectId,
			memberId,
		}: {
			projectId: string;
			memberId: string;
		}) => projectService.addMember(projectId, memberId),

		onSuccess: () => {
			toast.success("Member added to project successfully");
			queryClient.invalidateQueries({ queryKey: ["project"] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to add member");
		},
	});
}
