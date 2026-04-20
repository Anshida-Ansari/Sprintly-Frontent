import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
import api from "../../../lib/axios.user";
import type { ProfileResponse, UserProfile } from "../types/profile.types";

export const profileService = {
	async getProfile(companyId: string): Promise<ProfileResponse> {
		const res = await api.get(API_ENDPOINTS.PROFILE.ME(companyId));
		return res.data;
	},

	async updateProfile(
		companyId: string,
		payload: Partial<UserProfile>,
	): Promise<ProfileResponse> {
		const res = await api.put(API_ENDPOINTS.PROFILE.UPDATE(companyId), payload);
		return res.data;
	},
};
