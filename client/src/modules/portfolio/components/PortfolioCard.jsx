import React from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import {
  getTypeColor,
  getTypeLabel,
} from "../constants/portfolioConstants";

/* ======================================================
 COMPONENT
====================================================== */
const PortfolioCard = ({ asset }) => {
  /* ================= SAFETY ================= */
  if (!asset) return null;

  const isProfit = asset.profit >= 0;

  /* ======================================================
 RENDER
====================================================== */
  return (
    <div
      className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-2xl
      transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        {/* LEFT */}
        <div>
          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-indigo-600 transition">
            {asset.name}
          </h3>

          {/* TYPE BADGE */}
          <span
            className={`inline-block mt-1 text-xs px-2 py-1 rounded-full text-white ${getTypeColor(
              asset.type
            )}`}
          >
            {getTypeLabel(asset.type)}
          </span>
        </div>

        {/* PROFIT BADGE */}
        <div
          className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
            isProfit
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {isProfit ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          {isProfit ? "Profit" : "Loss"}
        </div>
      </div>

      {/* BODY */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>
          Invested:{" "}
          <span className="font-medium text-gray-800">
            ₹{Number(asset.invested).toLocaleString("en-IN")}
          </span>
        </p>

        <p>
          Current:{" "}
          <span className="font-medium text-gray-800">
            ₹{Number(asset.current).toLocaleString("en-IN")}
          </span>
        </p>

        {/* PROFIT */}
        <p
          className={`font-semibold flex items-center gap-1 ${
            isProfit ? "text-green-600" : "text-red-600"
          }`}
        >
          <BarChart3 size={14} />
          ₹{Number(asset.profit).toLocaleString("en-IN")} (
          {Number(asset.percentage).toFixed(2)}%)
        </p>
      </div>

      {/* EXTRA INFO */}
      <div className="mt-4 pt-3 border-t text-xs text-gray-500 space-y-1">
        {/* STOCK */}
        {asset.type === "stock" && (
          <>
            <p>Qty: {asset.quantity || 0}</p>
            <p>
              Avg Price: ₹
              {Number(asset.avgPrice || 0).toFixed(2)}
            </p>
          </>
        )}

        {/* SIP */}
        {asset.type === "sip" && (
          <p>Installments: {asset.installments || 0}</p>
        )}

        {/* IPO */}
        {asset.type === "ipo" && (
          <>
            <p>Shares: {asset.shares || 0}</p>
            <p>
              Avg Price: ₹
              {Number(asset.avgPrice || 0).toFixed(2)}
            </p>
            <p className="capitalize">
              Status: {asset.status || "applied"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;