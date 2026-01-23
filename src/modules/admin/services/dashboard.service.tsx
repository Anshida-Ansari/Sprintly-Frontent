import api from "../../../lib/axios.user";

export const dashboardService = {
	async getStats(): Promise<any> {
		const res = await api.get("admin/stats");
		return res.data;
	},
};
