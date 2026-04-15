import { useQuery } from "@tanstack/react-query";
import { companyService } from "../services/company.services";

export function useSubscriptionAnalytics() {
	return useQuery({
		queryKey: ["superadmin-subscription-analytics"],
		queryFn: () => companyService.getSubscriptionAnalytics(),
	});
}
