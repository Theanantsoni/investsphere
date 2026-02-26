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
    { name: "Stock", path: "/stock", icon: <BarChart3 size={18} /> },
    { name: "IPO", path: "/ipo", icon: <Landmark size={18} /> },
    { name: "Market News", path: "/market-news", icon: <Newspaper size={18} /> },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/Images/7.png"
          alt="InvestSphere Logo"
          className="w-12 h-12 md:w-14 md:h-14 object-contain"
        />
        <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
          Invest<span className="text-blue-600">Sphere</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 transition ${
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

      {/* Auth Buttons (Desktop) */}
      <div className="hidden md:flex items-center gap-5 text-sm font-medium">
        <Link
          to="/login"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <LogIn size={16} />
          Login
        </Link>
        <Link
          to="/register"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus size={16} />
          Register
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md flex flex-col items-center gap-6 py-6 md:hidden animate-fade-in">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 text-lg ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

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
      )}
    </nav>
  );
};

export default Navbar;