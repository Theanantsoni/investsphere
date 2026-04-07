const IPOinvestment = require("../models/IPOinvestmentModel");
const { createTransaction } = require("../services/transactionService");

/* ======================================================
   ADD IPO INVESTMENT
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
      totalShares,
      price,
      totalAmount,
    } = req.body;

    /* ======================================================
       BASIC VALIDATION
    ====================================================== */

    if (
      !userEmail ||
      !ipoCode ||
      !lotSize ||
      !lots ||
      price === undefined ||
      totalAmount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /* ======================================================
       SAFE DATA CONVERSION
    ====================================================== */

    const safeData = {
      userEmail: String(userEmail).toLowerCase().trim(),
      username: username ? String(username).trim() : "User",

      ipoCode: String(ipoCode).trim(),
      companyName: companyName ? String(companyName).trim() : "Unknown IPO",

      lotSize: Number(lotSize),
      lots: Number(lots),
      totalShares: Number(totalShares),
      price: Number(price),
      totalAmount: Number(totalAmount),

      status: "applied",
    };

    /* ======================================================
       STRICT VALIDATION (VERY IMPORTANT)
    ====================================================== */

    if (
      isNaN(safeData.lotSize) ||
      isNaN(safeData.lots) ||
      isNaN(safeData.totalShares) ||
      isNaN(safeData.price) ||
      isNaN(safeData.totalAmount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid numeric values",
      });
    }

    if (safeData.lotSize <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid lot size",
      });
    }

    if (safeData.lots <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid lots",
      });
    }

    if (safeData.totalShares <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total shares",
      });
    }

    if (safeData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price",
      });
    }

    if (safeData.totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount",
      });
    }

    /* ======================================================
       CREATE IPO INVESTMENT
    ====================================================== */

    const investment = await IPOinvestment.create(safeData);

    /* ======================================================
       CREATE TRANSACTION (SAFE EXECUTION)
    ====================================================== */

    try {
      await createTransaction({
        userEmail: safeData.userEmail,
        username: safeData.username,
        assetType: "ipo",
        assetCode: safeData.ipoCode,
        assetName: safeData.companyName,
        type: "BUY",
        orderType: "market", // ✅ FIXED
        quantity: safeData.totalShares,
        price: safeData.price,
        totalAmount: safeData.totalAmount,
        referenceId: investment._id,
      });
    } catch (txError) {
      console.error("Transaction Error:", txError.message);
      // ❗ Transaction fail hone pe IPO fail nahi hoga
    }

    /* ======================================================
       SUCCESS RESPONSE
    ====================================================== */

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

    /* ================= VALIDATION ================= */

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    /* ================= FETCH ================= */

    const investments = await IPOinvestment.find({
      userEmail: String(email).toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    /* ================= SUMMARY ================= */

    const totalInvested = investments.reduce(
      (acc, item) => acc + (item.totalAmount || 0),
      0,
    );

    const totalShares = investments.reduce(
      (acc, item) => acc + (item.totalShares || 0),
      0,
    );

    /* ================= RESPONSE ================= */

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
