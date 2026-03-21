import api from "../../../lib/axios.user";
import type {
	AssignSubtaskPayload,
	CreateSubtaskPayload,
	GetSubtasksResponse,
	SubtaskStatus,
} from "../types/types";

const mapSubtask = (s: any) => ({
	...s,
	id: s._id || s.id,
	title: s._title || s.title,
	status: s._status || s.status,
	userStoryId: s._userStoryId || s.userStoryId,
	companyId: s._companyId || s.companyId,
	assignedTo: s._assignedTo || s.assignedTo,
	estimatedHours: s._estimatedHours || s.estimatedHours,
	actualHours: s._actualHours || s.actualHours,
	comments: s._comments || s.comments || [],
	createdAt: s._createdAt || s.createdAt,
	updatedAt: s._updatedAt || s.updatedAt,
});

export const subtaskService = {
	async getSubtasks(userStoryId: string): Promise<GetSubtasksResponse> {
		const res = await api.get(`userstory/subtask/${userStoryId}`);

		if (res.data && res.data.data) {
			res.data.data = res.data.data.map(mapSubtask);
		}

		return res.data;
	},

	async createSubtask(userStoryId: string, payload: CreateSubtaskPayload) {
		const res = await api.post(`userstory/${userStoryId}/subtask`, payload);
		return res.data;
	},

	async updateSubtaskStatus(subtaskId: string, status: SubtaskStatus) {
		const res = await api.patch(`userstory/${subtaskId}/status`, { status });
		return res.data;
	},

	async updateSubtaskTime(subtaskId: string, payload: { estimatedHours?: number; actualHours?: number }) {
		const res = await api.patch(`userstory/${subtaskId}/time`, payload);
		return res.data;
	},

	async assignSubtask(subtaskId: string, payload: AssignSubtaskPayload) {
		const res = await api.patch(
			`userstory/${subtaskId}/assign-members`,
			payload,
		);
		return res.data;
	},

	async deleteSubtask(subtaskId: string) {
		const res = await api.delete(`userstory/${subtaskId}`);
		return res.data;
	},

	async addSubtaskComment(subtaskId: string, payload: { message: string }) {
		const res = await api.post(`userstory/${subtaskId}/comments`, payload);
		return res.data;
	},
};
