const mongoose = require("mongoose");

/* ======================================================
   REPORT SCHEMA
====================================================== */

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    userEmail: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    userName: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true // createdAt and updatedAt automatically
  }
);

/* ======================================================
   MODEL EXPORT
====================================================== */

module.exports = mongoose.model("Report", reportSchema);