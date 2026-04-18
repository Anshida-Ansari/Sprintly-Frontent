import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";
import type { CompanyListQuery, CompanyListResponse } from "../types/types";

export const companyService = {
	async ListCompanies(params: CompanyListQuery): Promise<CompanyListResponse> {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.COMPANIES, { params });
		return res.data;
	},
	async UpdateStatus(companyId: string, status: "approved" | "rejected") {
		const res = await api.patch(API_ENDPOINTS.SUPERADMIN.COMPANY_STATUS(companyId), {
			status,
		});
		return res.data;
	},
	async getCompanyDetails(companyId: string) {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.COMPANY_DETAIL(companyId));
		return res.data;
	},
	async getDashboardStats() {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.DASHBOARD_STATS);
		return res.data;
	},
	async getSubscriptionAnalytics() {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.SUBSCRIPTION_ANALYTICS);
		return res.data;
	},
	async getRevenueAnalytics() {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.REVENUE_ANALYTICS);
		return res.data;
	},
	async getSubscriptionMetrics() {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.SUBSCRIPTION_DISTRIBUTION);
		return res.data;
	},
	async getTopCompanies() {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.TOP_COMPANIES);
		return res.data;
	},
	async getSubscriptionReport(page: number, limit: number) {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.SUBSCRIPTION_REPORTS, { params: { page, limit } });
		return res.data;
	},
	async getPaymentReport(page: number, limit: number) {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.PAYMENT_REPORTS, { params: { page, limit } });
		return res.data;
	},
	async getExpiringSoonReport(page: number, limit: number) {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.EXPIRING_REPORTS, { params: { page, limit } });
		return res.data;
	},
	async getTrialReport(page: number, limit: number) {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.TRIAL_REPORTS, { params: { page, limit } });
		return res.data;
	},
	async getPlatformAnalytics() {
		const res = await api.get(API_ENDPOINTS.SUPERADMIN.PLATFORM_ANALYTICS);
		return res.data;
	},
};
