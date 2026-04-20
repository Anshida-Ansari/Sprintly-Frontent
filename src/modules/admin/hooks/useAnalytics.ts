import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios.user";

export const useAnalytics = (projectId?: string) => {
	return useQuery({
		queryKey: ["analytics-dashboard", projectId],
		queryFn: async () => {
			const url = projectId
				? `projects/${projectId}/analytics`
				: "projects/dashboard";

			const { data } = await api.get(url);
			return data.data;
		},
	});
};
