import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";

export interface BurndownResponse {
	labels: string[];
	ideal: number[];
	actual: number[];
}

export const getSprintBurndown = async (
	sprintId: string,
	type: "hours" | "points" = "hours",
): Promise<BurndownResponse> => {
	const response = await api.get(
		API_ENDPOINTS.ADMIN.ANALYTICS.SPRINT_BURNDOWN(sprintId),
		{
			params: { type },
		},
	);
	return response.data.data;
};

export const getUserBurndown = async (
	sprintId: string,
	type: "hours" | "points" = "hours",
): Promise<BurndownResponse> => {
	const response = await api.get(
		API_ENDPOINTS.ADMIN.ANALYTICS.USER_BURNDOWN(sprintId),
		{
			params: { type },
		},
	);
	return response.data.data;
};
