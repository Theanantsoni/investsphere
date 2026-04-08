import { useState, useEffect, useRef } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Home,
  TrendingUp,
  BarChart3,
  Landmark,
  Newspaper,
  Star,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Settings,
  Flag,
  Briefcase,
  Bell,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  /* ================= USER STATE ================= */
  useEffect(() => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("investsphere_user")
      );

      if (storedUser?.email) {
        setUser(storedUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("investsphere_user");
    navigate("/login");
  };

  /* ================= NAV ITEMS ================= */
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={18} className="text-indigo-500" />,
    },
    {
      name: "SIP",
      path: "/sip",
      icon: <TrendingUp size={18} className="text-green-500" />,
    },
    {
      name: "Stocks",
      path: "/stock",
      icon: <BarChart3 size={18} className="text-yellow-500" />,
    },
    {
      name: "IPO",
      path: "/ipo",
      icon: <Landmark size={18} className="text-purple-500" />,
    },
    {
      name: "Portfolio",
      path: "/portfolio",
      icon: <Briefcase size={18} className="text-blue-600" />,
    },
    {
      name: "Watchlist",
      path: "/watchlist",
      icon: <Star size={18} className="text-pink-500" />,
    },
    {
      name: "Market News",
      path: "/market-news",
      icon: <Newspaper size={18} className="text-orange-500" />,
    },
  ];

  /* ================= PROFILE IMAGE ================= */
  const profileImage =
    user?.profileImage ||
    `https://ui-avatars.com/api/?name=${user?.name || "User"}`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/Images/7.png"
            alt="InvestSphere Logo"
            className="w-11 h-11 object-contain group-hover:scale-105 transition"
          />
          <span className="text-xl md:text-2xl font-bold text-gray-800">
            Invest<span className="text-blue-600">Sphere</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 transition ${
                  isActive
                    ? "text-blue-600"
                    : "hover:text-blue-600"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden md:flex items-center gap-5 relative" ref={dropdownRef}>

          {/* 🔔 ALERT ICON */}
          {user && (
            <button
              onClick={() => navigate("/alerts")}
              className="relative"
            >
              <Bell
                size={20}
                className="text-red-500 hover:scale-110 transition"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>
          )}

          {/* PROFILE */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-500">Welcome</p>
                  <p className="font-semibold text-gray-800">
                    {user.name}
                  </p>
                </div>

                <img
                  src={profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white border shadow-xl rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b bg-gray-50">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex gap-3 px-5 py-3 hover:bg-gray-50"
                  >
                    <User size={18} className="text-blue-500" />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex gap-3 px-5 py-3 hover:bg-gray-50"
                  >
                    <Settings size={18} className="text-gray-600" />
                    Settings
                  </Link>

                  <Link
                    to="/send-report"
                    className="flex gap-3 px-5 py-3 hover:bg-gray-50"
                  >
                    <Flag size={18} className="text-orange-500" />
                    Send Report
                  </Link>

                  <div className="border-t" />

                  <button
                    onClick={logout}
                    className="flex gap-3 px-5 py-3 hover:bg-red-50 text-red-600 w-full"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              <LogIn size={16} />
              Login
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 text-gray-700"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          <Link
            to="/alerts"
            className="flex items-center gap-3 text-red-500"
          >
            <Bell size={18} />
            Alerts
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;