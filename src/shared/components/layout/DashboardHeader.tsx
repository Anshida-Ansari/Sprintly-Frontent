import React from "react";
import { NotificationBell } from "../notifications/NotificationBell";
import { UserAuth } from "../../../modules/auth/store/store";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  const user = UserAuth((state) => state.user);

  return (
    <header className="flex flex-row items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top-2 duration-500 sticky top-0 z-50 bg-white/80 backdrop-blur-xl py-4 -mt-4 mb-10 border-b border-gray-100/50">
      <div className="flex flex-col min-w-[100px]">
        {title ? (
          <>
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-gray-400 font-medium text-[10px] tracking-widest uppercase mt-1 ml-4 opacity-70">
                {subtitle}
              </p>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Workspace</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* User Info - Integrated Style */}
        <div className="hidden sm:flex flex-col items-end px-3 py-1.5 border border-gray-100 rounded-2xl bg-gray-50/50 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:shadow-md cursor-default">
            <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{user?.name}</span>
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest leading-none mt-0.5">
              {user?.role}
            </span>
        </div>
        
        <div className="h-8 w-[1px] bg-gray-100 hidden sm:block mx-1" />
        
        <div className="flex items-center gap-2">
          <NotificationBell />
          
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 p-[2px] shadow-lg shadow-indigo-100 group-hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                <span className="text-indigo-600 font-black text-sm">
                  {user?.name.charAt(0)}
                </span>
              </div>
            </div>
            {/* Online Indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  );
};
