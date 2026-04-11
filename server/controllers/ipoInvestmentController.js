const IPOinvestment = require("../models/IPOinvestmentModel");
const { createTransaction } = require("../services/transactionService");

/* ======================================================
   ADD IPO INVESTMENT (FIXED WITH PROFIT LOGIC)
====================================================== */

const addIPOinvestment = async (req, res) => {
  try {
    const {
      userEmail,
      username,
      ipoCode,
      companyName,
      lotSize,
      lots,
      price,
    } = req.body;

    /* ================= VALIDATION ================= */

    if (
      !userEmail ||
      !ipoCode ||
      !lotSize ||
      !lots ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /* ================= SAFE CONVERSION ================= */

    const safeLotSize = Number(lotSize);
    const safeLots = Number(lots);
    const safePrice = Number(price);

    if (
      isNaN(safeLotSize) ||
      isNaN(safeLots) ||
      isNaN(safePrice)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid numeric values",
      });
    }

    if (safeLotSize <= 0 || safeLots <= 0 || safePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input values",
      });
    }

    /* ================= CALCULATIONS ================= */

    const totalShares = safeLotSize * safeLots;
    const totalAmount = totalShares * safePrice;

    /* 🔥 DEMO PROFIT LOGIC (IMPORTANT FIX) */
    const randomGrowth = 1 + Math.random() * 0.2; // up to +20%
    const currentPrice = Number(
      (safePrice * randomGrowth).toFixed(2)
    );

    const safeData = {
      userEmail: String(userEmail).toLowerCase().trim(),
      username: username ? String(username).trim() : "User",

      ipoCode: String(ipoCode).trim(),
      companyName: companyName
        ? String(companyName).trim()
        : "Unknown IPO",

      lotSize: safeLotSize,
      lots: safeLots,

      quantity: totalShares,
      totalShares,

      price: safePrice,
      currentPrice, // 🔥 FIXED

      totalAmount,

      assetCode: ipoCode,
      assetName: companyName,
      status: "applied",
    };

    /* ================= CREATE ================= */

    const investment = await IPOinvestment.create(safeData);

    /* ================= TRANSACTION ================= */

    try {
      await createTransaction({
        userEmail: safeData.userEmail,
        username: safeData.username,
        assetType: "ipo",
        assetCode: safeData.ipoCode,
        assetName: safeData.companyName,
        type: "BUY",
        orderType: "market",
        quantity: safeData.totalShares,
        price: safeData.price,
        totalAmount: safeData.totalAmount,
        referenceId: investment._id,
      });
    } catch (txError) {
      console.error("Transaction Error:", txError.message);
    }

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      success: true,
      message: "IPO Applied Successfully",
      data: investment,
    });
  } catch (error) {
    console.error("IPO Investment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/* ======================================================
   GET USER IPO INVESTMENTS
====================================================== */

const getUserIPOinvestments = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const investments = await IPOinvestment.find({
      userEmail: String(email).toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    const totalInvested = investments.reduce(
      (acc, item) => acc + (item.totalAmount || 0),
      0
    );

    const totalShares = investments.reduce(
      (acc, item) => acc + (item.totalShares || 0),
      0
    );

    return res.json({
      success: true,
      count: investments.length,
      summary: {
        totalInvested,
        totalShares,
      },
      data: investments,
    });
  } catch (error) {
    console.error("Fetch IPO Investments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ======================================================
   EXPORT
====================================================== */

module.exports = {
  addIPOinvestment,
  getUserIPOinvestments,
};