import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
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
	attachments: s._attachments || s.attachments || [],
	createdAt: s._createdAt || s.createdAt,
	updatedAt: s._updatedAt || s.updatedAt,
});

export const subtaskService = {
	async getSubtasks(userStoryId: string): Promise<GetSubtasksResponse> {
		const res = await api.get(API_ENDPOINTS.ADMIN.SUBTASK.LIST(userStoryId));

		if (res.data && res.data.data) {
			res.data.data = res.data.data.map(mapSubtask);
		}

		return res.data;
	},

	async createSubtask(userStoryId: string, payload: CreateSubtaskPayload) {
		const res = await api.post(API_ENDPOINTS.ADMIN.SUBTASK.CREATE(userStoryId), payload);
		return res.data;
	},

	async updateSubtaskStatus(subtaskId: string, status: SubtaskStatus) {
		const res = await api.patch(API_ENDPOINTS.ADMIN.SUBTASK.UPDATE_STATUS(subtaskId), { status });
		return res.data;
	},

	async updateSubtaskTime(subtaskId: string, payload: { estimatedHours?: number; actualHours?: number }) {
		const res = await api.patch(API_ENDPOINTS.ADMIN.SUBTASK.UPDATE_TIME(subtaskId), payload);
		return res.data;
	},

	async assignSubtask(subtaskId: string, payload: AssignSubtaskPayload) {
		const res = await api.patch(
			API_ENDPOINTS.ADMIN.SUBTASK.ASSIGN(subtaskId),
			payload,
		);
		return res.data;
	},

	async deleteSubtask(subtaskId: string) {
		const res = await api.delete(API_ENDPOINTS.ADMIN.SUBTASK.DELETE(subtaskId));
		return res.data;
	},

	async addSubtaskComment(subtaskId: string, payload: { message: string }) {
		const res = await api.post(API_ENDPOINTS.ADMIN.SUBTASK.ADD_COMMENT(subtaskId), payload);
		return res.data;
	},

	async getUploadUrl(payload: { fileName: string; fileType: string }) {
		const res = await api.post(API_ENDPOINTS.ADMIN.SUBTASK.UPLOAD_URL, payload);
		return res.data;
	},

	async addAttachment(subtaskId: string, payload: { fileUrl: string; fileName: string }) {
		const res = await api.post(API_ENDPOINTS.ADMIN.SUBTASK.ADD_ATTACHMENT(subtaskId), payload);
		return res.data;
	},

	async getDownloadUrl(fileUrl: string) {
		const res = await api.get(API_ENDPOINTS.ADMIN.SUBTASK.DOWNLOAD_URL, {
			params: { fileUrl },
		});
		return res.data;
	}
};
