import {
	BarChart3,
	Box,
	CheckSquare,
	Kanban,
	LayoutDashboard,
	LogOut,
	MessagesSquare,
	Terminal,
	UserCircle,
	Video,
	Zap,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const sidebarLinks = [
	{ name: "Dashboard", path: "/developers/dashboard", icon: LayoutDashboard },
	{ name: "Kanban Board", path: "/developers/kanban", icon: Kanban },
	{ name: "My Tasks", path: "/developers/tasks", icon: CheckSquare },
	{ name: "Projects", path: "/developers/projects", icon: Box },
	{ name: "Sprints", path: "/developers/sprints", icon: Zap },
	{ name: "Standups", path: "/developers/standups", icon: MessagesSquare },
	{ name: "Meetings", path: "/developers/meetings", icon: Video },
	{ name: "Performance", path: "/developers/performance", icon: BarChart3 },
	{ name: "Profile", path: "/developers/profile", icon: UserCircle },
];

export default function DeveloperLayout() {
	const logout = useLogout();
	return (
		<div className="flex min-h-screen bg-slate-50 text-gray-600 font-sans selection:bg-indigo-100">
			{/* Sidebar */}
			<aside className="w-20 lg:w-64 border-r border-gray-200 flex flex-col sticky top-0 h-screen bg-white">
				{/* Logo Area */}
				<div className="p-6 mb-4">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center">
							<Terminal size={20} className="text-white" />
						</div>
						<div className="hidden lg:block">
							<span className="text-gray-900 font-black tracking-tighter text-xl block leading-none">
								Sprintly
							</span>
							<span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest">
								Dev_Core
							</span>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
					{sidebarLinks.map((link) => {
						const Icon = link.icon;
						return (
							<NavLink
								key={link.path}
								to={link.path}
								className={({ isActive }) =>
									`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${isActive
										? "bg-indigo-50 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-100"
										: "hover:bg-gray-50 hover:text-gray-900 font-medium"
									}`
								}
							>
								<Icon
									size={20}
									className={`transition-transform duration-300 group-hover:scale-110 ${({ isActive }: { isActive: boolean }) => isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
										}`}
								/>
								<span className="hidden lg:block text-sm tracking-tight">
									{link.name}
								</span>

								{/* Active Indicator */}
								<div className="hidden lg:group-[.active]:block ml-auto opacity-0 group-[.active]:opacity-100 transition-opacity">
									<div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
								</div>
							</NavLink>
						);
					})}
				</nav>

				{/* Footer / Logout */}
				<button
					type="button"
					onClick={logout}
					className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all group text-left mt-auto mb-2 mx-2 max-w-[calc(100%-16px)]"
				>
					<LogOut
						size={20}
						className="group-hover:-translate-x-1 transition-transform"
					/>
					<span className="hidden lg:block font-bold text-sm">Sign Out</span>
				</button>
			</aside>

			{/* Main Stage */}
			<main className="flex-1 overflow-y-auto relative">
				<div className="p-8 lg:p-12 relative z-10 max-w-[1600px] mx-auto">
					<Outlet />
				</div>
			</main>
		</div>
	);
}

