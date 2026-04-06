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
		const res = await api.post("meeting", payload);
		return res.data;
	},

	async getProjectMeetings(projectId: string): Promise<any> {
		const res = await api.get(`meeting/project/${projectId}`);
		return res.data;
	},

	async updateMeetingStatus(meetingId: string, status: string): Promise<any> {
		const res = await api.patch(`meeting/${meetingId}/status`, { status });
		return res.data;
	},

	async getMeetingHistory(projectId: string): Promise<any> {
		const res = await api.get(`meeting/history/${projectId}`);
		return res.data;
	},
};
