// controllers/adminController.js

const User = require("../models/User");
const Stock = require("../models/StockInvestment");
const SIP = require("../models/SIPInvestment");
const IPO = require("../models/IPOInvestment");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const Watchlist = require("../models/Watchlist");
const Report = require("../models/Report");
const Notification = require("../models/Notification"); // ✅ NEW

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

/* =========================================
   HELPER: PAGINATION
========================================= */
const getPagination = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/* =========================================
   USERS
========================================= */
exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return successResponse(
      res,
      { users, total, page, limit },
      "Users fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

/* =========================================
   STOCKS
========================================= */
exports.getAllStocks = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [stocks, total] = await Promise.all([
      Stock.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Stock.countDocuments(),
    ]);

    return successResponse(
      res,
      { stocks, total, page, limit },
      "Stocks fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

/* =========================================
   SIP
========================================= */
exports.getAllSIP = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [sip, total] = await Promise.all([
      SIP.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      SIP.countDocuments(),
    ]);

    return successResponse(
      res,
      { sip, total, page, limit },
      "SIP data fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

/* =========================================
   IPO
========================================= */
exports.getAllIPO = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [ipo, total] = await Promise.all([
      IPO.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      IPO.countDocuments(),
    ]);

    return successResponse(
      res,
      { ipo, total, page, limit },
      "IPO data fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

/* =========================================
   TRANSACTIONS
========================================= */
exports.getAllTransactions = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [transactions, total] = await Promise.all([
      Transaction.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(),
    ]);

    return successResponse(
      res,
      { transactions, total, page, limit },
      "Transactions fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

/* =========================================
   WALLETS
========================================= */
exports.getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find().sort({ createdAt: -1 });

    return successResponse(
      res,
      { wallets },
      "Wallets fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

/* =========================================
   WATCHLIST
========================================= */
exports.getAllWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find().sort({
      createdAt: -1,
    });

    return successResponse(
      res,
      { watchlist },
      "Watchlist fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

/* =========================================
   REPORTS
========================================= */
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    return successResponse(
      res,
      { reports },
      "Reports fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

/* =========================================
   DASHBOARD STATS
========================================= */
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      users,
      stocks,
      sip,
      ipo,
      transactions,
      wallets,
    ] = await Promise.all([
      User.countDocuments(),
      Stock.countDocuments(),
      SIP.countDocuments(),
      IPO.countDocuments(),
      Transaction.countDocuments(),
      Wallet.countDocuments(),
    ]);

    return successResponse(
      res,
      {
        users,
        stocks,
        sip,
        ipo,
        transactions,
        wallets,
      },
      "Dashboard stats fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

/* =========================================
   🔔 NOTIFICATIONS (FINAL FIXED)
========================================= */
exports.getAllNotifications = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [notifications, total] = await Promise.all([
      Notification.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      notifications,
      total,
      page,
      limit,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================
   🔔 MARK AS READ (OPTIONAL SUPPORT)
========================================= */
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      read: true,
    });

    return successResponse(
      res,
      {},
      "Notification marked as read"
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};