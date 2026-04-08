const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userEmail: String,
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT", "TRANSFER"],
    },
    amount: Number,
    description: String,
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "SUCCESS",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", transactionSchema);