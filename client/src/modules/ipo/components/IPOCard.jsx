import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const IPOCard = ({ ipo }) => {

  const navigate = useNavigate();

  const [watchLoading, setWatchLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [watchlist, setWatchlist] = useState([]);

  const [popup, setPopup] = useState({
    show: false,
    message: ""
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

      const res = await axios.get(
        `http://localhost:5000/api/watchlist/${email}`
      );

      if (res.data.success) {

        const codes = res.data.data.map(item => String(item.itemCode));

        setWatchlist(codes);

      }

    } catch (error) {

      console.log("watchlist fetch error");

    }

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

  /* ================= APPLY ================= */

  const handleApply = () => {

    navigate(`/ipo/apply/${ipo.symbol}`);

  };

  const alreadyAdded = watchlist.includes(String(ipo.symbol));

  /* ================= ADD WATCHLIST ================= */

  const handleWatchlist = async () => {

    if (!user) {

      setPopup({
        show: true,
        message: "Please login first to add watchlist"
      });

      return;

    }

    if (alreadyAdded) return;

    try {

      setWatchLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/watchlist/add",
        {
          email: user.email,
          itemCode: String(ipo.symbol),
          itemName: ipo.name,
          type: "ipo"
        }
      );

      if (response.data.success) {

        setWatchlist(prev => [...prev, String(ipo.symbol)]);

        setPopup({
          show: true,
          message: "IPO added to watchlist"
        });

      }

    } catch (error) {

      setPopup({
        show: true,
        message: error.response?.data?.message || "Something went wrong"
      });

    } finally {

      setWatchLoading(false);

    }

  };

  /* ================= CLOSE POPUP ================= */

  const closePopup = () => {

    setPopup({
      show: false,
      message: ""
    });

  };

  return (
    <>
      {/* ================= CARD ================= */}

      <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">

        {/* Glow */}

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-green-50 via-transparent to-emerald-50 pointer-events-none"></div>

        <div className="relative z-10">

          {/* HEADER */}

          <h2 className="text-lg font-bold text-slate-800 group-hover:text-green-600 transition">
            {ipo.name}
          </h2>

          <p className="text-slate-400 text-sm mb-3">
            {ipo.exchange}
          </p>

          {/* DETAILS */}

          <div className="space-y-1 text-sm text-slate-700">

            <p><b>Symbol:</b> {ipo.symbol}</p>

            <p><b>Exchange:</b> {ipo.exchange}</p>

            <p><b>Open Date:</b> {formatDate(ipo.openDate)}</p>

            <p><b>Close Date:</b> {formatDate(ipo.closeDate)}</p>

            <p><b>Issue Price:</b> {ipo.price}</p>

            <p><b>Shares Offered:</b> {formatNumber(ipo.numberOfShares)}</p>

            <p><b>Total Value:</b> ₹ {formatNumber(ipo.totalSharesValue)}</p>

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

            {/* APPLY */}

            {ipo.status === "ongoing" && (

              <button
                onClick={handleApply}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-md"
              >
                Apply Now
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

      {/* ================= POPUP ================= */}

      {popup.show && (

        <div
          onClick={closePopup}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-sm text-center transform transition-all duration-300 scale-100"
          >

            <h3 className="text-lg font-semibold mb-4">
              InvestSphere
            </h3>

            <p className="text-gray-600 mb-6">
              {popup.message}
            </p>

            <button
              onClick={closePopup}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              OK
            </button>

          </div>

        </div>

      )}

    </>
  );
};

export default IPOCard;