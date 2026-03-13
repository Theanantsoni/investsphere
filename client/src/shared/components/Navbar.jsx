import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const dropdownRef = useRef();

  /* ================= CHECK LOGIN ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("investsphere_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "SIP", path: "/sip", icon: <TrendingUp size={18} /> },
    { name: "Stocks", path: "/stock", icon: <BarChart3 size={18} /> },
    { name: "IPO", path: "/ipo", icon: <Landmark size={18} /> },
    { name: "Watchlist", path: "/watchlist", icon: <Star size={18} /> },
    { name: "Market News", path: "/market-news", icon: <Newspaper size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* ================= LOGO ================= */}

        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/Images/7.png"
            alt="InvestSphere Logo"
            className="w-11 h-11 object-contain group-hover:scale-105 transition"
          />

          <span className="text-xl md:text-2xl font-bold tracking-wide text-gray-800">
            Invest<span className="text-blue-600">Sphere</span>
          </span>
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-2 transition duration-300 group ${
                  isActive ? "text-blue-600" : "hover:text-blue-600"
                }`
              }
            >
              <span className="group-hover:scale-110 transition">
                {item.icon}
              </span>

              {item.name}

              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          ))}
        </div>

        {/* ================= PROFILE SECTION ================= */}

        <div className="hidden md:flex items-center gap-6 relative" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              {/* PROFILE BUTTON */}

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
              >
                <div className="text-right">
                  <p className="text-sm text-gray-500">Welcome</p>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {user.name?.charAt(0)}
                </div>
              </button>

              {/* DROPDOWN */}

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden animate-fade">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition text-gray-700"
                  >
                    <User size={18} />
                    Check Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition text-gray-700"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>

                  <Link
  to="/send-report"
  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition text-gray-700"
>
  <Flag size={18} />
  Send Report
</Link>

                  <div className="border-t" />

                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 transition w-full text-left"
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
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <LogIn size={16} />
              Login
            </Link>
          )}
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 hover:scale-110 transition"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;