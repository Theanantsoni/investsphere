import { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp, BarChart3, Landmark, Star, Lock } from "lucide-react";
import { Link } from "react-router-dom";

import StockWatchlist from "../components/StockWatchlist";
import SipWatchlist from "../components/SipWatchlist";
import IpoWatchlist from "../components/IpoWatchlist";

const WatchlistPage = () => {
  const [active, setActive] = useState("stock");
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  /* ================= CHECK LOGIN ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("investsphere_user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      fetchWatchlist(parsed.email);
    } else {
      setLoading(false);
    }
  }, []);

  /* ================= FETCH WATCHLIST ================= */

  const fetchWatchlist = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/watchlist/${email}`,
      );

      if (res.data.success) {
        setWatchlist(res.data.data);
      }
    } catch (err) {
      console.log("watchlist fetch error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REMOVE WATCHLIST ================= */

  const removeWatchlist = async (itemCode) => {
    try {
      await axios.delete("http://localhost:5000/api/watchlist/remove", {
        data: {
          email: user.email,
          itemCode,
        },
      });

      setWatchlist((prev) => prev.filter((item) => item.itemCode !== itemCode));
    } catch (error) {
      console.log("remove error");
    }
  };

  const stock = watchlist.filter((item) => item.type === "stock");
  const sip = watchlist.filter((item) => item.type === "sip");
  const ipo = watchlist.filter((item) => item.type === "ipo");

  /* ================= NOT LOGGED IN UI ================= */

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-6">
        <div className="bg-white border rounded-2xl shadow-lg p-10 max-w-lg text-center">
          <Lock className="mx-auto text-blue-600 mb-4" size={40} />

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Required
          </h2>

          <p className="text-gray-500 mb-6">
            Please login to access your personalised watchlist.
          </p>

          {/* FEATURES */}

          <div className="text-left bg-gray-50 border rounded-xl p-5 mb-6 space-y-2 text-sm">
            <p className="font-semibold text-gray-700 mb-2">
              What you can do after login:
            </p>

            <p>⭐ Save favourite Stocks</p>
            <p>📈 Track SIP Mutual Funds</p>
            <p>🏛 Follow Upcoming IPOs</p>
            <p>⚡ Quick access to investments</p>
            <p>🔔 Monitor market opportunities</p>
          </div>

          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  /* ================= MAIN PAGE ================= */

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}

      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Star className="text-yellow-500" />
            Your Watchlist
          </h1>

          <p className="text-gray-500 mt-2">
            Track your favourite Stocks, SIP funds and IPOs.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* SWITCHER */}

        <div className="flex gap-4 mb-10 flex-wrap">
          <button
            onClick={() => setActive("stock")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition ${
              active === "stock"
                ? "bg-blue-600 text-white shadow"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            <BarChart3 size={18} />
            Stock Watchlist
          </button>

          <button
            onClick={() => setActive("sip")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition ${
              active === "sip"
                ? "bg-green-600 text-white shadow"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            <TrendingUp size={18} />
            SIP Watchlist
          </button>

          <button
            onClick={() => setActive("ipo")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition ${
              active === "ipo"
                ? "bg-purple-600 text-white shadow"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            <Landmark size={18} />
            IPO Watchlist
          </button>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-center py-20 text-gray-400">
            Loading Watchlist...
          </div>
        )}

        {/* STOCK */}

        {!loading && active === "stock" && (
          <StockWatchlist data={stock} removeWatchlist={removeWatchlist} />
        )}

        {/* SIP */}

        {!loading && active === "sip" && (
          <SipWatchlist data={sip} removeWatchlist={removeWatchlist} />
        )}

        {/* IPO */}

        {!loading && active === "ipo" && (
          <IpoWatchlist data={ipo} removeWatchlist={removeWatchlist} />
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
