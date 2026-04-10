const mongoose = require("mongoose");

/* ======================================================
SCHEMA
====================================================== */
const ipoInvestmentSchema = new mongoose.Schema(
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

    /* ================= CORE IPO ================= */
    ipoCode: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= STANDARDIZATION ================= */
    assetCode: {
      type: String,
      trim: true,
    },
    assetName: {
      type: String,
      trim: true,
    },

    /* ================= INVESTMENT ================= */
    lotSize: {
      type: Number,
      required: true,
      min: 1,
    },
    lots: {
      type: Number,
      required: true,
      min: 1,
    },

    /* 🔥 MAIN QUANTITY FIELD */
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    /* 🔥 LEGACY FIELD */
    totalShares: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    /* 🔥 PORTFOLIO CALC */
    currentPrice: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["applied", "allotted", "rejected"],
      default: "applied",
    },
  },
  {
    timestamps: true,
  }
);

/* ======================================================
PRE SAVE (SAFE SYNC - FIXED)
====================================================== */
ipoInvestmentSchema.pre("save", function () {
  // 🔥 Standard fields mapping
  this.assetCode = this.ipoCode;
  this.assetName = this.companyName;

  // 🔥 FULL SYNC (SAFE)
  const qty = Number(this.quantity || this.totalShares || 0);

  this.quantity = qty;
  this.totalShares = qty;
});

/* ======================================================
INDEXES
====================================================== */
ipoInvestmentSchema.index({ userEmail: 1, createdAt: -1 });
ipoInvestmentSchema.index({ ipoCode: 1 });

/* ======================================================
MODEL
====================================================== */
module.exports =
  mongoose.models.IPOinvestment ||
  mongoose.model("IPOinvestment", ipoInvestmentSchema);