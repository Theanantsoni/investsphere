const StockInvestment = require("../models/StockInvestmentModel");
const SIPInvestment = require("../models/SIPInvestmentModel");
const IPOInvestment = require("../models/IPOinvestmentModel");

/* ====================================================== */
/* 🔥 GROUP STOCK INVESTMENTS */
const groupStocks = (data) => {
  const map = {};

  data.forEach((item) => {
    const key = item.symbol; // ✅ FIX

    if (!map[key]) {
      map[key] = {
        assetType: "stock",
        assetCode: item.symbol, // ✅ FIX
        assetName: item.companyName,
        totalQuantity: 0,
        totalInvestment: 0,
        avgPrice: 0,
      };
    }

    map[key].totalQuantity += item.quantity;
    map[key].totalInvestment += item.totalAmount;
  });

  return Object.values(map).map((item) => ({
    ...item,
    avgPrice:
      item.totalQuantity > 0
        ? item.totalInvestment / item.totalQuantity
        : 0,
  }));
};

/* ====================================================== */
/* 🔥 GROUP SIP INVESTMENTS */
const groupSIPs = (data) => {
  const map = {};

  data.forEach((item) => {
    const key = item.assetCode; // ✅ FIX

    if (!map[key]) {
      map[key] = {
        assetType: "sip",
        assetCode: item.assetCode, // ✅ FIX
        assetName: item.assetName, // ✅ FIX
        totalInvestment: 0,
        totalInstallments: 0,
      };
    }

    map[key].totalInvestment += item.amount;
    map[key].totalInstallments += 1;
  });

  return Object.values(map);
};

/* ====================================================== */
/* 🔥 GROUP IPO INVESTMENTS */
const groupIPOs = (data) => {
  const map = {};

  data.forEach((item) => {
    const key = item.ipoCode;

    if (!map[key]) {
      map[key] = {
        assetType: "ipo",
        assetCode: item.ipoCode,
        assetName: item.companyName,
        totalShares: 0,
        totalInvestment: 0,
        avgPrice: 0,
        status: item.status,
      };
    }

    map[key].totalShares += item.totalShares;
    map[key].totalInvestment += item.totalAmount;
  });

  return Object.values(map).map((item) => ({
    ...item,
    avgPrice:
      item.totalShares > 0
        ? item.totalInvestment / item.totalShares
        : 0,
  }));
};

/* ====================================================== */
/* 🔥 GET FULL PORTFOLIO */
const getPortfolio = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const [stocks, sips, ipos] = await Promise.all([
      StockInvestment.find({ userEmail: email }),
      SIPInvestment.find({ userEmail: email }),
      IPOInvestment.find({ userEmail: email }),
    ]);

    const groupedStocks = groupStocks(stocks);
    const groupedSIPs = groupSIPs(sips);
    const groupedIPOs = groupIPOs(ipos);

    const allAssets = [
      ...groupedStocks,
      ...groupedSIPs,
      ...groupedIPOs,
    ];

    const totalInvestment = allAssets.reduce(
      (acc, item) => acc + (item.totalInvestment || 0),
      0
    );

    return res.json({
      success: true,
      summary: {
        totalInvestment,
        totalAssets: allAssets.length,
        totalStocks: groupedStocks.length,
        totalSIPs: groupedSIPs.length,
        totalIPOs: groupedIPOs.length,
      },
      data: {
        stocks: groupedStocks,
        sips: groupedSIPs,
        ipos: groupedIPOs,
        all: allAssets,
      },
    });
  } catch (error) {
    console.error("Portfolio Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { getPortfolio };