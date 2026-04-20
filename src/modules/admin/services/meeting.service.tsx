import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";

export interface ScheduleMeetingPayload {
	projectId: string;
	title: string;
	date: string | Date;
	type: "single" | "group";
	participants: string[];
}

export const meetingService = {
	async scheduleMeeting(payload: ScheduleMeetingPayload): Promise<any> {
		const res = await api.post(API_ENDPOINTS.ADMIN.MEETING.CREATE, payload);
		return res.data;
	},

	async getProjectMeetings(projectId: string): Promise<any> {
		const res = await api.get(
			API_ENDPOINTS.ADMIN.MEETING.LIST_BY_PROJECT(projectId),
		);
		return res.data;
	},

	async updateMeetingStatus(meetingId: string, status: string): Promise<any> {
		const res = await api.patch(
			API_ENDPOINTS.ADMIN.MEETING.UPDATE_STATUS(meetingId),
			{ status },
		);
		return res.data;
	},

	async getMeetingHistory(projectId: string): Promise<any> {
		const res = await api.get(API_ENDPOINTS.ADMIN.MEETING.HISTORY(projectId));
		return res.data;
	},
};
