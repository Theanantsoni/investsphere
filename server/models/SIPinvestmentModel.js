const mongoose = require("mongoose");

/* ====================================================== */
const SIPinvestmentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, trim: true, lowercase: true },
    username: { type: String, required: true, trim: true },

    assetCode: { type: String, required: true, trim: true },
    assetName: { type: String, required: true, trim: true },

    type: {
      type: String,
      default: "sip",
      enum: ["sip"],
    },

    amount: { type: Number, required: true, min: 1 },
    duration: { type: Number, required: true, min: 1 },

    totalInvested: { type: Number, required: true, min: 0 },
    expectedReturn: { type: Number, required: true, min: 0 },
    expectedProfit: { type: Number, required: true, min: 0 },

    category: { type: String, default: "", trim: true },

    risk: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  { timestamps: true }
);

SIPinvestmentSchema.index({ userEmail: 1, createdAt: -1 });
SIPinvestmentSchema.index({ assetCode: 1 });

SIPinvestmentSchema.virtual("profitPercentage").get(function () {
  if (!this.totalInvested) return 0;
  return ((this.expectedProfit / this.totalInvested) * 100).toFixed(2);
});

SIPinvestmentSchema.set("toJSON", { virtuals: true });
SIPinvestmentSchema.set("toObject", { virtuals: true });

/* ✅ FIX */
module.exports =
  mongoose.models.SIPinvestment ||
  mongoose.model("SIPinvestment", SIPinvestmentSchema);