// models/IPOInvestment.js

const mongoose = require("mongoose");

const ipoInvestmentSchema = new mongoose.Schema(
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

    ipoCode: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    assetCode: {
      type: String,
    },

    assetName: {
      type: String,
    },

    lotSize: {
      type: Number,
      required: true,
    },

    lots: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    totalShares: {
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

    status: {
      type: String,
      enum: ["applied", "allotted", "rejected"],
      default: "applied",
    },
  },
  {
    timestamps: true,
    collection: "ipoinvestments",
  }
);

module.exports = mongoose.model(
  "IPOInvestment",
  ipoInvestmentSchema
);