import { API_ENDPOINTS } from "../../constants/api-endpoints.constants";
import api from "../../lib/axios.user";

export interface AiChatResponse {
	reply: string;
}

export const aiService = {
	chat: async (message: string, projectId?: string): Promise<string> => {
		const response = await api.post<{ success: boolean; data: AiChatResponse }>(
			API_ENDPOINTS.SHARED.AI_CHAT,
			{ message, projectId },
		);
		return response.data.data.reply;
	},
};
