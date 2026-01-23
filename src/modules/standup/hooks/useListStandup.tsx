import { useQuery } from "@tanstack/react-query";
import { standupService } from "../services/standup.service";
import type { Standup } from "../types/standup.types";

export const useListStandups = (projectId: string, sprintId: string) => {
	return useQuery<Standup[]>({
		queryKey: ["standups", projectId, sprintId],
		queryFn: async () => {
			const res = await standupService.list(projectId, sprintId);
			return res.data || [];
		},
		enabled: !!projectId && !!sprintId,
	});
};
