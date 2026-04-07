const mongoose = require("mongoose");

const stockInvestmentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, trim: true, lowercase: true },
    username: { type: String, required: true, trim: true },

    symbol: { type: String, required: true, uppercase: true, trim: true },
    companyName: { type: String, required: true, trim: true },

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

    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

stockInvestmentSchema.index({ userEmail: 1, createdAt: -1 });
stockInvestmentSchema.index({ symbol: 1 });

/* ✅ FIX */
module.exports =
  mongoose.models.StockInvestment ||
  mongoose.model("StockInvestment", stockInvestmentSchema);