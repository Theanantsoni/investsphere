// models/StockInvestment.js

const mongoose = require("mongoose");

const stockInvestmentSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
    },

    symbol: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    orderType: {
      type: String,
      enum: ["market", "limit"],
      default: "market",
    },

    type: {
      type: String,
      enum: ["buy", "sell"],
      default: "buy",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    currentPrice: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    assetCode: {
      type: String,
    },

    assetName: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "stockinvestments",
  }
);

module.exports = mongoose.model(
  "StockInvestment",
  stockInvestmentSchema
);