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
});

export const userStoryService = {
	async getActiveSprintStories(
		projectId: string,
	): Promise<GetUserStoriesResponse> {
		const res = await api.get(`projects/${projectId}/user-stories?limit=100`);

		if (res.data && res.data.data) {
			res.data.data = res.data.data.map(mapUserStory);
		}

		return res.data;
	},

	async updateUserStoryStatus(userStoryId: string, status: string) {
		const res = await api.patch(`userstory/${userStoryId}/status`, { status });
		return res.data;
	},

	async getMyUserStories(): Promise<GetUserStoriesResponse> {
		const res = await api.get("projects/my-tasks");
		if (res.data && res.data.data) {
			res.data.data = res.data.data.map(mapUserStory);
		}
		return res.data;
	},
};
