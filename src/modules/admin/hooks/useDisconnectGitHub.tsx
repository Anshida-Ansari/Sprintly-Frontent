import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { githubService } from "../services/github.service";

export const useDisconnectGitHub = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => githubService.disconnect(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["github-status"] });
			toast.success("GitHub disconnected successfully");
		},
		onError: () => {
			toast.error("Failed to disconnect GitHub");
		},
	});
};
