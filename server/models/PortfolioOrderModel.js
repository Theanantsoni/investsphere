const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    symbol: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    assetType: {
      type: String,
      enum: ["STOCK", "SIP", "IPO"],
      required: true,
    },

    orderType: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    executionType: {
      type: String,
      enum: ["MARKET", "LIMIT", "STOP_LOSS", "GTT", "AMO"],
      default: "MARKET",
    },

    productType: {
      type: String,
      enum: ["INTRADAY", "DELIVERY"],
      default: "DELIVERY",
    },

    quantity: {
      type: Number,
      required: true,
    },

    executedQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    executedPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    charges: {
      brokerage: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },

    profitLoss: {
      type: Number,
      default: 0,
    },

    orderId: {
      type: String,
      unique: true,
    },

    executedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PortfolioOrder", orderSchema);