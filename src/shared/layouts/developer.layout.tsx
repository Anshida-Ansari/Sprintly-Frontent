// shared/layouts/DeveloperLayout.tsx
import { NavLink, Outlet } from "react-router-dom";

const sidebarLinks = [
  { name: "Dashboard", path: "/developers/dashboard" },
  { name: "My Tasks", path: "/developers/tasks" },
  { name: "Projects", path: "/developers/projects" },
  { name: "Sprints", path: "/developers/sprints" },
  { name: "Standups", path: "/developers/standups" },
  { name: "Performance", path: "/developers/performance" },
  { name: "Profile", path: "/developers/profile" },
  { name: "Logout", path: "/developers/Logout" },
];

export default function DeveloperLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-6 border-b border-indigo-600">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">&lt;/&gt;</span> Sprintly
          </h2>
          <p className="text-indigo-200 text-sm mt-1">Developer Portal</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition-all font-medium ${
                      isActive
                        ? "bg-white text-indigo-700 shadow-md"
                        : "hover:bg-indigo-600"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-indigo-600">
          <NavLink
            to="/logout"
            className="block px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-center font-medium transition"
          >
            Logout
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}