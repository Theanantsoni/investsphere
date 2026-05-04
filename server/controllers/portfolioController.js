const StockInvestment = require("../models/StockInvestmentModel");
const SIPInvestment = require("../models/SIPinvestmentModel");
const IPOInvestment = require("../models/IPOinvestmentModel");
const Transaction = require("../models/TransactionModel");

/* ====================================================== */
/* 🔥 GROUP STOCK (UNCHANGED CORE LOGIC) */
const groupStocks = (data) => {
  const map = {};

  data.forEach((item) => {
    const key = item.symbol;

    if (!map[key]) {
      map[key] = {
        _id: item._id,
        assetType: "stocks",
        assetCode: item.symbol,
        assetName: item.companyName,
        quantity: 0,
        totalInvestment: 0,
        currentPrice: Number(item.currentPrice || item.price || 0),
      };
    }

    map[key].quantity += Number(item.quantity || 0);
    map[key].totalInvestment += Number(item.totalAmount || 0);

    map[key].currentPrice =
      Number(item.currentPrice || item.price || map[key].currentPrice);
  });

  return Object.values(map).map((item) => {
    const avgPrice =
      item.quantity > 0
        ? item.totalInvestment / item.quantity
        : 0;

    const price = item.currentPrice > 0 ? item.currentPrice : avgPrice;

    const current = item.quantity * price;

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
/* 🔥 GROUP SIP (FIXED STATUS + ID HANDLING) */
const groupSIPs = (data) => {
  const map = {};

  data.forEach((item) => {
    if (item.status === "withdrawn") return;

    const key = item.assetCode;

    if (!map[key]) {
      map[key] = {
        _id: item._id, // fallback (will update below)
        ids: [], // 🔥 IMPORTANT: store all SIP ids
        assetType: "sip",
        assetCode: item.assetCode,
        assetName: item.assetName,
        monthlyAmount: 0,
        durationMonths: 0,
        installmentsPaid: 0,
        totalInvestment: 0,
        status: item.status || "active",
      };
    }

    // 🔥 collect all ids
    map[key].ids.push(item._id);

    const monthly = Number(item.amount || 0);
    const durationYears = Number(item.duration || 0);
    const durationMonths = durationYears * 12;

    const installments = Number(
      item.installments || item.quantity || 0
    );

    const invested = Number(
      item.totalInvested ||
        item.totalInvestment ||
        item.totalAmount ||
        monthly * installments ||
        0
    );

    map[key].monthlyAmount = monthly;

    if (durationMonths > 0) {
      map[key].durationMonths = Math.max(
        map[key].durationMonths,
        durationMonths
      );
    }

    map[key].installmentsPaid += installments;
    map[key].totalInvestment += invested;

    // 🔥 STATUS PRIORITY FIX
    if (item.status === "active") {
      map[key].status = "active";
    } else if (
      item.status === "stopped" &&
      map[key].status !== "active"
    ) {
      map[key].status = "stopped";
    }
  });

  return Object.values(map).map((item) => {
    const current = item.totalInvestment;

    return {
      ...item,
      _id: item.ids[0], // 🔥 frontend uses this
      ids: item.ids, // 🔥 future-safe
      invested: item.totalInvestment,
      current,
      profit: current - item.totalInvestment,
    };
  });
};

/* ====================================================== */
/* 🔥 GROUP IPO (UNCHANGED CORE LOGIC) */
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
        currentPrice: Number(
          item.currentPrice || item.price || 0
        ),
      };
    }

    const qty = Number(
      item.quantity || item.totalShares || 0
    );

    const invested = Number(
      item.totalAmount ||
        item.price * qty ||
        0
    );

    map[key].quantity += qty;
    map[key].totalInvestment += invested;

    map[key].currentPrice =
      Number(item.currentPrice || item.price || map[key].currentPrice);
  });

  return Object.values(map).map((item) => {
    const avgPrice =
      item.quantity > 0
        ? item.totalInvestment / item.quantity
        : 0;

    const price = item.currentPrice > 0 ? item.currentPrice : avgPrice;

    const current = item.quantity * price;

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
/* 🔥 MAIN PORTFOLIO API */
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
      (acc, i) => acc + Number(i.invested || 0),
      0
    );

    const currentValue = allAssets.reduce(
      (acc, i) => acc + Number(i.current || 0),
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