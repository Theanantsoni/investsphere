const Transaction = require("../models/TransactionModel");

/* ======================================================
 CREATE TRANSACTION (REUSABLE LOGIC)
====================================================== */

const createTransaction = async ({
  userEmail,
  username,
  assetType,
  assetCode,
  assetName,
  type = "BUY",
  orderType = "market",
  quantity,
  price,
  totalAmount,
  referenceId = null,
}) => {
  try {
    const transaction = await Transaction.create({
      userEmail,
      username,
      assetType,
      assetCode,
      assetName,
      type,
      orderType,
      status: "completed",
      quantity,
      price,
      totalAmount,
      referenceId,
    });

    return transaction;
  } catch (error) {
    console.error("Transaction Service Error:", error);
    throw error;
  }
};

module.exports = {
  createTransaction,
};