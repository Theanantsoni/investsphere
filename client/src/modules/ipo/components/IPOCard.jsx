import React, { useState, useEffect } from "react";
import axios from "axios";
import IPOInvest from "./IPOInvest";
import API from "../../../config/api";

const IPOCard = ({ ipo }) => {
  const [watchLoading, setWatchLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [showInvest, setShowInvest] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
  });

  /* ================= USER ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("investsphere_user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchWatchlist(parsed.email);
    }
  }, []);

  /* ================= FETCH WATCHLIST ================= */

  const fetchWatchlist = async (email) => {
    try {
      const res = await axios.get(`${API}/api/watchlist/${email}`);

      if (res.data.success) {
        const codes = res.data.data.map((item) => String(item.itemCode));

        setWatchlist(codes);
      }
    } catch (error) {
      console.log("watchlist fetch error");
    }
  };

  /* ================= POPUP ================= */

  const showPopup = (title, message) => {
    setPopup({
      show: true,
      title,
      message,
    });
  };

  const closePopup = () => {
    setPopup({
      show: false,
      title: "",
      message: "",
    });
  };

  /* ================= FORMAT DATE ================= */

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date;
  };

  /* ================= FORMAT NUMBER ================= */

  const formatNumber = (num) => {
    if (!num) return "N/A";
    return Number(num).toLocaleString("en-IN");
  };

  /* ================= STATUS BADGE ================= */

  const badgeColor =
    ipo.status === "upcoming"
      ? "bg-blue-100 text-blue-700"
      : ipo.status === "ongoing"
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-700";

  /* ================= INVEST ================= */

  const handleInvestClick = () => {
    if (!user || !user.email) {
      showPopup("Login Required", "Please login to invest.");
      return;
    }

    setShowInvest(true);
  };

  const alreadyAdded = watchlist.includes(String(ipo.symbol));

  /* ================= ADD WATCHLIST ================= */

  const handleWatchlist = async () => {
    if (!user || !user.email) {
      showPopup(
        "Login Required",
        "Please login first to add this IPO to your watchlist.",
      );
      return;
    }

    if (alreadyAdded) {
      showPopup(
        "Already Added",
        "This IPO is already present in your watchlist.",
      );
      return;
    }

    try {
      setWatchLoading(true);

      const response = await axios.post(`${API}/api/watchlist/add`, {
        email: user.email,
        itemCode: String(ipo.symbol),
        itemName: ipo.name,
        type: "ipo",
      });

      if (response.data.success) {
        setWatchlist((prev) => [...prev, String(ipo.symbol)]);
        showPopup("Success", "IPO added to your watchlist successfully.");
      }
    } catch (error) {
      showPopup(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setWatchLoading(false);
    }
  };

  return (
    <>
      {/* ================= CARD ================= */}

      <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
        {/* Hover Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-green-50 via-transparent to-emerald-50 pointer-events-none"></div>

        <div className="relative z-10">
          {/* HEADER */}
          <h2 className="text-lg font-bold text-slate-800 group-hover:text-green-600 transition">
            {ipo.name}
          </h2>

          <p className="text-slate-400 text-sm mb-3">{ipo.exchange}</p>

          {/* DETAILS */}
          <div className="space-y-1 text-sm text-slate-700">
            <p>
              <b>Symbol:</b> {ipo.symbol}
            </p>
            <p>
              <b>Exchange:</b> {ipo.exchange}
            </p>
            <p>
              <b>Open Date:</b> {formatDate(ipo.openDate)}
            </p>
            <p>
              <b>Close Date:</b> {formatDate(ipo.closeDate)}
            </p>
            <p>
              <b>Issue Price:</b> ₹{ipo.price}
            </p>
            <p>
              <b>Shares Offered:</b> {formatNumber(ipo.numberOfShares)}
            </p>
            <p>
              <b>Total Value:</b> ₹ {formatNumber(ipo.totalSharesValue)}
            </p>
          </div>

          {/* STATUS */}
          <div className="mt-3">
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold ${badgeColor} capitalize`}
            >
              {ipo.status}
            </span>
          </div>
        </div>

        {/* ================= BUTTONS ================= */}

        {(ipo.status === "ongoing" || ipo.status === "upcoming") && (
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 mt-5">
            {/* INVEST BUTTON */}
            {ipo.status === "ongoing" && (
              <button
                onClick={handleInvestClick}
                className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-md"
              >
                Invest
              </button>
            )}

            {/* WATCHLIST */}
            {alreadyAdded ? (
              <button className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-medium cursor-default">
                Already in Watchlist
              </button>
            ) : (
              <button
                onClick={handleWatchlist}
                disabled={watchLoading}
                className="flex-1 border border-green-600 text-green-600 py-2.5 rounded-xl hover:bg-green-50 transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm"
              >
                {watchLoading ? "Adding..." : "Add to Watchlist"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= INVEST MODAL ================= */}
      {showInvest && (
        <IPOInvest ipo={ipo} user={user} onClose={() => setShowInvest(false)} />
      )}

      {/* ================= POPUP ================= */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {popup.title}
            </h3>

            <p className="text-gray-600 text-sm">{popup.message}</p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={closePopup}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IPOCard;
