import { useState, useEffect } from "react";
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
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  /* ================= CHECK LOGIN ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("investsphere_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("investsphere_user");
    setUser(null);
    navigate("/login");
  };

  /* ================= NAV ITEMS ================= */

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "SIP", path: "/sip", icon: <TrendingUp size={18} /> },
    { name: "Stocks", path: "/stock", icon: <BarChart3 size={18} /> },
    { name: "IPO", path: "/ipo", icon: <Landmark size={18} /> },
    { name: "Watchlist", path: "/watchlist", icon: <Star size={18} /> },
    {
      name: "Market News",
      path: "/market-news",
      icon: <Newspaper size={18} />,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* ================= LOGO ================= */}

        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/Images/7.png"
            alt="InvestSphere Logo"
            className="w-11 h-11 md:w-12 md:h-12 object-contain group-hover:scale-105 transition"
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

              {/* animated underline */}

              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          ))}
        </div>

        {/* ================= AUTH AREA ================= */}

        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <User size={18} />

                <span>
                  Welcome,{" "}
                  <span className="text-blue-600 font-semibold">
                    {user.name}
                  </span>
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-sm hover:scale-[1.03] active:scale-95"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm hover:scale-[1.03] active:scale-95"
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

      {/* ================= MOBILE MENU ================= */}

      <div
        className={`fixed top-0 right-0 h-full w-[260px] bg-white shadow-xl transform transition-transform duration-300 z-50 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <span className="font-bold text-lg">Menu</span>

          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 text-lg transition ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

          {/* MOBILE AUTH */}

          <div className="border-t pt-5">
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition w-full"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <LogIn size={18} />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ================= OVERLAY ================= */}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
