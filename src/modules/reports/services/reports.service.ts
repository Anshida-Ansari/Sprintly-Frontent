import api from "../../../lib/axios.user";
import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";

export interface ReportParams {
	projectId?: string;
	page?: number;
	limit?: number;
	startDate?: string;
	endDate?: string;
	[key: string]: any;
}

export const reportsService = {
	async getProjectReports(params: ReportParams): Promise<any> {
		const { projectId, ...rest } = params;
		const query = new URLSearchParams(rest as any).toString();
		const url = projectId
			? `${API_ENDPOINTS.REPORTS.PROJECT_REPORT(projectId)}?${query}`
			: `${API_ENDPOINTS.REPORTS.ALL_PROJECTS_REPORT}?${query}`;
		const res = await api.get(url);
		return res.data;
	},

	async getSprintReports(params: ReportParams): Promise<any> {
		const { projectId, ...rest } = params;
		const query = new URLSearchParams(rest as any).toString();
		const url = projectId
			? `${API_ENDPOINTS.REPORTS.SPRINT_REPORT(projectId)}?${query}`
			: `${API_ENDPOINTS.REPORTS.ALL_SPRINTS_REPORT}?${query}`;
		const res = await api.get(url);
		return res.data;
	},

	async getUserStoryReports(params: ReportParams): Promise<any> {
		const { projectId, ...rest } = params;
		const query = new URLSearchParams(rest as any).toString();
		const url = projectId
			? `${API_ENDPOINTS.REPORTS.STORY_REPORT(projectId)}?${query}`
			: `${API_ENDPOINTS.REPORTS.ALL_STORIES_REPORT}?${query}`;
		const res = await api.get(url);
		return res.data;
	},

	async getSubtaskReports(params: ReportParams): Promise<any> {
		const { projectId, ...rest } = params;
		const query = new URLSearchParams(rest as any).toString();
		const url = projectId
			? `${API_ENDPOINTS.REPORTS.TASK_REPORT(projectId)}?${query}`
			: `${API_ENDPOINTS.REPORTS.ALL_TASKS_REPORT}?${query}`;
		const res = await api.get(url);
		return res.data;
	},

	async getUserPerformanceReports(params: ReportParams): Promise<any> {
		const { projectId, ...rest } = params;
		const query = new URLSearchParams(rest as any).toString();
		const url = projectId
			? `${API_ENDPOINTS.REPORTS.USER_PERFORMANCE_REPORT(projectId)}?${query}`
			: `${API_ENDPOINTS.REPORTS.ALL_PERFORMANCE_REPORT}?${query}`;
		const res = await api.get(url);
		return res.data;
	},
};
