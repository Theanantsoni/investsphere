const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    userEmail: String,
    fullName: String,
    pan: String,
    aadhaar: String,
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KYC", kycSchema);