import { NavLink } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  TrendingUp,
  FileText,
  Wallet,
  Activity,
  Eye,
  Bell,
  X,
  LogOut,
  Send, // ✅ NEW ICON
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Users", path: "/users", icon: Users },
  { name: "Stocks", path: "/stocks", icon: BarChart3 },
  { name: "SIP", path: "/sip", icon: TrendingUp },
  { name: "IPO", path: "/ipo", icon: FileText },
  { name: "Transactions", path: "/transactions", icon: Activity },
  { name: "Wallets", path: "/wallets", icon: Wallet },
  { name: "Watchlist", path: "/watchlist", icon: Eye },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Send Messages", path: "/send-messages", icon: Send }, // ✅ NEW MENU
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:inset-0 flex flex-col shadow-2xl`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src="/images/4.png"
              alt="logo"
              className="h-auto w-auto max-h-10 object-contain"
            />

            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-wide">
              InvestSphere
            </h1>
          </div>

          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} className="text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon
                  size={18}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-all duration-200 px-4 py-3 rounded-xl text-sm font-medium shadow-lg shadow-red-600/20 active:scale-95"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;