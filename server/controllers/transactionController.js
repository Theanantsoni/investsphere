const Wallet = require("../models/WalletModel");

/* ================= GET USER TRANSACTIONS ================= */
exports.getUserTransactions = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const wallet = await Wallet.findOne({ userEmail: email });

    if (!wallet) {
      return res.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const transactions = wallet.transactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("TRANSACTION ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET SINGLE ================= */
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const wallet = await Wallet.findOne({
      "transactions._id": id,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const transaction = wallet.transactions.id(id);

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("GET TRANSACTION ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= DELETE ================= */
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const wallet = await Wallet.findOne({
      "transactions._id": id,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    wallet.transactions.id(id).remove();
    await wallet.save();

    res.json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};