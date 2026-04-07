const mongoose = require("mongoose");

const ipoInvestmentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, trim: true, lowercase: true },
    username: { type: String, required: true, trim: true },

    ipoCode: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },

    lotSize: { type: Number, required: true, min: 1 },
    lots: { type: Number, required: true, min: 1 },
    totalShares: { type: Number, required: true, min: 1 },

    price: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["applied", "allotted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

ipoInvestmentSchema.index({ userEmail: 1, createdAt: -1 });
ipoInvestmentSchema.index({ ipoCode: 1 });

/* ✅ FIX */
module.exports =
  mongoose.models.IPOinvestment ||
  mongoose.model("IPOinvestment", ipoInvestmentSchema);