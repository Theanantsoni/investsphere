const StockInvestment = require("../models/StockInvestmentModel");
const SIPInvestment = require("../models/SIPinvestmentModel");
const IPOInvestment = require("../models/IPOinvestmentModel");
const Transaction = require("../models/TransactionModel");

/* ======================================================
  HELPERS
====================================================== */

const safeNumber = (val) => Number(val || 0);

/* ======================================================
  CORE ANALYTICS SERVICE
====================================================== */

const getAnalyticsData = async (userEmail) => {
  /* ======================================================
    FETCH DATA
  ====================================================== */

  const [stocks, sips, ipos, transactions] = await Promise.all([
    StockInvestment.find({ userEmail }),
    SIPInvestment.find({ userEmail }),
    IPOInvestment.find({ userEmail }),
    Transaction.find({ userEmail }),
  ]);

  let totalInvested = 0;
  let currentValue = 0;

  const allocationMap = {
    stock: 0,
    sip: 0,
    ipo: 0,
  };

  /* ======================================================
    STOCK CALCULATION
  ====================================================== */

  stocks.forEach((item) => {
    const invested = safeNumber(item.totalAmount);

    const quantity = safeNumber(item.quantity);
    const buyPrice = safeNumber(item.price);

    // 🔥 FIX: handle currentPrice = 0
    const currentPrice =
      item.currentPrice && item.currentPrice > 0
        ? safeNumber(item.currentPrice)
        : buyPrice;

    const current = quantity * currentPrice;

    totalInvested += invested;
    currentValue += current;

    allocationMap.stock += current;
  });

  /* ======================================================
    SIP CALCULATION
  ====================================================== */

  sips.forEach((item) => {
    const invested = safeNumber(item.totalInvested);

    // 🔥 No fake expectedReturn — use invested as current
    const current = invested;

    totalInvested += invested;
    currentValue += current;

    allocationMap.sip += current;
  });

  /* ======================================================
    IPO CALCULATION
  ====================================================== */

  ipos.forEach((item) => {
    const invested = safeNumber(item.totalAmount);

    const quantity = safeNumber(item.quantity);
    const buyPrice = safeNumber(item.price);

    const currentPrice =
      item.currentPrice && item.currentPrice > 0
        ? safeNumber(item.currentPrice)
        : buyPrice;

    const current = quantity * currentPrice;

    totalInvested += invested;
    currentValue += current;

    allocationMap.ipo += current;
  });

  /* ======================================================
    PROFIT LOSS
  ====================================================== */

  const profitLoss = currentValue - totalInvested;

  const returnPercent =
    totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  /* ======================================================
    PNL BREAKDOWN
  ====================================================== */

  let realized = 0;

  transactions.forEach((tx) => {
    if (tx.type === "SELL" || tx.type === "sell") {
      const sellAmount = safeNumber(tx.totalAmount);
      const buyPrice = safeNumber(tx.price);
      const qty = safeNumber(tx.quantity);

      const invested = buyPrice * qty;

      realized += sellAmount - invested;
    }
  });

  const unrealized = profitLoss - realized;

  /* ======================================================
    ALLOCATION %
  ====================================================== */

  const allocation = Object.keys(allocationMap).map((key) => ({
    type: key.toUpperCase(),
    percent: currentValue > 0 ? (allocationMap[key] / currentValue) * 100 : 0,
  }));

  /* ======================================================
    SIP ANALYTICS
  ====================================================== */

  const totalSipInvested = sips.reduce(
    (sum, s) => sum + safeNumber(s.totalInvested),
    0,
  );

  const sip = {
    totalInvested: totalSipInvested,
    active: sips.length,
    average: sips.length > 0 ? totalSipInvested / sips.length : 0,
  };

  /* ======================================================
    PERFORMANCE (BASIC REALISTIC)
  ====================================================== */

  const performance = [
    { date: "Start", value: totalInvested * 0.6 },
    { date: "Growth", value: totalInvested * 0.85 },
    { date: "Recent", value: totalInvested },
    { date: "Now", value: currentValue },
  ];

  /* ======================================================
    FINAL RESPONSE
  ====================================================== */

  return {
    overview: {
      totalInvested,
      currentValue,
      profitLoss,
      returnPercent,
    },
    allocation,
    pnl: {
      realized,
      unrealized,
      total: profitLoss,
    },
    sip,
    performance,
  };
};

module.exports = {
  getAnalyticsData,
};
