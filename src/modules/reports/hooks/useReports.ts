import { useQuery } from "@tanstack/react-query";
import { reportsService } from "../services/reports.service";

export const useProjectReports = (params: any) => {
    return useQuery({
        queryKey: ["project-reports", params],
        queryFn: () => reportsService.getProjectReports(params),
    });
};

export const useSprintReports = (params: any) => {
    return useQuery({
        queryKey: ["sprint-reports", params],
        queryFn: () => reportsService.getSprintReports(params),
    });
};

export const useUserStoryReports = (params: any) => {
    return useQuery({
        queryKey: ["userstory-reports", params],
        queryFn: () => reportsService.getUserStoryReports(params),
    });
};

export const useSubtaskReports = (params: any) => {
    return useQuery({
        queryKey: ["subtask-reports", params],
        queryFn: () => reportsService.getSubtaskReports(params),
    });
};

export const useUserPerformanceReports = (params: any) => {
    return useQuery({
        queryKey: ["user-performance-reports", params],
        queryFn: () => reportsService.getUserPerformanceReports(params),
    });
};
