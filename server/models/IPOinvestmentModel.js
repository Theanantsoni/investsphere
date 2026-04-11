const mongoose = require("mongoose");

/* ======================================================
SCHEMA
====================================================== */
const ipoInvestmentSchema = new mongoose.Schema(
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

    assetCode: String,
    assetName: String,

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

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

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

    currentPrice: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["applied", "allotted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

/* ======================================================
🔥 FINAL FIXED PRE SAVE (NO next)
====================================================== */
ipoInvestmentSchema.pre("save", async function () {
  this.assetCode = this.ipoCode;
  this.assetName = this.companyName;

  const qty = Number(this.quantity || this.totalShares || 0);

  this.quantity = qty;
  this.totalShares = qty;

  if (!this.totalAmount || this.totalAmount <= 0) {
    this.totalAmount = qty * Number(this.price || 0);
  }

  if (!this.currentPrice || this.currentPrice <= 0) {
    this.currentPrice = Number(this.price || 0);
  }
});

/* ====================================================== */
ipoInvestmentSchema.index({ userEmail: 1, createdAt: -1 });
ipoInvestmentSchema.index({ ipoCode: 1 });

module.exports =
  mongoose.models.IPOinvestment ||
  mongoose.model("IPOinvestment", ipoInvestmentSchema);