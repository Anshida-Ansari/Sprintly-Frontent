import { API_ENDPOINTS } from "../../constants/api-endpoints.constants";
import api from "../../lib/axios.user";
import type { Notification } from "../types/notification.types";

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get(API_ENDPOINTS.SHARED.NOTIFICATIONS);
    return response.data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(API_ENDPOINTS.SHARED.NOTIFICATION_READ(id));
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch(API_ENDPOINTS.SHARED.NOTIFICATIONS_READ_ALL);
  },
};
