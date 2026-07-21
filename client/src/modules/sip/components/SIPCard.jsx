import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import SIPInvest from "./SIPInvest";
import {
  getFundMinSip,
  getFundCategory,
  getFundRisk,
} from "../utils/sipUtils";

import API from "../../../config/api";

const SIPCard = ({ fund, watchlist = [], setWatchlist, user }) => {
  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [watchLoading, setWatchLoading] = useState(false);
  const [showInvest, setShowInvest] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
  });

  /* ================= FUND DATA ================= */

  const schemeCode = fund?.schemeCode ?? fund?.scheme_code;
  const schemeName = fund?.schemeName ?? fund?.scheme_name;

  if (!schemeCode) return null;

  const fundMinSip = getFundMinSip(schemeCode);
  const fundCategory = getFundCategory(schemeName);
  const fundRisk = getFundRisk(schemeName);

  /* ================= USER ================= */

  const loggedUser =
    user || JSON.parse(localStorage.getItem("investsphere_user") || "null");

  const email = loggedUser?.email || "";

  const username =
    loggedUser?.name ||
    loggedUser?.username ||
    loggedUser?.email ||
    "User";

  const alreadyAdded = watchlist.includes(String(schemeCode));

  /* ================= POPUP ================= */

  const showPopup = (title, message) => {
    setPopup({ show: true, title, message });
  };

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "" });
  };

  /* ================= WATCHLIST ================= */

  const handleWatchlist = async () => {
    if (!email) {
      showPopup("Login Required", "Please login first.");
      return;
    }

    if (alreadyAdded) {
      showPopup("Already Added", "Already in watchlist.");
      return;
    }

    try {
      setWatchLoading(true);

      const res = await axios.post(
        `${API}/watchlist/add`,
        {
          email,
          itemCode: String(schemeCode),
          itemName: schemeName,
          type: "sip",
        }
      );

      if (res?.data?.success) {
        if (!watchlist.includes(String(schemeCode))) {
          setWatchlist((prev) => [...prev, String(schemeCode)]);
        }

        showPopup("Success", "Added to watchlist.");

        setTimeout(() => {
          closePopup();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      showPopup("Error", "Failed to add.");
    } finally {
      setWatchLoading(false);
    }
  };

  /* ================= VIEW DETAILS ================= */

  const handleViewDetails = () => {
    if (!email) {
      showPopup("Login Required", "Please login first.");
      return;
    }

    navigate(`/sip/${schemeCode}`);
  };

  /* ================= INVEST ================= */

  const handleInvestClick = () => {
    if (!email) {
      showPopup("Login Required", "Please login to invest.");
      return;
    }

    setShowInvest(true);
  };

  /* ================= RISK STYLE ================= */

  const getRiskStyle = () => {
    if (fundRisk === "Low") return "bg-green-100 text-green-700";
    if (fundRisk === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  /* ================= UI ================= */

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">

        <div>
          {/* HEADER */}
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-lg font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-green-600 transition">
              {schemeName}
            </h2>

            <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
              SIP
            </span>
          </div>

          <p className="text-sm text-slate-400 mt-2">
            Scheme Code: {schemeCode}
          </p>

          <div className="my-5 border-t border-slate-100"></div>

          {/* DETAILS */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Category</span>
              <span className="font-medium text-slate-800">
                {fundCategory}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Min SIP</span>
              <span className="font-semibold text-slate-900">
                ₹{fundMinSip.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Risk</span>
              <span
                className={`px-2 py-1 text-xs rounded-md font-semibold ${getRiskStyle()}`}
              >
                {fundRisk}
              </span>
            </div>
          </div>
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="mt-6 grid grid-cols-3 gap-3">

          {/* WATCHLIST */}
          {alreadyAdded ? (
            <button
              disabled
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium cursor-not-allowed"
            >
              Added
            </button>
          ) : (
            <button
              onClick={handleWatchlist}
              disabled={watchLoading}
              className="w-full border border-green-500 text-green-600 py-2.5 rounded-xl text-sm font-medium hover:bg-green-50 transition"
            >
              {watchLoading ? "Adding..." : "Watchlist"}
            </button>
          )}

          {/* DETAILS */}
          <button
            onClick={handleViewDetails}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            Details
          </button>

          {/* INVEST */}
          <button
            onClick={handleInvestClick}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            Invest
          </button>
        </div>
      </div>

      {/* ================= INVEST MODAL ================= */}
      {showInvest && (
        <SIPInvest
          fund={fund}
          user={{ email, name: username }}
          onClose={() => setShowInvest(false)}
        />
      )}

      {/* ================= POPUP ================= */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 animate-[fadeIn_.25s_ease]">

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg ${
                  popup.title === "Error"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {popup.title === "Error" ? "!" : "✓"}
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                {popup.title}
              </h3>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {popup.message}
            </p>

            <div className="flex justify-end">
              <button
                onClick={closePopup}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition"
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

export default SIPCard;