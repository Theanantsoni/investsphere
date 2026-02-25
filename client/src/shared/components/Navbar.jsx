import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-10 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/Images/7.png"
          alt="InvestSphere Logo"
          className="w-16 h-16 object-contain"
        />
        <span className="text-2xl font-bold text-gray-800 tracking-wide">
          Invest<span className="text-blue-600">Sphere</span>
        </span>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-8 font-medium text-gray-700">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          Home
        </NavLink>

        <NavLink
          to="/sip"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          SIP
        </NavLink>

        <NavLink
          to="/stock"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          Stock
        </NavLink>

        <NavLink
          to="/ipo"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          IPO
        </NavLink>

        {/* NEW PAGE */}
        <NavLink
          to="/market-news"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          Market News
        </NavLink>
      </div>

      {/* Auth */}
      <div className="flex items-center gap-5 text-sm font-medium">
        <Link
          to="/login"
          className="text-gray-600 hover:text-blue-600 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

const activeClass = "text-blue-600 border-b-2 border-blue-600 pb-1";
const normalClass = "hover:text-blue-600 transition";

export default Navbar;
