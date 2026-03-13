import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { getFundMinSip, getFundCategory, getFundRisk } from "../utils/sipUtils";

const SIPCard = ({ fund, watchlist, setWatchlist, user }) => {
  const navigate = useNavigate();

  const [watchLoading, setWatchLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
  });

  const schemeCode = fund?.schemeCode ?? fund?.scheme_code;
  const schemeName = fund?.schemeName ?? fund?.scheme_name;

  if (!schemeCode) return null;

  const fundMinSip = getFundMinSip(schemeCode);
  const fundCategory = getFundCategory(schemeName);
  const fundRisk = getFundRisk(schemeName);

  const alreadyAdded = watchlist.includes(String(schemeCode));

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

  /* ================= ADD WATCHLIST ================= */

  const handleWatchlist = async () => {
    if (!user || !user.email) {
      showPopup(
        "Login Required",
        "Please login to add this fund to your watchlist.",
      );
      return;
    }

    if (alreadyAdded) return;

    try {
      setWatchLoading(true);

      const res = await axios.post("http://localhost:5000/api/watchlist/add", {
        email: user.email,
        itemCode: String(schemeCode),
        itemName: schemeName,
        type: "sip",
      });

      if (res.data.success) {
        setWatchlist((prev) => [...prev, String(schemeCode)]);

        showPopup(
          "Added Successfully",
          "This fund has been added to your watchlist.",
        );
      }
    } catch (error) {
      console.error("Watchlist error:", error);

      showPopup(
        "Error",
        "Something went wrong while adding the fund to watchlist.",
      );
    } finally {
      setWatchLoading(false);
    }
  };

  /* ================= VIEW DETAILS ================= */

  const handleViewDetails = () => {
    if (!user || !user.email) {
      showPopup(
        "Login Required",
        "Please login to view detailed information about this fund.",
      );
      return;
    }

    navigate(`/sip/${schemeCode}`);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        {/* HEADER */}

        <div>
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
              <span className="font-medium text-slate-800">{fundCategory}</span>
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
                className={`px-2 py-1 text-xs rounded-md font-semibold ${
                  fundRisk === "Low"
                    ? "bg-green-100 text-green-700"
                    : fundRisk === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {fundRisk}
              </span>
            </div>
          </div>
        </div>

        {/* BUTTONS */}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {alreadyAdded ? (
            <button className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-medium cursor-default">
              Already in Watchlist
            </button>
          ) : (
            <button
              onClick={handleWatchlist}
              disabled={watchLoading}
              className="flex-1 border border-green-500 text-green-600 py-2.5 rounded-xl font-medium hover:bg-green-50 transition"
            >
              {watchLoading ? "Adding..." : "Add to Watchlist"}
            </button>
          )}

          <button
            onClick={handleViewDetails}
            className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium transition"
          >
            View Details
          </button>
        </div>
      </div>

      {/* ================= PROFESSIONAL POPUP ================= */}

      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                !
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                {popup.title}
              </h3>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {popup.message}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closePopup}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-medium transition"
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
