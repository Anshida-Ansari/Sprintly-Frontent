import api from "../../lib/axios.user";
import type { Notification } from "../types/notification.types";

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get("/notifications");
    return response.data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },
};
