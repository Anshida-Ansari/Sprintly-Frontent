import api from "../../../lib/axios.user";
import type { CreateProjectPayload, CreateProjectResponse } from "../types/types";

export const projectService = {
    async createProject(payload: CreateProjectPayload): Promise<CreateProjectResponse> {
        const res = await api.post('project/create-project', payload)
        return res.data
    }
}
