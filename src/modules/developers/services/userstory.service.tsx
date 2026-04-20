import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";
import type { GetUserStoriesResponse } from "../../admin/types/types";

const mapUserStory = (s: any) => ({
	...s,
	id: s._id || s.id,
	title: s._title || s.title,
	description: s._description || s.description,
	status: s._status || s.status,
	priority: s._priority || s.priority,
	projectId: s._projectId || s.projectId,
	companyId: s._companyId || s.companyId,
	sprintId: s._sprintId || s.sprintId,
	createdAt: s._createdAt || s.createdAt,
	updatedAt: s._updatedAt || s.updatedAt,
	comments: s._comments || s.comments || [],
	subtasks: (s.subtasks || []).map((st: any) => ({
		...st,
		id: st._id || st.id,
		title: st._title || st.title,
		status: st._status || st.status,
		priority: st._priority || st.priority,
		assignedTo: st._assignedTo || st.assignedTo,
		estimatedHours: st._estimatedHours ?? st.estimatedHours,
		actualHours: st._actualHours ?? st.actualHours,
		comments: st._comments || st.comments || [],
	})),
});

export const userStoryService = {
	async getActiveSprintStories(
		projectId: string,
	): Promise<GetUserStoriesResponse> {
		const res = await api.get(
			`${API_ENDPOINTS.ADMIN.USERSTORY.LIST(projectId)}?limit=100`,
		);

		if (res.data?.data) {
			res.data.data = res.data.data.map(mapUserStory);
		}

		return res.data;
	},

	async updateUserStoryStatus(userStoryId: string, status: string) {
		const res = await api.patch(
			API_ENDPOINTS.DEVELOPER.UPDATE_USERSTORY_STATUS(userStoryId),
			{ status },
		);
		return res.data;
	},

	async getMyUserStories(): Promise<GetUserStoriesResponse> {
		const res = await api.get(API_ENDPOINTS.DEVELOPER.MY_TASKS);
		if (res.data?.data) {
			res.data.data = res.data.data.map(mapUserStory);
		}
		return res.data;
	},

	async addComment(userStoryId: string, payload: { message: string }) {
		const res = await api.post(
			API_ENDPOINTS.DEVELOPER.ADD_COMMENT(userStoryId),
			payload,
		);
		return res.data;
	},
};
