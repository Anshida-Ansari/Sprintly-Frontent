import { NavLink, Outlet } from "react-router-dom";

const sidebarLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Projects", path: "/admin/projects" },
    { name: "Members", path: "/admin/members" },
    { name: "Sprints", path: "/admin/sprints" },
    { name: "User Stories", path: "/admin/user-stories" },
    { name: "Team", path: "/admin/team" },
    { name: "Meetings", path: "/admin/meetings" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-600 text-white p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-8">Sprintly Admin</h2>

                <nav className="flex flex-col gap-3 flex-1">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-md transition-all ${isActive
                                    ? "bg-white text-indigo-600 font-semibold"
                                    : "hover:bg-indigo-500"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <NavLink
                    to="/admin/logout"
                    className="mt-6 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-center font-medium"
                >
                    Logout
                </NavLink>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100">
                <Outlet />
            </main>
        </div>
    );
}
