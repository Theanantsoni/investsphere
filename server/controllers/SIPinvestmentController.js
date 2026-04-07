const SIPinvestment = require("../models/SIPinvestmentModel");

/* ======================================================
   ADD SIP INVESTMENT
====================================================== */

const addSIPinvestment = async (req, res) => {
  try {
    const {
      userEmail,
      username,
      assetCode,
      assetName,
      amount,
      duration,
      totalInvested,
      expectedReturn,
      expectedProfit,
      category,
      risk,
    } = req.body;

    /* ================= VALIDATION ================= */

    if (
      !userEmail ||
      !assetCode ||
      !amount ||
      !duration ||
      totalInvested === undefined ||
      expectedReturn === undefined ||
      expectedProfit === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /* ================= TYPE SAFETY ================= */

    const safeData = {
      userEmail: String(userEmail),
      username: username ? String(username) : "User",
      assetCode: String(assetCode),
      assetName: assetName ? String(assetName) : "Unknown Asset",
      type: "sip",
      amount: Number(amount),
      duration: Number(duration),
      totalInvested: Number(totalInvested),
      expectedReturn: Number(expectedReturn),
      expectedProfit: Number(expectedProfit),
      category: category ? String(category) : "",
      risk: risk ? String(risk) : "",
    };

    /* ================= EXTRA VALIDATION ================= */

    if (safeData.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (safeData.duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be valid",
      });
    }

    /* ================= CREATE ================= */

    const investment = await SIPinvestment.create(safeData);

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      success: true,
      message: "SIP Investment Added Successfully",
      data: investment,
    });
  } catch (error) {
    console.error("SIP Investment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ======================================================
   GET USER SIP INVESTMENTS
====================================================== */

const getUserSIPinvestments = async (req, res) => {
  try {
    const { email } = req.query;

    /* ================= VALIDATION ================= */

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    /* ================= FETCH ================= */

    const investments = await SIPinvestment.find({
      userEmail: email,
    }).sort({ createdAt: -1 });

    /* ================= SUMMARY ================= */

    const totalInvested = investments.reduce(
      (acc, item) => acc + (item.totalInvested || 0),
      0
    );

    const totalExpectedReturn = investments.reduce(
      (acc, item) => acc + (item.expectedReturn || 0),
      0
    );

    const totalProfit = investments.reduce(
      (acc, item) => acc + (item.expectedProfit || 0),
      0
    );

    /* ================= RESPONSE ================= */

    return res.json({
      success: true,
      count: investments.length,
      summary: {
        totalInvested,
        totalExpectedReturn,
        totalProfit,
      },
      data: investments,
    });
  } catch (error) {
    console.error("Fetch SIP Investments Error:", error);

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
  addSIPinvestment,
  getUserSIPinvestments,
};