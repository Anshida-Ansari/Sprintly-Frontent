import api from "../../../lib/axios.user";

export const developerDashboardService = {
	getStats: async (companyId: string) => {
		const response = await api.get(`/companies/${companyId}/dashboard`);
		return response.data;
	},
};
