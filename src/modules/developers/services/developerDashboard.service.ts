import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";

export const developerDashboardService = {
	getStats: async (companyId: string) => {
		const response = await api.get(
			API_ENDPOINTS.DEVELOPER.DASHBOARD(companyId),
		);
		return response.data;
	},
};
