import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";

export interface GitHubStatusResponse {
    isConnected: boolean;
    githubUsername?: string;
    githubOrganization?: string;
    connectedAt?: Date;
    key?: string;
}

export const githubService = {
    async initiateConnection(): Promise<{ authUrl: string }> {
        const res = await api.get(API_ENDPOINTS.GITHUB.AUTH_INITIATE);
        return res.data;
    },

    async getStatus(): Promise<GitHubStatusResponse> {
        const res = await api.get(API_ENDPOINTS.GITHUB.STATUS);
        return res.data;
    },

    async disconnect(): Promise<{ success: boolean }> {
        const res = await api.post(API_ENDPOINTS.GITHUB.DISCONNECT);
        return res.data;
    },
};
