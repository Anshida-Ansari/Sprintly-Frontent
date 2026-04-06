import React from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  CheckSquare, 
  Zap, 
  Box, 
  ScrollText, 
  Video, 
  MessageSquare,
  Circle,
  Check
} from "lucide-react";
import type { Notification } from "../../types/notification.types";
import { NotificationType } from "../../types/notification.types";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.SUBTASK_ASSIGNED:
      return <CheckSquare className="text-emerald-600" size={14} />;
    case NotificationType.SPRINT_CREATED:
      return <Zap className="text-amber-600" size={14} />;
    case NotificationType.PROJECT_ASSIGNED:
      return <Box className="text-indigo-600" size={14} />;
    case NotificationType.STORY_ASSIGNED:
      return <ScrollText className="text-blue-600" size={14} />;
    case NotificationType.MEETING_SCHEDULED:
      return <Video className="text-rose-600" size={14} />;
    case NotificationType.COMMENT_ADDED:
      return <MessageSquare className="text-cyan-600" size={14} />;
    default:
      return <Circle className="text-gray-400" size={14} />;
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  return (
    <div 
      className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
        !notification.isRead 
          ? "bg-indigo-50/30 border-indigo-100/50 shadow-sm shadow-indigo-100/20" 
          : "bg-white border-gray-100 hover:bg-gray-50/50"
      }`}
    >
      {/* Header: Title, Unread Dot, Time */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 p-1.5 bg-white rounded-lg border border-gray-100 shadow-sm">
            {getNotificationIcon(notification.type)}
          </div>
          <h4 className="text-[15px] font-black text-gray-900 tracking-tight truncate uppercase">
            {notification.type.replace(/_/g, " ")}
          </h4>
          {!notification.isRead && (
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)] flex-shrink-0" />
          )}
        </div>
        <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap mt-1 tracking-tight">
          {notification.createdAt ? (
            formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
          ) : (
            "Just now"
          )}
        </span>
      </div>

      {/* Body: Message */}
      <p className="text-sm text-gray-500 leading-relaxed font-semibold mb-4 px-1">
        {notification.message}
      </p>

      {/* Footer: Mark as Read */}
      {!notification.isRead && (
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-indigo-100/40 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
          >
            <Check size={12} strokeWidth={3} />
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
};
