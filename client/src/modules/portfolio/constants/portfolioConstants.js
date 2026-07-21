import API from "../../../config/api";

/* ======================================================
 PORTFOLIO TYPES
====================================================== */
export const PORTFOLIO_TYPES = {
  STOCK: "stock",
  SIP: "sip",
  IPO: "ipo",
};

/* ======================================================
 FILTER OPTIONS
====================================================== */
export const PORTFOLIO_FILTERS = [
  { label: "All", value: "all" },
  { label: "Stocks", value: "stock" },
  { label: "SIP", value: "sip" },
  { label: "IPO", value: "ipo" },
];

/* ======================================================
 TYPE LABELS
====================================================== */
export const TYPE_LABELS = {
  stock: "Stocks",
  sip: "SIP",
  ipo: "IPO",
};

/* ======================================================
 COLORS (UI CONSISTENCY)
====================================================== */
export const TYPE_COLORS = {
  stock: "bg-blue-500",
  sip: "bg-purple-500",
  ipo: "bg-green-500",
};

/* ======================================================
 STATUS COLORS (PROFIT/LOSS)
====================================================== */
export const PROFIT_COLORS = {
  positive: "text-green-600",
  negative: "text-red-600",
};

/* ======================================================
 API ENDPOINTS (🔥 UPDATED - SINGLE API)
====================================================== */
export const PORTFOLIO_API = {
  BASE: API,

  /* 🔥 NEW UNIFIED API */
  GET_PORTFOLIO: "/portfolio",

  /* 🔥 FUTURE READY (OPTIONAL) */
  GET_TRANSACTIONS: "/transactions",
};

/* ======================================================
 DEFAULT VALUES
====================================================== */
export const DEFAULT_PORTFOLIO = {
  totalInvested: 0,
  currentValue: 0,
  totalProfit: 0,
  profitPercentage: 0,
  totalAssets: 0,
  totalStocks: 0,
  totalSIPs: 0,
  totalIPOs: 0,
};

/* ======================================================
 CHART COLORS
====================================================== */
export const CHART_COLORS = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#06B6D4", // cyan
];

/* ======================================================
 HELPERS (OPTIONAL - UI USE)
====================================================== */

/* 🔹 Get Type Label */
export const getTypeLabel = (type) => {
  return TYPE_LABELS[type] || "Asset";
};

/* 🔹 Get Type Color */
export const getTypeColor = (type) => {
  return TYPE_COLORS[type] || "bg-gray-400";
};

/* 🔹 Profit Color */
export const getProfitColor = (profit) => {
  return profit >= 0
    ? PROFIT_COLORS.positive
    : PROFIT_COLORS.negative;
};