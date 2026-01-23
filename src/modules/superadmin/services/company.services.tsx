import api from "../../../lib/axios.user";
import type { CompanyListQuery, CompanyListResponse } from "../types/types";

export const companyService = {
	async ListCompanies(params: CompanyListQuery): Promise<CompanyListResponse> {
		const res = await api.get("/superadmin/companies", { params });
		return res.data;
	},
	async UpdateStatus(companyId: string, status: "approved" | "rejected") {
		const res = await api.patch(`superadmin/company/${companyId}/status`, {
			status,
		});
		return res.data;
	},
	async getCompanyDetails(companyId: string) {
		const res = await api.get(`superadmin/company/${companyId}`);
		return res.data;
	},
};
