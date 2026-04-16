// models/Watchlist.js

const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    itemCode: {
      type: String,
      required: true,
    },

    itemName: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["stock", "ipo"],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "watchlists",
  }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);