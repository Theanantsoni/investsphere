const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    userEmail: String,
    accountNumber: String,
    ifsc: String,
    bankName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankAccount", bankSchema);