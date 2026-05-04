const StockInvestment = require("../models/StockInvestmentModel");
const { createTransaction } = require("../services/transactionService");

/* ======================================================
   ADD STOCK INVESTMENT
====================================================== */

const addStockInvestment = async (req, res) => {
  try {
    const {
      userEmail,
      username,
      symbol,
      companyName,
      quantity,
      price,
      totalAmount,
      orderType,
      type,
    } = req.body;

    /* ================= VALIDATION ================= */

    if (
      !userEmail ||
      !symbol ||
      !quantity ||
      !price ||
      totalAmount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /* ================= SAFE DATA ================= */

    const safeData = {
      userEmail: String(userEmail),
      username: username || "User",
      symbol: String(symbol).toUpperCase(),
      companyName: companyName || "Unknown",

      quantity: Number(quantity),
      price: Number(price),
      totalAmount: Number(totalAmount),

      orderType: orderType || "market",
      type: type || "buy",
      status: "completed",
    };

    /* ================= EXTRA VALIDATION ================= */

    if (safeData.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    if (safeData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price",
      });
    }

    /* ================= CREATE INVESTMENT ================= */

    const investment = await StockInvestment.create(safeData);

    /* ======================================================
       CREATE TRANSACTION (🔥 VERY IMPORTANT)
    ====================================================== */

    await createTransaction({
      userEmail: safeData.userEmail,
      username: safeData.username,
      assetType: "stocks", // ✅ FIXED (was "stock")
      assetCode: safeData.symbol,
      assetName: safeData.companyName,
      type: "BUY",
      orderType: safeData.orderType,
      quantity: safeData.quantity,
      price: safeData.price,
      totalAmount: safeData.totalAmount,
      referenceId: investment._id,
    });

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      success: true,
      message: "Stock Investment Added Successfully",
      data: investment,
    });
  } catch (error) {
    console.error("Stock Investment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ======================================================
   GET USER STOCK INVESTMENTS
====================================================== */

const getUserStockInvestments = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const investments = await StockInvestment.find({
      userEmail: email,
    }).sort({ createdAt: -1 });

    /* ================= SUMMARY ================= */

    const totalInvested = investments.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );

    return res.json({
      success: true,
      count: investments.length,
      totalInvested,
      data: investments,
    });
  } catch (error) {
    console.error("Fetch Stock Investments Error:", error);

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
  addStockInvestment,
  getUserStockInvestments,
};