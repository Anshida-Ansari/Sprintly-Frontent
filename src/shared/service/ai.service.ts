import api from "../../lib/axios.user";

export interface AiChatResponse {
  reply: string;
}

export const aiService = {
  chat: async (message: string): Promise<string> => {
    const response = await api.post<{ success: boolean; data: AiChatResponse }>(
      "/ai/chat",
      { message },
    );
    return response.data.data.reply;
  },
};
