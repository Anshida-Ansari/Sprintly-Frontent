import { useQuery } from "@tanstack/react-query";
import { githubService } from "../services/github.service";

export const useGitHubStatus = () => {
	return useQuery({
		queryKey: ["github-status"],
		queryFn: () => githubService.getStatus(),
		retry: false,
		staleTime: 5 * 60 * 1000,
	});
};
