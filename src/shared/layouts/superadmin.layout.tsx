import {
	Activity,
	Bell,
	Building2,
	CreditCard,
	LayoutDashboard,
	LogOut,
	Settings,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const sidebarLinks = [
	{ name: "Dashboard", path: "/superadmin/dashboard", icon: LayoutDashboard },
	{ name: "Companies", path: "/superadmin/companies", icon: Building2 },
	{ name: "Logs", path: "/superadmin/logs", icon: Activity },
	{ name: "Plans", path: "/superadmin/subscriptions", icon: CreditCard },
	{ name: "Settings", path: "/superadmin/settings", icon: Settings },
];

export default function SuperAdminLayout() {
	const logout = useLogout();
	return (
		<div className="min-h-screen bg-[#F8FAFC]">
			{/* Top Navbar */}
			<header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
					<div className="flex items-center gap-8">
						<h2 className="text-xl font-bold tracking-tight text-gray-900">
							Sprintly<span className="text-indigo-600">.</span>
						</h2>
						<nav className="hidden md:flex items-center gap-1">
							{sidebarLinks.map((link) => {
								const Icon = link.icon;
								return (
									<NavLink
										key={link.path}
										to={link.path}
										className={({ isActive }) =>
											`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
												isActive
													? "bg-indigo-50 text-indigo-700"
													: "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
											}`
										}
									>
										<Icon size={16} />
										{link.name}
									</NavLink>
								);
							})}
						</nav>
					</div>

					<div className="flex items-center gap-4">
						<button className="p-2 text-gray-400 hover:text-gray-600">
							<Bell size={20} />
						</button>
						<div className="h-8 w-px bg-gray-200 mx-2" />
						<button
							onClick={logout}
							className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
						>
							<LogOut size={18} />
							<span className="hidden sm:inline">Logout</span>
						</button>
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="mx-auto max-w-7xl p-6 lg:p-10">
				<Outlet />
			</main>
		</div>
	);
}
