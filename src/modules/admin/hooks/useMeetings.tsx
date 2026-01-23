// Force update
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	meetingService,
	type ScheduleMeetingPayload,
} from "../services/meeting.service";

export function useMeetings(projectId?: string) {
	const queryClient = useQueryClient();

	const meetingsQuery = useQuery({
		queryKey: ["meetings", projectId],
		queryFn: () => meetingService.getProjectMeetings(projectId!),
		enabled: !!projectId,
	});

	const scheduleMutation = useMutation({
		mutationFn: (payload: ScheduleMeetingPayload) =>
			meetingService.scheduleMeeting(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["meetings"] });
			toast.success("Meeting scheduled successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to schedule meeting",
			);
		},
	});

	return {
		meetings: meetingsQuery.data?.data || [],
		isLoading: meetingsQuery.isLoading,
		scheduleMeeting: scheduleMutation.mutate,
		isScheduling: scheduleMutation.isPending,
	};
}
