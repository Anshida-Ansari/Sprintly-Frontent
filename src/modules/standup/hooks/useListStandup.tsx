import { useQuery } from "@tanstack/react-query";
import { standupService } from "../services/standup.service";
import type { Standup } from "../types/standup.types";

export const useListStandups = (
	projectId?: string,
	sprintId?: string,
	date?: string,
) => {
	return useQuery<Standup[]>({
		queryKey: ["standups", projectId, sprintId, date],
		queryFn: async () => {
			const res = await standupService.list(
				projectId || "",
				sprintId || "",
				date,
			);
			return res.data || [];
		},
		enabled: !!projectId || !!sprintId,
	});
};
