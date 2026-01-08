import api from "../../../lib/axios.user";
import type {
    CreateSprintPayload,
    EditSprintPayload,
    GetSprintsResponse,
    SprintStatus
} from "../types/types";

export const sprintService = {
    async createSprint(projectId: string, payload: CreateSprintPayload) {
        const res = await api.post(`/project/${projectId}/sprints`, payload);
        return res.data;
    },

    async getSprints(projectId: string, params: { page: number; limit: number; search?: string; status?: SprintStatus }) {
        const searchParams = new URLSearchParams();
        searchParams.append("page", params.page.toString());
        searchParams.append("limit", params.limit.toString());
        if (params.search) searchParams.append("search", params.search);
        if (params.status) searchParams.append("status", params.status);

        const res = await api.get(`/project/${projectId}/sprints?${searchParams.toString()}`);
        return res.data as GetSprintsResponse;
    },

    async editSprint(projectId: string, sprintId: string, payload: EditSprintPayload) {
        const res = await api.patch(`/project/${projectId}/sprints/${sprintId}`, payload);
        return res.data;
    }
};
