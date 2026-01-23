import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/project.service";

export const useGetProject = (projectId: string) => {
	return useQuery({
		queryKey: ["project", projectId],
		queryFn: () => projectService.getProjectById(projectId),
		enabled: !!projectId,
	});
};
