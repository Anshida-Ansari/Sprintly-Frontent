import React from "react";
import { NotificationBell } from "../notifications/NotificationBell";
import { UserAuth } from "../../../modules/auth/store/store";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  const user = UserAuth((state) => state.user);

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">
            {title}
          </h1>
        </div>
        {subtitle ? (
          <p className="text-gray-400 font-medium text-sm tracking-wide ml-4.5">
            {subtitle}
          </p>
        ) : (
          <p className="text-gray-400 font-medium text-sm tracking-wide ml-4.5">
            Welcome back, <span className="text-indigo-600 font-bold font-mono tracking-tighter">@{user?.name.split(" ")[0].toLowerCase()}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 ml-auto lg:ml-0">
        <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">{user?.name}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5 px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200">{user?.role}</span>
        </div>
        
        <div className="h-10 w-[1px] bg-gray-100 hidden md:block" />
        
        <NotificationBell />
        
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-50 group hover:border-indigo-200 transition-all cursor-pointer">
          <span className="text-indigo-600 font-black text-lg group-hover:scale-110 transition-transform">
            {user?.name.charAt(0)}
          </span>
        </div>
      </div>
    </header>
  );
};
