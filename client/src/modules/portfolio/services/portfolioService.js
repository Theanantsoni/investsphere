const StockInvestment = require("../models/StockInvestmentModel");
const SIPinvestment = require("../models/SIPinvestmentModel");
const IPOinvestment = require("../models/IPOinvestmentModel");

const {
  calculateStockCurrentValue,
  calculateIPOCurrentValue,
} = require("../utils/portfolioCalculations");

const formatPortfolio = require("../utils/formatPortfolio");

/* ======================================================
 GET FULL PORTFOLIO (CORE ENGINE)
====================================================== */
const getFullPortfolio = async (userEmail) => {
  try {
    /* ================= FETCH ALL ================= */
    const [stocks, sips, ipos] = await Promise.all([
      StockInvestment.find({ userEmail }),
      SIPinvestment.find({ userEmail }),
      IPOinvestment.find({ userEmail }),
    ]);

    /* ================= STOCK ================= */
    const stockData = stocks.map((item) => {
      const currentValue = calculateStockCurrentValue(item);

      return {
        type: "stock",
        name: item.companyName,
        invested: item.totalAmount,
        current: currentValue,
        profit: currentValue - item.totalAmount,
      };
    });

    /* ================= SIP ================= */
    const sipData = sips.map((item) => ({
      type: "sip",
      name: item.assetName,
      invested: item.totalInvested,
      current: item.expectedReturn,
      profit: item.expectedProfit,
    }));

    /* ================= IPO ================= */
    const ipoData = ipos.map((item) => {
      const currentValue = calculateIPOCurrentValue(item);

      return {
        type: "ipo",
        name: item.companyName,
        invested: item.totalAmount,
        current: currentValue,
        profit: currentValue - item.totalAmount,
      };
    });

    const merged = [...stockData, ...sipData, ...ipoData];

    /* ================= FORMAT ================= */
    return formatPortfolio(merged);
  } catch (error) {
    console.error("Portfolio Service Error:", error);
    throw error;
  }
};

module.exports = {
  getFullPortfolio,
};