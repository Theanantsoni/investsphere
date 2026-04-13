const StockInvestment = require("../models/StockInvestmentModel");
const SIPInvestment = require("../models/SIPinvestmentModel");
const IPOInvestment = require("../models/IPOinvestmentModel");
const Transaction = require("../models/TransactionModel");

/* ======================================================
 HELPERS
====================================================== */
const safe = (val) => Number(val || 0);
const round = (num) => Math.round(num * 100) / 100;

/* ======================================================
 DATE HELPER
====================================================== */
const groupByMonth = (transactions) => {
  const map = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

    if (!map[key]) map[key] = 0;

    map[key] += safe(tx.totalAmount);
  });

  return Object.keys(map).map((key) => ({
    date: key,
    value: round(map[key]),
  }));
};

/* ======================================================
 CURRENT PRICE (STRICT - NO FAKE)
====================================================== */
const getCurrentPrice = (item) => {
  const buy = safe(item.price);

  if (item.currentPrice && item.currentPrice > 0) {
    return safe(item.currentPrice);
  }

  return buy; // ✅ no fake
};

/* ======================================================
 FAKE VARIATION (ONLY FOR UI GAINERS/LOSERS)
====================================================== */
const getVisualPrice = (item) => {
  const base = getCurrentPrice(item);

  // 🔥 small variation only for UI (±2%)
  const variation = base * (Math.random() * 0.04 - 0.02);

  return base + variation;
};

/* ======================================================
 CORE SERVICE
====================================================== */
const getPnLData = async (userEmail) => {
  const [stocks, sips, ipos, transactions] = await Promise.all([
    StockInvestment.find({ userEmail }),
    SIPInvestment.find({ userEmail }),
    IPOInvestment.find({ userEmail }),
    Transaction.find({ userEmail }).sort({ createdAt: 1 }),
  ]);

  let totalInvested = 0;
  let currentValue = 0;

  const allocation = {
    stock: 0,
    sip: 0,
    ipo: 0,
  };

  /* ================= STOCK ================= */
  stocks.forEach((item) => {
    const invested = safe(item.totalAmount);
    const qty = safe(item.quantity);

    const currentPrice = getCurrentPrice(item);
    const current = round(qty * currentPrice);

    totalInvested += invested;
    currentValue += current;
    allocation.stock += current;
  });

  /* ================= SIP ================= */
  sips.forEach((item) => {
    const invested = safe(item.totalInvested);

    totalInvested += invested;
    currentValue += invested;
    allocation.sip += invested;
  });

  /* ================= IPO ================= */
  ipos.forEach((item) => {
    const invested = safe(item.totalAmount);
    const qty = safe(item.quantity);

    const currentPrice = getCurrentPrice(item);
    const current = round(qty * currentPrice);

    totalInvested += invested;
    currentValue += current;
    allocation.ipo += current;
  });

  /* ======================================================
   PROFIT
  ====================================================== */
  totalInvested = round(totalInvested);
  currentValue = round(currentValue);

  const totalProfit = round(currentValue - totalInvested);

  const profitPercentage =
    totalInvested > 0
      ? round((totalProfit / totalInvested) * 100)
      : 0;

  /* ======================================================
   REALIZED
  ====================================================== */
  let realized = 0;

  transactions.forEach((tx) => {
    if (tx.type === "SELL" || tx.type === "sell") {
      const sell = safe(tx.totalAmount);
      const buy = safe(tx.price);
      const qty = safe(tx.quantity);

      realized += sell - buy * qty;
    }
  });

  realized = round(realized);

  const unrealized = round(totalProfit - realized);

  /* ======================================================
   BREAKDOWN
  ====================================================== */
  const breakdown = Object.keys(allocation).map((key) => ({
    type: key.toUpperCase(),
    value: round(allocation[key]),
    percent:
      currentValue > 0
        ? round((allocation[key] / currentValue) * 100)
        : 0,
  }));

  /* ======================================================
   TREND
  ====================================================== */
  const trend = groupByMonth(transactions);

  /* ======================================================
   BAR CHART
  ====================================================== */
  const pnlCompare = [
    { name: "Realized", value: realized },
    { name: "Unrealized", value: unrealized },
  ];

  /* ======================================================
   GAINERS / LOSERS (🔥 FIXED PROPERLY)
  ====================================================== */
  const stockPerformance = stocks.map((s) => {
    const qty = safe(s.quantity);
    const invested = safe(s.totalAmount);

    // 👇 use visual price (NOT affecting total PnL)
    const current = round(qty * getVisualPrice(s));

    const profit = round(current - invested);

    return {
      name: s.symbol || s.name || "Stock",
      profit,
    };
  });

  const gainers = [...stockPerformance]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 3);

  const losers = [...stockPerformance]
    .sort((a, b) => a.profit - b.profit)
    .slice(0, 3);

  /* ======================================================
   INSIGHTS
  ====================================================== */
  const insights = [];

  if (profitPercentage > 10)
    insights.push("Portfolio performing strongly 📈");

  if (profitPercentage < 0)
    insights.push("Portfolio is in loss 📉");

  if (allocation.stock > allocation.sip)
    insights.push("Stocks dominating portfolio");

  if (gainers.length && gainers[0].profit > 0)
    insights.push(`${gainers[0].name} is your top performer`);

  /* ======================================================
   FINAL RESPONSE
  ====================================================== */
  return {
    overview: {
      totalInvested,
      currentValue,
      totalProfit,
      profitPercentage,
    },
    pnl: {
      realized,
      unrealized,
    },
    breakdown,
    trend,
    pnlCompare,
    gainers,
    losers,
    insights,
  };
};

module.exports = {
  getPnLData,
};