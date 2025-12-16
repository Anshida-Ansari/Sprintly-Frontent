import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Activity,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const sidebarLinks = [
  {
    name: "Dashboard",
    path: "/superadmin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Companies",
    path: "/superadmin/companies",
    icon: Building2,
  },
  {
    name: "Active Logs",
    path: "/superadmin/logs",
    icon: Activity,
  },
  {
    name: "Subscription Plans",
    path: "/superadmin/subscriptions",
    icon: CreditCard,
  },
  {
    name: "Settings",
    path: "/superadmin/settings",
    icon: Settings,
  },
];

export default function SuperAdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8 text-white">
          Sprintly <span className="text-indigo-400"></span>
        </h2>

        <nav className="flex flex-col gap-2 flex-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <NavLink
          to="/logout"
          className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-grey-700 text-white font-medium transition"
        >
          <LogOut size={20} />
          Logout
        </NavLink>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
