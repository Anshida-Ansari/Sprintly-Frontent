import api from "../../../lib/axios.user";
import type {
    CreateSubtaskPayload,
    GetSubtasksResponse,
    SubtaskStatus,
    AssignSubtaskPayload
} from "../types/types";

const mapSubtask = (s: any) => ({
    ...s,
    id: s._id || s.id,
    title: s._title || s.title,
    status: s._status || s.status,
    userStoryId: s._userStoryId || s.userStoryId,
    companyId: s._companyId || s.companyId,
    assignedTo: s._assignedTo || s.assignedTo,
    createdAt: s._createdAt || s.createdAt,
    updatedAt: s._updatedAt || s.updatedAt,
});

export const subtaskService = {
    async getSubtasks(userStoryId: string): Promise<GetSubtasksResponse> {
        const res = await api.get(`subtask/subtask/${userStoryId}`);

        if (res.data && res.data.data) {
            res.data.data = res.data.data.map(mapSubtask);
        }

        return res.data;
    },

    async createSubtask(userStoryId: string, payload: CreateSubtaskPayload) {
        const res = await api.post(`subtask/${userStoryId}/subtask`, payload);
        return res.data;
    },

    async updateSubtaskStatus(subtaskId: string, status: SubtaskStatus) {
        const res = await api.patch(`subtask/${subtaskId}/status`, { status });
        return res.data;
    },

    async assignSubtask(subtaskId: string, payload: AssignSubtaskPayload) {
        const res = await api.patch(`subtask/${subtaskId}/assign-members`, payload);
        return res.data;
    },

    async deleteSubtask(subtaskId: string) {
        const res = await api.delete(`subtask/${subtaskId}`);
        return res.data;
    }
};
