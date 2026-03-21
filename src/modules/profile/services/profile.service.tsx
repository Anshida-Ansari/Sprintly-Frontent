import api from "../../../lib/axios.user";
import type { UserProfile, ProfileResponse } from "../types/profile.types";

export const profileService = {
    async getProfile(companyId: string): Promise<ProfileResponse> {
        const res = await api.get(`/companies/${companyId}/profile/me`);
        return res.data;
    },

    async updateProfile(companyId: string, payload: Partial<UserProfile>): Promise<ProfileResponse> {
        const res = await api.put(`/companies/${companyId}/profile`, payload);
        return res.data;
    }
};
