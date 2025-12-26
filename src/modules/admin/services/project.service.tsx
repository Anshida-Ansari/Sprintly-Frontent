import api from "../../../lib/axios.user";
import type { CreateProjectPayload, CreateProjectResponse, EditProjectPayload } from "../types/types";

export const projectService = {
    async createProject(payload: CreateProjectPayload): Promise<CreateProjectResponse> {
        const res = await api.post('project/create-project', payload)
        return res.data
    },

    async updateProject(payload: EditProjectPayload): Promise<any> {
        const { projectId, ...data } = payload;
        const res = await api.patch(`project/update-project/${projectId}`, data);
        return res.data;
    },

    async getProjects(params?: { page?: number; limit?: number; search?: string }): Promise<any> {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.search) query.append('search', params.search);

        const res = await api.get(`project/projects?${query.toString()}`);

        if (res.data && res.data.data) {
            res.data.data = res.data.data.map((p: any) => ({
                ...p,
                id: p._id || p.id,
                name: p._name || p.name,
                description: p._description || p.description,
                status: p._status || p.status,
                startDate: p._startDate || p.startDate,
                endDate: p._endDate || p.endDate,
                gitRepoUrl: p._gitRepoUrl || p.gitRepoUrl,
                members: p._members || p.members,
                createdAt: p._createdAt || p.createdAt,
                updatedAt: p._updatedAt || p.updatedAt,
            }));
        }

        return res.data;
    }
}
