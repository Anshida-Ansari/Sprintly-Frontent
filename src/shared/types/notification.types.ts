export const NotificationType = {
  PROJECT_ASSIGNED: "PROJECT_ASSIGNED",
  USER_ADDED_TO_PROJECT: "USER_ADDED_TO_PROJECT",
  STORY_ASSIGNED: "STORY_ASSIGNED",
  STORY_COMPLETED: "STORY_COMPLETED",
  SUBTASK_ASSIGNED: "SUBTASK_ASSIGNED",
  SUBTASK_STATUS_CHANGED: "SUBTASK_STATUS_CHANGED",
  COMMENT_ADDED: "COMMENT_ADDED",
  MEETING_SCHEDULED: "MEETING_SCHEDULED",
  SPRINT_CREATED: "SPRINT_CREATED"
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export type EntityType = "PROJECT" | "SPRINT" | "STORY" | "SUBTASK" | "MEETING";

export interface Notification {
  id: string;
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  message: string;
  entityId?: string;
  entityType?: EntityType;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}
