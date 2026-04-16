// models/SIPInvestment.js

const mongoose = require("mongoose");

const sipInvestmentSchema = new mongoose.Schema(
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

    assetCode: {
      type: String,
      required: true,
    },

    assetName: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "sip",
    },

    amount: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    installments: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    totalInvested: {
      type: Number,
      required: true,
    },

    expectedReturn: {
      type: Number,
    },

    expectedProfit: {
      type: Number,
    },

    category: {
      type: String,
    },

    risk: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
  },
  {
    timestamps: true,
    collection: "sipinvestments",
  }
);

module.exports = mongoose.model(
  "SIPInvestment",
  sipInvestmentSchema
);