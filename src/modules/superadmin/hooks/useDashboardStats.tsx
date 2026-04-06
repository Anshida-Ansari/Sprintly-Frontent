import { useQuery } from "@tanstack/react-query";
import { companyService } from "../services/company.services";

export function useDashboardStats() {
	return useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: () => companyService.getDashboardStats(),
	});
}
