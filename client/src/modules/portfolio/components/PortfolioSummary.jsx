import React from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

/* ======================================================
 COMPONENT
====================================================== */
const PortfolioSummary = ({ summary }) => {
  /* ================= SAFETY ================= */
  if (!summary) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow text-center text-gray-500">
        No portfolio data available
      </div>
    );
  }

  const {
    totalInvested = 0,
    currentValue = 0,
    totalProfit = 0,
    profitPercentage = 0,
  } = summary;

  const isProfit = totalProfit >= 0;

  /* ======================================================
 RENDER
====================================================== */
  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-500 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent)] pointer-events-none"></div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg md:text-xl font-semibold">
          Portfolio Summary
        </h2>

        <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
          {isProfit ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          {profitPercentage}%
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
        {/* INVESTED */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:scale-[1.03] transition">
          <p className="text-white/80 text-xs mb-1">
            Total Invested
          </p>
          <p className="font-bold text-lg flex items-center gap-1">
            <Wallet size={16} />
            ₹{Number(totalInvested).toLocaleString("en-IN")}
          </p>
        </div>

        {/* CURRENT */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:scale-[1.03] transition">
          <p className="text-white/80 text-xs mb-1">
            Current Value
          </p>
          <p className="font-bold text-lg">
            ₹{Number(currentValue).toLocaleString("en-IN")}
          </p>
        </div>

        {/* PROFIT */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:scale-[1.03] transition">
          <p className="text-white/80 text-xs mb-1">
            Profit / Loss
          </p>
          <p
            className={`font-bold text-lg ${
              isProfit ? "text-green-200" : "text-red-200"
            }`}
          >
            ₹{Number(totalProfit).toLocaleString("en-IN")}
          </p>
        </div>

        {/* RETURN */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:scale-[1.03] transition">
          <p className="text-white/80 text-xs mb-1">
            Return %
          </p>
          <p className="font-bold text-lg">
            {Number(profitPercentage).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;