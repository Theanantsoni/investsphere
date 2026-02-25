import { Link } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-100 border-t border-gray-200 text-gray-600">
      
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/Images/6.png"
                alt="InvestSphere Logo"
                className="w-10 h-10"
              />
              <h3 className="text-gray-900 text-xl font-semibold">
                InvestSphere
              </h3>
            </div>

            <p className="text-sm leading-relaxed mb-6 text-gray-600">
              InvestSphere is a modern financial dashboard helping
              investors track markets, explore IPOs, analyze stocks
              and build long-term wealth confidently.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 text-lg text-gray-500">
              <a href="#" className="hover:text-indigo-600 transition">
                <FaLinkedin />
              </a>
              <a href="#" className="hover:text-indigo-600 transition">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-indigo-600 transition">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-indigo-600 transition">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-indigo-600 transition">Home</Link></li>
              <li><Link to="/ipo" className="hover:text-indigo-600 transition">IPO Dashboard</Link></li>
              <li><Link to="/stock" className="hover:text-indigo-600 transition">Stock Analysis</Link></li>
              <li><Link to="/sip" className="hover:text-indigo-600 transition">SIP Calculator</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600 transition">Create Account</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-indigo-600 transition">Market News</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition">Learning Center</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition">Financial Guides</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition">FAQs</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition">Help & Support</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-indigo-600 transition">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition">Terms & Conditions</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition">Disclaimer</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition">Risk Disclosure</Link></li>
            </ul>
          </div>

        </div>

        {/* DISCLAIMER */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-xs text-gray-500 leading-relaxed">
          Investments in securities market are subject to market risks.
          Read all related documents carefully before investing.
          InvestSphere does not provide investment advice.
          All information provided is for educational and informational purposes only.
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500 bg-slate-200">
        © {new Date().getFullYear()} InvestSphere. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
