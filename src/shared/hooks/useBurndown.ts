import { useQuery } from "@tanstack/react-query";
import {
	type BurndownResponse,
	getSprintBurndown,
	getUserBurndown,
} from "../../modules/admin/services/analytics.service";

export const useSprintBurndown = (
	sprintId: string | null,
	type: "hours" | "points" = "hours",
) => {
	return useQuery<BurndownResponse>({
		queryKey: ["sprint-burndown", sprintId, type],
		queryFn: () => getSprintBurndown(sprintId as string, type),
		enabled: !!sprintId,
	});
};

export const useUserBurndown = (
	sprintId: string | null,
	type: "hours" | "points" = "hours",
) => {
	return useQuery<BurndownResponse>({
		queryKey: ["user-burndown", sprintId, type],
		queryFn: () => getUserBurndown(sprintId as string, type),
		enabled: !!sprintId,
	});
};
