import api from "../../../lib/axios.user";
import type { SubmitStandupPayload } from "../types/standup.types";

export const standupService = {
	submit: async (
		projectId: string,
		sprintId: string,
		data: SubmitStandupPayload,
	) => {
		const res = await api.post(
			`/project/sprint/${projectId}/${sprintId}/standups`,
			data,
		);
		return res.data;
	},

	list: async (projectId: string, sprintId: string) => {
		const res = await api.get(
			`/project/sprint/${projectId}/${sprintId}/standups`,
		);
		return res.data;
	},

	today: async (projectId: string, sprintId: string) => {
		const res = await api.post(
			`/project/sprint/${projectId}/${sprintId}/standups/today`,
		);
		return res.data;
	},

	addComment: async (
		projectId: string,
		sprintId: string,
		standupId: string,
		message: string,
	) => {
		const res = await api.post(
			`/project/sprint/${projectId}/${sprintId}/standups/${standupId}/comments`,
			{
				message,
			},
		);
		return res.data;
	},
};
