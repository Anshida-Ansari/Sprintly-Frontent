import { useMutation, useQueryClient } from "@tanstack/react-query";
import { standupService } from "../services/standup.service";
import type { SubmitStandupPayload } from "../types/standup.types";
import { toast } from "react-hot-toast";

export const useSubmitStandup = (projectId: string, sprintId: string) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (data: SubmitStandupPayload) =>
			standupService.submit(projectId, sprintId, data),

		onSuccess: () => {
			toast.success("Standup synced successfully!");
			qc.invalidateQueries({ queryKey: ["standups", projectId, sprintId] });
			qc.invalidateQueries({
				queryKey: ["today-standup", projectId, sprintId],
			});
		},
		onError: (error: any) => {
			const message = error.response?.data?.message || error.message || "Failed to submit standup";
			toast.error(message);
		}
	});
};
