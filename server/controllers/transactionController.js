const Transaction = require("../models/TransactionModel");

/* ======================================================
 GET USER TRANSACTIONS
====================================================== */

const getUserTransactions = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const transactions = await Transaction.find({
      userEmail: email,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Fetch Transactions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ======================================================
 GET SINGLE TRANSACTION
====================================================== */

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Get Transaction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ======================================================
 DELETE TRANSACTION (OPTIONAL ADMIN USE)
====================================================== */

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await Transaction.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (error) {
    console.error("Delete Transaction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ======================================================
 EXPORT
====================================================== */

module.exports = {
  getUserTransactions,
  getTransactionById,
  deleteTransaction,
};