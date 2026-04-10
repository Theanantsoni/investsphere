const StockInvestment = require("../models/StockInvestmentModel");
const SIPInvestment = require("../models/SIPinvestmentModel");
const IPOInvestment = require("../models/IPOinvestmentModel");
const Transaction = require("../models/TransactionModel");

/* ====================================================== */
/* 🔥 GROUP STOCK */
const groupStocks = (data) => {
  const map = {};

  data.forEach((item) => {
    const key = item.symbol;

    if (!map[key]) {
      map[key] = {
        _id: item._id,
        assetType: "stock",
        assetCode: item.symbol,
        assetName: item.companyName,
        quantity: 0,
        totalInvestment: 0,
        currentPrice: item.currentPrice || item.price || 0,
      };
    }

    map[key].quantity += item.quantity || 0;
    map[key].totalInvestment += item.totalAmount || 0;

    map[key].currentPrice =
      item.currentPrice || item.price || map[key].currentPrice;
  });

  return Object.values(map).map((item) => {
    const avgPrice =
      item.quantity > 0
        ? item.totalInvestment / item.quantity
        : 0;

    const current =
      item.quantity * (item.currentPrice || avgPrice);

    return {
      ...item,
      avgPrice,
      invested: item.totalInvestment,
      current,
      profit: current - item.totalInvestment,
    };
  });
};

/* ====================================================== */
/* 🔥 GROUP SIP (FIXED) */
const groupSIPs = (data) => {
  const map = {};

  data.forEach((item) => {
    const key = item.assetCode;

    if (!map[key]) {
      map[key] = {
        _id: item._id,
        assetType: "sip",
        assetCode: item.assetCode,
        assetName: item.assetName,
        quantity: 0,
        totalInvestment: 0,
      };
    }

    const qty = item.quantity || item.installments || 1;

    map[key].quantity += qty;
    map[key].totalInvestment += item.totalInvested || item.amount || 0;
  });

  return Object.values(map).map((item) => {
    const invested = item.totalInvestment;
    const current = invested;

    return {
      ...item,
      avgPrice:
        item.quantity > 0 ? invested / item.quantity : 0,
      invested,
      current,
      profit: current - invested,
    };
  });
};

/* ====================================================== */
/* 🔥 GROUP IPO */
const groupIPOs = (data) => {
  const map = {};

  data.forEach((item) => {
    const key = item.ipoCode;

    if (!map[key]) {
      map[key] = {
        _id: item._id,
        assetType: "ipo",
        assetCode: item.ipoCode,
        assetName: item.companyName,
        quantity: 0,
        totalInvestment: 0,
        currentPrice:
          item.currentPrice || item.issuePrice || item.price || 0,
      };
    }

    const qty = item.quantity || item.totalShares || 0;

    map[key].quantity += qty;
    map[key].totalInvestment += item.totalAmount || 0;

    map[key].currentPrice =
      item.currentPrice ||
      item.issuePrice ||
      item.price ||
      map[key].currentPrice;
  });

  return Object.values(map).map((item) => {
    const avgPrice =
      item.quantity > 0
        ? item.totalInvestment / item.quantity
        : 0;

    const current =
      item.quantity * (item.currentPrice || avgPrice);

    return {
      ...item,
      avgPrice,
      invested: item.totalInvestment,
      current,
      profit: current - item.totalInvestment,
    };
  });
};

/* ====================================================== */
const getPortfolio = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const [stocks, sips, ipos, transactions] = await Promise.all([
      StockInvestment.find({ userEmail: email }).sort({ createdAt: 1 }),
      SIPInvestment.find({ userEmail: email }).sort({ createdAt: 1 }),
      IPOInvestment.find({ userEmail: email }).sort({ createdAt: 1 }),
      Transaction.find({ userEmail: email }).sort({ createdAt: -1 }),
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
      (acc, i) => acc + (i.invested || 0),
      0
    );

    const currentValue = allAssets.reduce(
      (acc, i) => acc + (i.current || 0),
      0
    );

    const totalProfit = currentValue - totalInvestment;

    return res.json({
      success: true,
      summary: {
        totalInvested: totalInvestment,
        currentValue,
        totalProfit,
        profitPercentage:
          totalInvestment > 0
            ? Number(
                ((totalProfit / totalInvestment) * 100).toFixed(2)
              )
            : 0,
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
        transactions,
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