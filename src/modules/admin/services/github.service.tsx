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
        const res = await api.get("/github/auth/initiate");
        return res.data;
    },

    async getStatus(): Promise<GitHubStatusResponse> {
        const res = await api.get("/github/status");
        return res.data;
    },

    async disconnect(): Promise<{ success: boolean }> {
        const res = await api.post("/github/disconnect");
        return res.data;
    },
};
