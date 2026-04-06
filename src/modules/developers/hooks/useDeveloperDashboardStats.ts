import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { developerDashboardService } from "../services/developerDashboard.service";

export const useDeveloperDashboardStats = () => {
	const { companyId } = useParams();

	return useQuery({
		queryKey: ["developer-dashboard-stats", companyId],
		queryFn: () => developerDashboardService.getStats(companyId as string),
		enabled: !!companyId,
		refetchInterval: 30000,
	});
};
