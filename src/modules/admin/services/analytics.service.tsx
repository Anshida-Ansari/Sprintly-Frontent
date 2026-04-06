import api from "../../../lib/axios.user";
import type { BurnDownDataPoint } from "../../../shared/components/charts/BurnDownChart";

export const getSprintBurndown = async (sprintId: string): Promise<BurnDownDataPoint[]> => {
	const response = await api.get(`/analytics/burndown/sprint/${sprintId}`);
	return response.data.data;
};

export const getUserBurndown = async (sprintId: string): Promise<BurnDownDataPoint[]> => {
	const response = await api.get(`/analytics/burndown/user/${sprintId}`);
	return response.data.data;
};
