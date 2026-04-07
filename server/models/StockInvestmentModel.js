const mongoose = require("mongoose");

/* ======================================================
   STOCK INVESTMENT SCHEMA
====================================================== */

const stockInvestmentSchema = new mongoose.Schema(
  {
    /* ================= USER ================= */

    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= STOCK ================= */

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= ORDER ================= */

    orderType: {
      type: String,
      enum: ["market", "limit"],
      required: true,
    },

    type: {
      type: String,
      enum: ["buy", "sell"],
      default: "buy",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed",
    },

    /* ================= INVESTMENT ================= */

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

  },
  {
    timestamps: true,
  }
);

/* ======================================================
   INDEXES (PERFORMANCE)
====================================================== */

stockInvestmentSchema.index({ userEmail: 1, createdAt: -1 });
stockInvestmentSchema.index({ symbol: 1 });

/* ======================================================
   MODEL
====================================================== */

const StockInvestment = mongoose.model(
  "StockInvestment",
  stockInvestmentSchema
);

/* ======================================================
   EXPORT
====================================================== */

module.exports = StockInvestment;