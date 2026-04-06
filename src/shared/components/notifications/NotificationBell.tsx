import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotificationStore } from "../../../stores/useNotificationStore";
import { NotificationDropdown } from "./NotificationDropdown";

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-2xl transition-all duration-300 relative group border-2 ${
          isOpen 
            ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
            : "bg-white border-gray-100/50 text-gray-500 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-900"
        }`}
      >
        <Bell 
          size={22} 
          className={`transition-transform duration-300 ${isOpen ? "scale-110" : "group-hover:rotate-12"}`} 
        />
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-indigo-600 text-white text-[10px] font-black items-center justify-center border-2 border-white shadow-lg">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
