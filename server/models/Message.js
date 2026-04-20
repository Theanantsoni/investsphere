const mongoose = require("mongoose");

/* ======================================================
   MESSAGE SCHEMA
====================================================== */
const messageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    messageType: {
      type: String,
      enum: [
        "general",
        "market_update",
        "stock_alert",
        "ipo_alert",
        "sip_update",
        "wallet_update",
        "transaction_update",
        "news",
        "offer",
        "system",
      ],
      default: "general",
    },

    recipients: [
      {
        type: String, // email ids
        required: true,
      },
    ],

    sentBy: {
      type: String,
      default: "admin",
    },

    suggestionTag: {
      type: String,
      enum: [
        "Top Stocks",
        "IPO Opening",
        "Market Crash Alert",
        "Profit Booking",
        "New SIP Plan",
        "Wallet Update",
        "Breaking News",
        "System Maintenance",
        "Special Offer",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);