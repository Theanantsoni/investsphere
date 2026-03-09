import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  TrendingUp,
  BarChart3,
  Landmark,
  Newspaper,
  Menu,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "SIP", path: "/sip", icon: <TrendingUp size={18} /> },
    { name: "Stocks", path: "/stock", icon: <BarChart3 size={18} /> },
    { name: "IPO", path: "/ipo", icon: <Landmark size={18} /> },
    { name: "Market News", path: "/market-news", icon: <Newspaper size={18} /> },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100">

      {/* ================= LOGO ================= */}

      <Link to="/" className="flex items-center gap-3">

        <img
          src="/Images/7.png"
          alt="InvestSphere Logo"
          className="w-11 h-11 md:w-13 md:h-13 object-contain"
        />

        <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
          Invest<span className="text-blue-600">Sphere</span>
        </span>

      </Link>

      {/* ================= DESKTOP NAV ================= */}

      <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 transition duration-200 ${
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                  : "hover:text-blue-600"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}

      </div>

      {/* ================= AUTH BUTTONS ================= */}

      <div className="hidden md:flex items-center gap-4 text-sm font-medium">

        <Link
          to="/login"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <LogIn size={16} />
          Login
        </Link>

        <Link
          to="/register"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <UserPlus size={16} />
          Register
        </Link>

      </div>

      {/* ================= MOBILE MENU BUTTON ================= */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-gray-700"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* ================= MOBILE MENU ================= */}

      <div
        className={`fixed top-0 right-0 h-full w-[260px] bg-white shadow-xl transform transition-transform duration-300 z-50 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >

        <div className="flex justify-between items-center p-5 border-b">

          <span className="font-bold text-lg">
            Menu
          </span>

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

          <div className="border-t pt-5 flex flex-col gap-4">

            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
            >
              <LogIn size={18} />
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <UserPlus size={18} />
              Register
            </Link>

          </div>

        </div>

      </div>

      {/* ================= MOBILE OVERLAY ================= */}

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