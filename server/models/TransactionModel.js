const mongoose = require("mongoose");

/* ======================================================
 TRANSACTION SCHEMA
====================================================== */

const transactionSchema = new mongoose.Schema(
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

    /* ================= ASSET ================= */
    assetType: {
      type: String,
      enum: ["stock", "sip", "ipo"],
      required: true,
    },

    assetCode: {
      type: String, // stock symbol / sip code
      required: true,
      trim: true,
    },

    assetName: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= TRANSACTION ================= */
    type: {
      type: String,
      enum: ["BUY", "SELL"],
      default: "BUY",
    },

    orderType: {
      type: String,
      enum: ["market", "limit", "sip", "ipo"],
      default: "market",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },

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

    /* ================= EXTRA ================= */
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assetType", // dynamic reference (advanced)
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* ======================================================
 INDEXES (PERFORMANCE)
====================================================== */

// 🔥 User history fast
transactionSchema.index({ userEmail: 1, createdAt: -1 });

// 🔥 Asset history
transactionSchema.index({ assetCode: 1 });

/* ======================================================
 MODEL
====================================================== */

const Transaction = mongoose.model("Transaction", transactionSchema);

/* ======================================================
 EXPORT
====================================================== */

module.exports = Transaction;