// src/components/Header.jsx

import { Menu, Bell } from "lucide-react";

const Header = ({ user, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-[1600px] mx-auto">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 transition"
            onClick={onMenuClick}
          >
            <Menu size={20} className="text-gray-300" />
          </button>

          <div className="flex flex-col leading-tight">
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white">
              Admin Dashboard
            </h2>
            <span className="text-xs text-gray-400 hidden sm:block">
              Manage platform data & analytics
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification */}
          <button className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 transition shadow-sm">
            <Bell size={18} className="text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* USER */}
          <div className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-xl shadow-sm transition">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-200">
                {user?.name || "Admin"}
              </span>
              <span className="text-xs text-gray-400 truncate max-w-[140px]">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;