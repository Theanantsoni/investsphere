// models/Wallet.js

const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    balance: {
      type: Number,
      default: 0,
    },

    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "wallets",
  }
);

module.exports = mongoose.model("Wallet", walletSchema);