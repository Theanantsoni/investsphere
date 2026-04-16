// models/Report.js

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    userName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "reports",
  }
);

module.exports = mongoose.model("Report", reportSchema);