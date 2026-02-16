import { useMutation, useQueryClient } from "@tanstack/react-query";
import { githubService } from "../services/github.service";

export const useDisconnectGitHub = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => githubService.disconnect(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["github-status"] });
        },
    });
};
