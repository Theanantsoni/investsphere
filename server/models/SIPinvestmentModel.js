const mongoose = require("mongoose");

/* ======================================================
   SIP INVESTMENT SCHEMA
====================================================== */

const SIPinvestmentSchema = new mongoose.Schema(
  {
    /* ================= USER ================= */

    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // ✅ consistency for queries
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= ASSET ================= */

    assetCode: {
      type: String,
      required: true,
      trim: true,
    },

    assetName: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "sip",
      enum: ["sip"], // 🔒 scalable for future types
    },

    /* ================= INVESTMENT ================= */

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    totalInvested: {
      type: Number,
      required: true,
      min: 0,
    },

    expectedReturn: {
      type: Number,
      required: true,
      min: 0,
    },

    expectedProfit: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ================= META ================= */

    category: {
      type: String,
      default: "",
      trim: true,
    },

    risk: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* ======================================================
   INDEXES (ADVANCED OPTIMIZATION)
====================================================== */

// 🔥 Optimized for user portfolio queries (most important)
SIPinvestmentSchema.index({ userEmail: 1, createdAt: -1 });

// 🔥 Optimized for asset-based queries
SIPinvestmentSchema.index({ assetCode: 1 });

// 🔥 Optional: unique combination (prevent duplicate same SIP entry)
// Uncomment if needed in future
// SIPinvestmentSchema.index({ userEmail: 1, assetCode: 1 }, { unique: true });

/* ======================================================
   VIRTUALS (OPTIONAL - CLEAN RESPONSE)
====================================================== */

// Example: Profit percentage
SIPinvestmentSchema.virtual("profitPercentage").get(function () {
  if (!this.totalInvested || this.totalInvested === 0) return 0;
  return ((this.expectedProfit / this.totalInvested) * 100).toFixed(2);
});

/* ======================================================
   TO JSON / OBJECT CONFIG
====================================================== */

SIPinvestmentSchema.set("toJSON", {
  virtuals: true,
});

SIPinvestmentSchema.set("toObject", {
  virtuals: true,
});

/* ======================================================
   MODEL
====================================================== */

const SIPinvestment = mongoose.model(
  "SIPinvestment",
  SIPinvestmentSchema
);

/* ======================================================
   EXPORT (COMMONJS)
====================================================== */

module.exports = SIPinvestment;