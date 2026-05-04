const SIPinvestment = require("../models/SIPinvestmentModel");
const Wallet = require("../models/WalletModel");
const { createTransaction } = require("../services/transactionService");

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
      installments,
      quantity,
      totalInvested,
      expectedReturn,
      expectedProfit,
      category,
      risk,
    } = req.body;

    if (
      !userEmail ||
      !assetCode ||
      !amount ||
      !duration ||
      !installments ||
      totalInvested === undefined ||
      expectedReturn === undefined ||
      expectedProfit === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const safeInstallments = Number(installments);
    const safeAmount = Number(amount);
    const safeDuration = Number(duration);
    const safeQuantity = Number(quantity || safeInstallments);
    const safeTotalInvested = Number(totalInvested);

    const safeData = {
      userEmail: String(userEmail),
      username: username ? String(username) : "User",
      assetCode: String(assetCode),
      assetName: assetName ? String(assetName) : "Unknown Asset",
      type: "sip",
      amount: safeAmount,
      duration: safeDuration,
      installments: safeInstallments,
      quantity: safeQuantity,
      totalInvested: safeTotalInvested,
      expectedReturn: Number(expectedReturn),
      expectedProfit: Number(expectedProfit),
      category: category ? String(category) : "",
      risk: risk ? String(risk) : "",
    };

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

    if (safeData.installments <= 0) {
      return res.status(400).json({
        success: false,
        message: "Installments must be valid",
      });
    }

    const investment = await SIPinvestment.create(safeData);

    await createTransaction({
      userEmail: safeData.userEmail,
      username: safeData.username,
      assetType: "sip",
      assetCode: safeData.assetCode,
      assetName: safeData.assetName,
      type: "BUY",
      orderType: "sip",
      quantity: safeData.quantity,
      price: safeData.amount,
      totalAmount: safeData.totalInvested,
      referenceId: investment._id,
    });

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
   STOP SIP
====================================================== */

const stopSIPinvestment = async (req, res) => {
  try {
    const { id } = req.params;

    const sip = await SIPinvestment.findById(id);

    if (!sip) {
      return res.status(404).json({
        success: false,
        message: "SIP not found",
      });
    }

    /* 🔥 FIX: allow restart */
    if (sip.status === "stopped") {
      sip.status = "active";

      await sip.save();

      return res.json({
        success: true,
        message: "SIP restarted successfully",
        data: sip,
      });
    }

    if (sip.status === "withdrawn") {
      return res.status(400).json({
        success: false,
        message: "SIP already withdrawn",
      });
    }

    sip.status = "stopped";
    await sip.save();

    return res.json({
      success: true,
      message: "SIP stopped successfully",
      data: sip,
    });
  } catch (error) {
    console.error("STOP SIP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ======================================================
   WITHDRAW SIP
====================================================== */

const withdrawSIPinvestment = async (req, res) => {
  try {
    const { id } = req.params;

    const sip = await SIPinvestment.findById(id);

    if (!sip) {
      return res.status(404).json({
        success: false,
        message: "SIP not found",
      });
    }

    if (sip.status === "withdrawn") {
      return res.status(400).json({
        success: false,
        message: "Already withdrawn",
      });
    }

    const wallet = await Wallet.findOne({
      userEmail: sip.userEmail,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    wallet.balance += Number(sip.totalInvested || 0);

    wallet.transactions.unshift({
      type: "CREDIT",
      amount: Number(sip.totalInvested || 0),
      description: "SIP Withdraw",
      date: new Date(),
    });

    await wallet.save();

    sip.status = "withdrawn";
    await sip.save();

    await createTransaction({
      userEmail: sip.userEmail,
      username: sip.username,
      assetType: "sip",
      assetCode: sip.assetCode,
      assetName: sip.assetName,
      type: "SELL",
      orderType: "sip",
      quantity: sip.quantity,
      price: sip.amount,
      totalAmount: sip.totalInvested,
      referenceId: sip._id,
    });

    return res.json({
      success: true,
      message: "SIP withdrawn successfully",
      wallet,
    });
  } catch (error) {
    console.error("WITHDRAW SIP ERROR:", error);
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

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const investments = await SIPinvestment.find({
      userEmail: email,
    }).sort({ createdAt: -1 });

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
  stopSIPinvestment,
  withdrawSIPinvestment,
};