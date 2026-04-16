// models/Transaction.js

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
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

    assetType: {
      type: String,
      enum: ["stock", "sip", "ipo"],
      required: true,
    },

    assetCode: {
      type: String,
    },

    assetName: {
      type: String,
    },

    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    orderType: {
      type: String,
      enum: ["market", "limit", "sip"],
      default: "market",
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

    totalAmount: {
      type: Number,
      required: true,
    },

    executionPrice: {
      type: Number,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);