import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { projectService } from '../services/project.service';
import type { GetProjectsResponse } from '../types/types';

export function useProjects(params?: { page?: number; limit?: number; search?: string }) {
    return useQuery<GetProjectsResponse>({
        queryKey: ['projects', params],
        queryFn: async () => {
            const data = await projectService.getProjects(params);
            return data;
        },
        placeholderData: keepPreviousData,
    });
}
