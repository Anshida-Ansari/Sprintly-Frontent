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
	async getDashboardStats() {
		const res = await api.get("/superadmin/dashboard/stats");
		return res.data;
	},
	async getSubscriptionAnalytics() {
		const res = await api.get("/superadmin/subscription-analytics");
		return res.data;
	},
	async getRevenueAnalytics() {
		const res = await api.get("/superadmin/analytics/revenue");
		return res.data;
	},
	async getSubscriptionMetrics() {
		const res = await api.get("/superadmin/analytics/subscriptions");
		return res.data;
	},
	async getTopCompanies() {
		const res = await api.get("/superadmin/analytics/top-companies");
		return res.data;
	},
	async getSubscriptionReport(page: number, limit: number) {
		const res = await api.get("/superadmin/reports/subscriptions", { params: { page, limit } });
		return res.data;
	},
	async getPaymentReport(page: number, limit: number) {
		const res = await api.get("/superadmin/reports/payments", { params: { page, limit } });
		return res.data;
	},
	async getExpiringSoonReport(page: number, limit: number) {
		const res = await api.get("/superadmin/reports/expiring-soon", { params: { page, limit } });
		return res.data;
	},
	async getTrialReport(page: number, limit: number) {
		const res = await api.get("/superadmin/reports/trials", { params: { page, limit } });
		return res.data;
	},
	async getPlatformAnalytics() {
		const res = await api.get("/superadmin/analytics/platform");
		return res.data;
	},
};
