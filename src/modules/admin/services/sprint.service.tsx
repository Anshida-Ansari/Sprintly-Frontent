import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";
import type {
	CreateSprintPayload,
	EditSprintPayload,
	GetSprintsResponse,
	SprintStatus,
} from "../types/types";

const mapSprint = (s: any) => ({
	...s,
	id: s._id || s.id,
	name: s._name || s.name,
	goal: s._goal || s.goal,
	startDate: s._startDate || s.startDate,
	endDate: s._endDate || s.endDate,
	status: s._status || s.status,
	projectId: s._projectId || s.projectId,
	companyId: s._companyId || s.companyId,
	createdAt: s._createdAt || s.createdAt,
	updatedAt: s._updatedAt || s.updatedAt,
});

export const sprintService = {
	async createSprint(projectId: string, payload: CreateSprintPayload) {
		const res = await api.post(API_ENDPOINTS.ADMIN.SPRINT.CREATE(projectId), payload);
		return res.data;
	},

	async getSprints(
		projectId: string,
		params: {
			page: number;
			limit: number;
			search?: string;
			status?: SprintStatus;
		},
	) {
		const searchParams = new URLSearchParams();
		searchParams.append("page", params.page.toString());
		searchParams.append("limit", params.limit.toString());
		if (params.search) searchParams.append("search", params.search);
		if (params.status) searchParams.append("status", params.status);

		const res = await api.get(
			`${API_ENDPOINTS.ADMIN.SPRINT.LIST(projectId)}?${searchParams.toString()}`,
		);

		if (res.data && res.data.data) {
			res.data.data = res.data.data.map(mapSprint);
		}

		return res.data as GetSprintsResponse;
	},

	async editSprint(
		projectId: string,
		sprintId: string,
		payload: EditSprintPayload,
	) {
		const res = await api.patch(
			API_ENDPOINTS.ADMIN.SPRINT.EDIT(projectId, sprintId),
			payload,
		);
		return res.data;
	},

	async startSprint(sprintId: string) {
		const res = await api.patch(API_ENDPOINTS.ADMIN.SPRINT.START(sprintId));
		return res.data;
	},

	async completeSprint(sprintId: string) {
		const res = await api.patch(API_ENDPOINTS.ADMIN.SPRINT.COMPLETE(sprintId));
		return res.data;
	},

	async deleteSprint(sprintId: string) {
		const res = await api.patch(API_ENDPOINTS.ADMIN.SPRINT.DELETE(sprintId));
		return res.data;
	},
};
