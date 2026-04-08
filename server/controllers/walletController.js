const Wallet = require("../models/WalletModel");
const Register = require("../models/Register");

/* ================= CONSTANTS ================= */
const MIN_AMOUNT = 500;
const MAX_AMOUNT = 500000;

/* ================= HELPER ================= */
const normalizeEmail = (email) => email.toLowerCase().trim();

const validateAmount = (amount) => {
  if (!amount || isNaN(amount)) {
    return "Invalid amount";
  }

  if (amount < MIN_AMOUNT) {
    return `Minimum amount is ₹${MIN_AMOUNT}`;
  }

  if (amount > MAX_AMOUNT) {
    return `Maximum amount is ₹5,00,000`;
  }

  return null;
};

const createWalletIfNotExists = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  let wallet = await Wallet.findOne({ userEmail: normalizedEmail });

  if (!wallet) {
    wallet = await Wallet.create({
      userEmail: normalizedEmail,
      balance: 0,
      transactions: [],
    });
  }

  return wallet;
};

/* ================= GET WALLET ================= */
exports.getWallet = async (req, res) => {
  try {
    let { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = normalizeEmail(email);

    const wallet = await createWalletIfNotExists(email);

    return res.json({
      success: true,
      wallet,
    });

  } catch (err) {
    console.error("GET WALLET ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= ADD MONEY ================= */
exports.addMoney = async (req, res) => {
  try {
    let { email, amount } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const validationError = validateAmount(amount);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    email = normalizeEmail(email);
    amount = Number(amount);

    const wallet = await createWalletIfNotExists(email);

    wallet.balance += amount;

    wallet.transactions.unshift({
      type: "CREDIT",
      amount,
      description: "Money Added",
      date: new Date(),
    });

    await wallet.save();

    return res.json({
      success: true,
      message: "Money added successfully",
      wallet,
    });

  } catch (err) {
    console.error("ADD MONEY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= WITHDRAW ================= */
exports.withdrawMoney = async (req, res) => {
  try {
    let { email, amount } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const validationError = validateAmount(amount);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    email = normalizeEmail(email);
    amount = Number(amount);

    const wallet = await createWalletIfNotExists(email);

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    wallet.balance -= amount;

    wallet.transactions.unshift({
      type: "DEBIT",
      amount,
      description: "Withdraw",
      date: new Date(),
    });

    await wallet.save();

    return res.json({
      success: true,
      message: "Withdrawal successful",
      wallet,
    });

  } catch (err) {
    console.error("WITHDRAW ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= TRANSFER ================= */
exports.transferMoney = async (req, res) => {
  try {
    let { from, to, amount } = req.body;

    /* ================= BASIC VALIDATION ================= */
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Sender and receiver email required",
      });
    }

    const validationError = validateAmount(amount);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    from = normalizeEmail(from);
    to = normalizeEmail(to);
    amount = Number(amount);

    /* ================= SELF TRANSFER BLOCK ================= */
    if (from === to) {
      return res.status(400).json({
        success: false,
        message: "You cannot transfer to yourself",
      });
    }

    /* ================= CHECK RECEIVER REGISTERED ================= */
    const receiverUser = await Register.findOne({ email: to });

    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Receiver user not registered",
      });
    }

    /* ================= GET WALLETS ================= */
    const sender = await createWalletIfNotExists(from);
    const receiver = await createWalletIfNotExists(to);

    /* ================= BALANCE CHECK ================= */
    if (sender.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    /* ================= UPDATE BALANCE ================= */
    sender.balance -= amount;
    receiver.balance += amount;

    /* ================= TRANSACTIONS ================= */
    sender.transactions.unshift({
      type: "DEBIT",
      amount,
      description: `Transfer to ${to}`,
      date: new Date(),
    });

    receiver.transactions.unshift({
      type: "CREDIT",
      amount,
      description: `Received from ${from}`,
      date: new Date(),
    });

    /* ================= SAVE ================= */
    await sender.save();
    await receiver.save();

    return res.json({
      success: true,
      message: "Transfer successful",
      wallet: sender,
    });

  } catch (err) {
    console.error("TRANSFER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};