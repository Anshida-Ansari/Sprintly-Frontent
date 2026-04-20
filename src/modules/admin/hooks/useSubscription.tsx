import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { subscriptionService } from "../services/subscription.service";

export function useUpgradeSubscription() {
	return useMutation({
		mutationFn: () => subscriptionService.upgradePlanSimulated(),
		onSuccess: (res) => {
			if (res.success) {
				toast.success(res.message || "Successfully upgraded to Pro!");
				// Reload the page to reflect the new state, or invalidate queries if we had a user query
				window.location.reload();
			}
		},
		onError: (err: any) => {
			toast.error(err.response?.data?.message || "Failed to upgrade plan");
		},
	});
}

export function useCreateStripeSession() {
	return useMutation({
		mutationFn: (priceId: string) =>
			subscriptionService.createStripeSession(priceId),
		onSuccess: (res) => {
			if (res.success && res.url) {
				window.location.href = res.url;
			}
		},
		onError: (err: any) => {
			toast.error(
				err.response?.data?.message || "Failed to initialize checkout",
			);
		},
	});
}

export function useVerifyStripeSession() {
	return useMutation({
		mutationFn: (sessionId: string) =>
			subscriptionService.verifyStripeSession(sessionId),
		onSuccess: (res) => {
			if (res.success) {
				toast.success(res.message);
				window.location.href = window.location.pathname; // Clear query params
			}
		},
		onError: (err: any) => {
			toast.error(err.response?.data?.message || "Verification failed");
		},
	});
}

export function useSubscriptionStatus() {
	return useQuery({
		queryKey: ["subscription-status"],
		queryFn: () => subscriptionService.getSubscriptionStatus(),
		refetchInterval: 60000, // Refetch every minute
	});
}
