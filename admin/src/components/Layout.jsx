// src/components/Layout.jsx

import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ======================================================
    FORCE DARK MODE
  ====================================================== */
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="flex flex-col flex-1 w-full min-w-0">
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="
          flex-1 overflow-y-auto p-4 md:p-6 lg:p-8
          bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950
          transition-all duration-300
        ">
          <div className="w-full max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;