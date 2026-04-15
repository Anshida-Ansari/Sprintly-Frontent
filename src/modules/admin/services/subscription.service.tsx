import api from "../../../lib/axios.user";

export const subscriptionService = {
	async createStripeSession(priceId: string): Promise<{ success: boolean; url: string; sessionId: string }> {
		const res = await api.post("admin/create-stripe-session", { priceId });
		return res.data;
	},
	async verifyStripeSession(sessionId: string): Promise<{ success: boolean; message: string; currentPlan: string }> {
		const res = await api.post("admin/verify-stripe-session", { sessionId });
		return res.data;
	},

	async upgradePlanSimulated(): Promise<{ success: boolean; message: string; currentPlan: string }> {
		const res = await api.post("admin/upgrade-plan");
		return res.data;
	},

	async getSubscriptionStatus(): Promise<{
		success: boolean;
		data: {
			currentPlan: string;
			projectLimit: number;
			projectCount: number;
			isLimitReached: boolean;
			subscriptionEndDate?: string | null;
			stripeSubscriptionId?: string | null;
		};
	}> {
		const res = await api.get("admin/subscription-status");
		return res.data;
	},
};
