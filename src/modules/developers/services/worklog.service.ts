import api from "../../../lib/axios.user";

export const workLogService = {
	async createWorkLog(payload: {
		subTaskId: string;
		hours: number;
		description: string;
		date: string | Date;
	}) {
		const res = await api.post("worklogs", payload);
		return res.data;
	},

	async getMyWorkLogs(filters: any = {}) {
		const queryParams = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value) queryParams.append(key, value as string);
		});
		const res = await api.get(`worklogs/me?${queryParams.toString()}`);
		return res.data;
	},

	async getAdminWorkLogs(filters: any = {}) {
		const queryParams = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value) queryParams.append(key, value as string);
		});
		const res = await api.get(`worklogs/admin?${queryParams.toString()}`);
		return res.data;
	},
};
