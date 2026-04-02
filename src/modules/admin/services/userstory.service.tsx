import api from "../../../lib/axios.user";
import type {
	AddCommentPayload,
	CreateUserStoryPayload,
	EditUserStoryPayload,
	GetUserStoriesResponse,
} from "../types/types";

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
	assignedTo: s._assignedTo || s.assignedTo,
	estimationPoints: s._estimationPoints ?? s.estimationPoints ?? 0,
	acceptanceCriteria: s._acceptanceCriteria || s.acceptanceCriteria || [],
	createdAt: s._createdAt || s.createdAt,
	updatedAt: s._updatedAt || s.updatedAt,
	comments: s._comments || s.comments || [],
	subtasks: (s.subtasks || []).map((st: any) => ({
		...st,
		id: st._id || st.id,
		title: st._title || st.title,
		status: st._status || st.status,
	})),
});

export const userStoryService = {
	async createUserStory(
		projectId: string,
		payload: CreateUserStoryPayload,
	): Promise<any> {
		const res = await api.post(`projects/${projectId}/user-stories`, payload);
		return res.data;
	},

	async updateUserStory(
		projectId: string,
		userStoryId: string,
		payload: EditUserStoryPayload,
	): Promise<any> {
		const res = await api.post(
			`projects/${projectId}/user-stories/${userStoryId}`,
			payload,
		);
		return res.data;
	},

	async getUserStories(
		projectId: string,
		params?: {
			page?: number;
			limit?: number;
			search?: string;
			sprintId?: string;
			status?: string;
		},
	): Promise<GetUserStoriesResponse> {
		const query = new URLSearchParams();
		if (params?.page) query.append("page", params.page.toString());
		if (params?.limit) query.append("limit", params.limit.toString());
		if (params?.search) query.append("search", params.search);
		if (params?.sprintId) query.append("sprintId", params.sprintId);
		if (params?.status) query.append("status", params.status);

		const res = await api.get(
			`projects/${projectId}/user-stories?${query.toString()}`,
		);

		if (res.data && res.data.data) {
			res.data.data = res.data.data.map(mapUserStory);
		}

		return res.data;
	},

	async assignUserStoryToSprint(
		projectId: string,
		userStoryId: string,
		sprintId: string | null,
	) {
		const res = await api.post(`projects/${projectId}/assign-sprint`, {
			userStoryId,
			sprintId,
		});
		return res.data;
	},

	async assignUserStoryToMember(
		userStoryId: string,
		developerId: string,
	) {
		const res = await api.patch(
			`projects/${userStoryId}/assign-member`,
			{
				developerId,
			},
		);
		return res.data;
	},

	async addComment(
		userStoryId: string,
		payload: AddCommentPayload,
	): Promise<any> {
		const res = await api.post(
			`projects/${userStoryId}/comments`,
			payload,
		);
		return res.data;
	},
};
