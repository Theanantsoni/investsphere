const mongoose = require("mongoose");
const Transaction = require("../models/TransactionModel");
const StockInvestment = require("../models/StockInvestmentModel");
const SIPinvestment = require("../models/SIPinvestmentModel");
const IPOinvestment = require("../models/IPOinvestmentModel");

/* ======================================================
 HELPER: UNIFIED QUANTITY
====================================================== */
const getQty = (item, type) => {
  if (type === "stock") return Number(item.quantity || 0);
  if (type === "sip")
    return Number(item.installments || item.quantity || 0);
  if (type === "ipo")
    return Number(item.quantity || item.totalShares || 0);
  return 0;
};

/* ======================================================
 CREATE SELL ORDER (FINAL FIXED)
====================================================== */
const createSellOrder = async (req, res) => {
  try {
    const {
      assetId,
      type,
      quantity,
      assetCode,
      price: inputPrice,
      orderType,
    } = req.body;

    const userEmail = req.user?.email || req.body.userEmail;
    const username =
      req.user?.username ||
      req.body.username ||
      userEmail?.split("@")[0];

    /* ================= VALIDATION ================= */
    const qty = Number(quantity);

    if (!type || !qty || qty <= 0 || !assetCode) {
      return res.status(400).json({
        message: "type, assetCode and valid quantity are required",
      });
    }

    if (!["stock", "sip", "ipo"].includes(type)) {
      return res.status(400).json({
        message: "Invalid asset type",
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (assetId && !mongoose.Types.ObjectId.isValid(assetId)) {
      return res.status(400).json({
        message: "Invalid assetId",
      });
    }

    let assets = [];
    let assetName = "";
    let marketPrice = 0;

    /* ======================================================
     FETCH DATA
    ====================================================== */

    if (type === "stock") {
      assets = await StockInvestment.find({
        userEmail,
        symbol: assetCode,
      }).sort({ createdAt: 1 });

      if (!assets.length) {
        return res.status(404).json({ message: "Stock not found" });
      }

      assetName = assets[0].companyName || "Stock Asset";

      marketPrice =
        Number(assets[0].currentPrice) ||
        Number(assets[0].price) ||
        1;
    }

    if (type === "sip") {
      assets = await SIPinvestment.find({
        userEmail,
        assetCode,
      }).sort({ createdAt: 1 });

      if (!assets.length) {
        return res.status(404).json({ message: "SIP not found" });
      }

      assetName = assets[0].assetName || "SIP Asset";

      marketPrice =
        Number(assets[0].expectedReturn || 0) /
          Number(assets[0].installments || 1) ||
        1;
    }

    if (type === "ipo") {
      assets = await IPOinvestment.find({
        userEmail,
        $or: [{ ipoCode: assetCode }, { assetCode: assetCode }],
      }).sort({ createdAt: 1 });

      if (!assets.length) {
        return res.status(404).json({ message: "IPO not found" });
      }

      assetName =
        assets[0].companyName ||
        assets[0].assetName ||
        "IPO Asset";

      /* 🔥 FINAL FIX: NEVER ZERO PRICE */
      marketPrice =
        Number(assets[0].currentPrice) ||
        Number(assets[0].price) ||
        Number(assets[0].totalAmount) /
          Number(
            assets[0].quantity || assets[0].totalShares || 1
          ) ||
        1;
    }

    /* ================= TOTAL QTY ================= */
    const totalAvailableQty = assets.reduce(
      (acc, item) => acc + getQty(item, type),
      0
    );

    if (qty > totalAvailableQty) {
      return res.status(400).json({
        message: "Insufficient quantity",
      });
    }

    /* ================= PRICE ================= */
    const finalPrice =
      orderType === "limit"
        ? Number(inputPrice || 0)
        : Number(marketPrice || 0);

    if (!finalPrice || finalPrice <= 0) {
      return res.status(400).json({
        message: "Invalid price",
      });
    }

    /* ======================================================
     FIFO SELL LOGIC
    ====================================================== */
    let remainingQty = qty;

    for (let asset of assets) {
      if (remainingQty <= 0) break;

      const availableQty = getQty(asset, type);
      if (availableQty <= 0) continue;

      const sellQty = Math.min(availableQty, remainingQty);
      remainingQty -= sellQty;

      if (type === "stock") {
        asset.quantity = Number(asset.quantity || 0) - sellQty;
      }

      if (type === "sip") {
        const newQty =
          Number(asset.installments || asset.quantity || 0) -
          sellQty;
        asset.installments = newQty;
        asset.quantity = newQty;
      }

      if (type === "ipo") {
        const currentQty = getQty(asset, "ipo");
        const newQty = currentQty - sellQty;

        asset.quantity = newQty;
        asset.totalShares = newQty;
      }

      if (getQty(asset, type) <= 0) {
        await asset.deleteOne();
      } else {
        await asset.save();
      }
    }

    /* ================= CALCULATE ================= */
    const totalAmount = finalPrice * qty;

    /* ================= TRANSACTION ================= */
    const transaction = await Transaction.create({
      userEmail,
      username,
      assetType: type,
      assetCode,
      assetName,
      type: "SELL",
      orderType: orderType || "market",
      status: "completed",
      quantity: qty,
      price: finalPrice,
      totalAmount,
      notes: "Sell Order Executed",
    });

    /* ================= RESPONSE ================= */
    return res.status(201).json({
      success: true,
      message: "Sell order executed successfully",
      transaction,
    });
  } catch (error) {
    console.error("Sell Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createSellOrder,
};