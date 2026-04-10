const mongoose = require("mongoose");

/* ====================================================== */
const SIPinvestmentSchema = new mongoose.Schema(
  {
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
      enum: ["sip"],
    },

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

    /* 🔥 MAIN FIELD */
    installments: {
      type: Number,
      required: true,
      min: 1,
    },

    /* 🔥 STANDARD FIELD */
    quantity: {
      type: Number,
      default: 0,
      min: 0,
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
  { timestamps: true }
);

/* ======================================================
SYNC QUANTITY (FIXED - NO next)
====================================================== */
SIPinvestmentSchema.pre("save", function () {
  const qty = Number(this.installments || this.quantity || 0);

  this.installments = qty;
  this.quantity = qty;
});

/* ====================================================== */
SIPinvestmentSchema.index({ userEmail: 1, createdAt: -1 });
SIPinvestmentSchema.index({ assetCode: 1 });

/* ====================================================== */
SIPinvestmentSchema.virtual("profitPercentage").get(function () {
  if (!this.totalInvested) return 0;
  return ((this.expectedProfit / this.totalInvested) * 100).toFixed(2);
});

SIPinvestmentSchema.set("toJSON", { virtuals: true });
SIPinvestmentSchema.set("toObject", { virtuals: true });

/* ====================================================== */
module.exports =
  mongoose.models.SIPinvestment ||
  mongoose.model("SIPinvestment", SIPinvestmentSchema);