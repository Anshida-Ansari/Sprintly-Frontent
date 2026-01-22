import { useQuery } from "@tanstack/react-query";
import { standupService } from "../services/standup.service";

export const useTodayStandup = (projectId: string, sprintId: string) => {
  return useQuery({
    queryKey: ["today-standup", projectId, sprintId],
    queryFn: async () => {
      const res = await standupService.today(projectId, sprintId);
      return res.data;
    },
    enabled: !!projectId && !!sprintId
  });
};
