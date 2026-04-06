import { useQuery } from '@tanstack/react-query';
import { getSprintBurndown, getUserBurndown } from '../../modules/admin/services/analytics.service';
import type { BurnDownDataPoint } from '../components/charts/BurnDownChart';

export const useSprintBurndown = (sprintId: string | null) => {
	return useQuery<BurnDownDataPoint[]>({
		queryKey: ['sprint-burndown', sprintId],
		queryFn: () => getSprintBurndown(sprintId as string),
		enabled: !!sprintId,
	});
};

export const useUserBurndown = (sprintId: string | null) => {
	return useQuery<BurnDownDataPoint[]>({
		queryKey: ['user-burndown', sprintId],
		queryFn: () => getUserBurndown(sprintId as string),
		enabled: !!sprintId,
	});
};
