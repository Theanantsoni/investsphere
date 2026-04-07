import React from "react";
import { RefreshCw, TrendingUp } from "lucide-react";
import { usePortfolioContext } from "../context/PortfolioContext";

/* ======================================================
 COMPONENT
====================================================== */
const PortfolioHeader = () => {
  const { refreshPortfolio, loading, summary } =
    usePortfolioContext();

  /* ======================================================
 DATE FORMAT
====================================================== */
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  /* ======================================================
 HANDLE REFRESH
====================================================== */
  const handleRefresh = () => {
    if (!loading) {
      refreshPortfolio();
    }
  };

  /* ======================================================
 PROFIT STATUS
====================================================== */
  const isProfit = summary?.totalProfit >= 0;

  /* ======================================================
 RENDER
====================================================== */
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* LEFT */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          My Portfolio
          <TrendingUp className="text-blue-600" size={22} />
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Track your investments & performance
        </p>

        {/* DATE */}
        <p className="text-xs text-gray-400 mt-1">
          Last updated: {currentDate}
        </p>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3">
        {/* PROFIT BADGE */}
        {summary && (
          <div
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              isProfit
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isProfit ? "Profit" : "Loss"}: ₹
            {summary.totalProfit?.toLocaleString("en-IN")}
          </div>
        )}

        {/* REFRESH BUTTON */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl
          hover:bg-blue-700 transition-all duration-200 shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
};

export default PortfolioHeader;