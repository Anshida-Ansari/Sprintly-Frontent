import {
	BarChart3,
	FolderKanban,
	LayoutDashboard,
	LogOut,
	ScrollText,
	Settings,
	UserPlus,
	Users,
	Video,
	Zap,
	UserCircle,
} from "lucide-react";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { socket } from "../../lib/socket";
import { UserAuth } from "../../modules/auth/store/store";
import { useLogout } from "../hooks/useLogout";

const sidebarLinks = [
	{ name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
	{ name: "Projects", path: "/admin/projects", icon: FolderKanban },
	{ name: "Members", path: "/admin/members", icon: Users },
	{ name: "Sprints", path: "/admin/sprints", icon: Zap },
	{ name: "Planning", path: "/admin/sprint-planning", icon: Zap },
	{ name: "User Stories", path: "/admin/user-stories", icon: ScrollText },
	{ name: "Team", path: "/admin/team", icon: UserPlus },
	{ name: "Meetings", path: "/admin/meetings", icon: Video },
	{ name: "Reports", path: "/admin/reports", icon: BarChart3 },
	{ name: "Profile", path: "/admin/profile", icon: UserCircle },
];

export default function AdminLayout() {
	const logout = useLogout();
	const user = UserAuth((state) => state.user);

	useEffect(() => {
		if (user?.id) {
			socket.connect();
			socket.emit("register-user", user.id);

			socket.on(
				"meeting-scheduled",
				(data: { title: string; date: string }) => {
					toast.info(`New Meeting: ${data.title}`, {
						description: `Scheduled for ${new Date(data.date).toLocaleString()}`,
						duration: 5000,
					});
				},
			);

			return () => {
				socket.off("meeting-scheduled");
				socket.disconnect();
			};
		}
	}, [user?.id]);

	return (
		<div className="flex min-h-screen bg-[#FDFDFF]">
			{/* Sidebar */}
			<aside className="w-72 bg-white border-r border-gray-100 p-6 flex flex-col sticky top-0 h-screen">
				<div className="flex items-center gap-3 mb-10 px-2">
					<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
						<Zap className="text-white" size={20} fill="white" />
					</div>
					<h2 className="text-xl font-bold tracking-tight text-gray-900 flex flex-col">
						<span>Sprintly<span className="text-indigo-600">.</span></span>
						<span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{user?.role} Workspace</span>
					</h2>
				</div>

				<nav className="flex flex-col gap-1 flex-1">
					<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">
						Main Menu
					</p>
					{sidebarLinks.map((link) => {
						const Icon = link.icon;
						return (
							<NavLink
								key={link.path}
								to={link.path}
								className={({ isActive }) =>
									`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
										? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
										: "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
									}`
								}
							>
								{/* Fixed the Icon className here */}
								{({ isActive }) => (
									<>
										<Icon
											size={20}
											className={
												isActive
													? "text-white"
													: "text-gray-500 group-hover:text-indigo-600"
											}
										/>
										<span className="font-semibold text-sm">{link.name}</span>
									</>
								)}
							</NavLink>
						);
					})}
				</nav>

				<div className="mt-auto space-y-2 pt-6 border-t border-gray-100">
					<NavLink
						to="/admin/settings"
						className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
					>
						<Settings size={20} />
						<span className="font-semibold text-sm">Settings</span>
					</NavLink>
					<button
						type="button"
						onClick={logout} // your existing logout hook
						className="flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
					>
						<LogOut size={20} />
						<span className="font-semibold text-sm">Logout</span>
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-8 lg:p-12 overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}
