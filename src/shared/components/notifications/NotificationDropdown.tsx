import { Bell, BellOff, Check, Loader2, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useNotificationStore } from "../../../stores/useNotificationStore";
import { NotificationItem } from "./NotificationItem";

interface NotificationDropdownProps {
	onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
	onClose,
}) => {
	const { notifications, isLoading, markAsRead, markAllAsRead, unreadCount } =
		useNotificationStore();
	const [filter, setFilter] = useState<"unread" | "all">("unread");

	const filteredNotifications =
		filter === "unread"
			? notifications.filter((n) => !n.isRead)
			: notifications;

	return (
		<div className="absolute right-0 mt-3 w-[400px] bg-white border border-gray-200 rounded-[32px] shadow-2xl shadow-indigo-100/50 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
			{/* Header */}
			<div className="p-6 pb-4 flex items-start justify-between">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
						<Bell className="text-indigo-600" size={24} />
					</div>
					<div>
						<h3 className="text-xl font-black text-gray-900 tracking-tight">
							Notification
						</h3>
						<p className="text-sm text-gray-400 font-bold">
							{unreadCount} unread notifications
						</p>
					</div>
				</div>
				<button
					onClick={onClose}
					className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
				>
					<X size={20} />
				</button>
			</div>

			{/* Tabs & Mark All */}
			<div className="px-6 py-2 flex items-center justify-between border-b border-gray-100">
				<div className="flex bg-gray-100/80 p-1 rounded-2xl gap-1">
					<button
						onClick={() => setFilter("unread")}
						className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
							filter === "unread"
								? "bg-white text-indigo-600 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Unread
						<span
							className={`px-1.5 py-0.5 rounded-md text-[10px] ${filter === "unread" ? "bg-indigo-50" : "bg-gray-200"}`}
						>
							{unreadCount}
						</span>
					</button>
					<button
						onClick={() => setFilter("all")}
						className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
							filter === "all"
								? "bg-white text-indigo-600 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						All
					</button>
				</div>

				<button
					onClick={() => markAllAsRead()}
					className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
					title="Mark all as read"
				>
					<Check size={18} strokeWidth={3} />
				</button>
			</div>

			{/* List Area */}
			<div className="max-h-[500px] overflow-y-auto custom-scrollbar-light py-2">
				{isLoading && notifications.length === 0 ? (
					<div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-4">
						<Loader2 className="animate-spin text-indigo-600" size={40} />
						<p className="text-sm font-bold">Syncing...</p>
					</div>
				) : filteredNotifications.length === 0 ? (
					<div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-6 text-center">
						<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
							<BellOff size={32} className="text-gray-300" />
						</div>
						<div>
							<p className="font-bold text-gray-900 text-lg">All caught up!</p>
							<p className="text-sm mt-1">
								No {filter} notifications available.
							</p>
						</div>
					</div>
				) : (
					<div className="px-4 space-y-3 pb-4">
						{filteredNotifications.map((notification) => (
							<NotificationItem
								key={notification.id}
								notification={notification}
								onMarkAsRead={markAsRead}
							/>
						))}
					</div>
				)}
			</div>

			<style
				dangerouslySetInnerHTML={{
					__html: `
        .custom-scrollbar-light::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `,
				}}
			/>
		</div>
	);
};
