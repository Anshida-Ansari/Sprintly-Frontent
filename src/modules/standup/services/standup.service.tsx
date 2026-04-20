import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";
import type { SubmitStandupPayload } from "../types/standup.types";

export const standupService = {
	submit: async (
		projectId: string,
		sprintId: string,
		data: SubmitStandupPayload,
	) => {
		const base = API_ENDPOINTS.STANDUP.BASE(projectId, sprintId);
		const res = await api.post(API_ENDPOINTS.STANDUP.SUBMIT(base), data);
		return res.data;
	},

	list: async (projectId: string, sprintId: string, date?: string) => {
		const base = API_ENDPOINTS.STANDUP.BASE(projectId, sprintId);
		const res = await api.get(API_ENDPOINTS.STANDUP.LIST(base), {
			params: { date },
		});
		return res.data;
	},

	today: async (projectId: string, sprintId: string) => {
		const base = API_ENDPOINTS.STANDUP.BASE(projectId, sprintId);
		const res = await api.post(API_ENDPOINTS.STANDUP.TODAY(base));
		return res.data;
	},

	addComment: async (
		projectId: string,
		sprintId: string,
		standupId: string,
		message: string,
	) => {
		const base = API_ENDPOINTS.STANDUP.BASE(projectId, sprintId);
		const res = await api.post(
			API_ENDPOINTS.STANDUP.ADD_COMMENT(base, standupId),
			{
				message,
			},
		);
		return res.data;
	},
};
