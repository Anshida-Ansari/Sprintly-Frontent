import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Box,
  Zap,
  MessagesSquare,
  BarChart3,
  UserCircle,
  LogOut,
  Cpu,
  Terminal
} from "lucide-react";
import { useLogout } from "../hooks/useLogout";

const sidebarLinks = [
  { name: "Dashboard", path: "/developers/dashboard", icon: LayoutDashboard },
  { name: "My Tasks", path: "/developers/tasks", icon: CheckSquare },
  { name: "Projects", path: "/developers/projects", icon: Box },
  { name: "Sprints", path: "/developers/sprints", icon: Zap },
  { name: "Standups", path: "/developers/standups", icon: MessagesSquare },
  { name: "Performance", path: "/developers/performance", icon: BarChart3 },
  { name: "Profile", path: "/developers/profile", icon: UserCircle },

];

export default function DeveloperLayout() {
  const logout = useLogout()
  return (
    <div className="flex min-h-screen bg-[#050507] text-gray-400 font-sans selection:bg-indigo-500/30">

      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/[0.05] flex flex-col sticky top-0 h-screen bg-[#08080A]">

        {/* Logo Area */}
        <div className="p-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center">
              <Terminal size={20} className="text-white" />
            </div>
            <div className="hidden lg:block">
              <span className="text-white font-black tracking-tighter text-xl block leading-none">Sprintly</span>
              <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase tracking-widest">Dev_Core</span>
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
                    ? "bg-white/[0.03] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                    : "hover:bg-white/[0.02] hover:text-gray-200"
                  }`
                }
              >
                <Icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden lg:block font-semibold text-sm tracking-tight">{link.name}</span>

                {/* Neon Active Pill */}
                <div className="hidden lg:group-[.active]:block ml-auto">
                  <div className="w-1 h-5 bg-indigo-500 rounded-full shadow-[0_0_12px_#6366f1]" />
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-rose-500/80 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all group text-left"
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="hidden lg:block font-bold text-sm">
            Terminate
          </span>
        </button>

      </aside>

      {/* Main Stage */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="p-8 lg:p-12 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}