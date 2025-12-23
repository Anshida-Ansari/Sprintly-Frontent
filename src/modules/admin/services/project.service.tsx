import api from "../../../lib/axios.user";
import type { CreateProjectPayload, CreateProjectResponse } from "../types/types";

export const projectService = {
    async createProject(payload: CreateProjectPayload): Promise<CreateProjectResponse> {
        const res = await api.post('project/create-project', payload)
        return res.data
    },

    async getProjects(params?: { page?: number; limit?: number; search?: string }): Promise<any> {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.search) query.append('search', params.search);

        const res = await api.get(`project/projects?${query.toString()}`);
        return res.data;
    }
}
