import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";

export interface SubscriptionPlan {
	id: string;
	name: string;
	price: number;
	stripePriceId?: string;
	projectLimit: number;
	features: Array<{ text: string; included: boolean }>;
	isActive: boolean;
	isPopular: boolean;
}

export const useSubscriptionPlans = (activeOnly = false) => {
	return useQuery({
		queryKey: ["subscription-plans", activeOnly],
		queryFn: async () => {
			const endpoint = activeOnly
				? API_ENDPOINTS.ADMIN.ACTIVE_PLANS
				: API_ENDPOINTS.SUPERADMIN.SUBSCRIPTION_PLANS;
			const { data } = await api.get<SubscriptionPlan[]>(endpoint);
			return data;
		},
	});
};

export const useCreateSubscriptionPlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (plan: Partial<SubscriptionPlan>) => {
			const { data } = await api.post(
				API_ENDPOINTS.SUPERADMIN.SUBSCRIPTION_PLANS,
				plan,
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
		},
	});
};

export const useUpdateSubscriptionPlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: Partial<SubscriptionPlan>;
		}) => {
			const response = await api.put(
				`${API_ENDPOINTS.SUPERADMIN.SUBSCRIPTION_PLANS}/${id}`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
		},
	});
};

export const useDeleteSubscriptionPlan = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`${API_ENDPOINTS.SUPERADMIN.SUBSCRIPTION_PLANS}/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
		},
	});
};
