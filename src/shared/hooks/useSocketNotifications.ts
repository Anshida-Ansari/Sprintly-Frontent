import { useEffect } from "react";
import { toast } from "sonner";
import { socket } from "../../lib/socket";
import { UserAuth } from "../../modules/auth/store/store";
import { useNotificationStore } from "../../stores/useNotificationStore";
import type { Notification } from "../types/notification.types";

export const useSocketNotifications = () => {
	const user = UserAuth((state) => state.user);
	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);
	const fetchNotifications = useNotificationStore(
		(state) => state.fetchNotifications,
	);

	useEffect(() => {
		if (user?.id) {
			if (!socket.connected) {
				socket.connect();
			}

			socket.emit("register-user", user.id);

			// Listen for new notifications
			socket.on("new-notification", (notification: Notification) => {
				addNotification(notification);

				// Show a vibrant toast
				const title = notification.type
					? notification.type.replace(/_/g, " ")
					: "New Notification";
				toast.info(title, {
					description: notification.message,
					duration: 5000,
					action: {
						label: "View",
						onClick: () =>
							console.log(
								"Navigate to notification entity",
								notification.entityId,
							),
					},
				});
			});

			// Fetch initial notifications
			fetchNotifications();

			return () => {
				socket.off("new-notification");
				// We might not want to disconnect globally if other parts of the app use it,
				// but for now, the layout manages the connection.
			};
		}
	}, [user?.id, addNotification, fetchNotifications]);
};
