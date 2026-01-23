import { useMutation, useQueryClient } from "@tanstack/react-query";
import { standupService } from "../services/standup.service";
import type { SubmitStandupPayload } from "../types/standup.types";

export const useSubmitStandup = (projectId: string, sprintId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (data: SubmitStandupPayload) =>
			standupService.submit(projectId, sprintId, data),

		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["standups", projectId, sprintId] });
			qc.invalidateQueries({
				queryKey: ["today-standup", projectId, sprintId],
			});
		},
	});
};
