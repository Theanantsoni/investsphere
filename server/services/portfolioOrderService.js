const Transaction = require("../models/TransactionModel");

/* ======================================================
 HELPERS
====================================================== */

const safeNumber = (val) => Number(val || 0);

/* ======================================================
 NORMALIZE STRING (🔥 DSA CLEANING)
====================================================== */
const normalize = (val) =>
  String(val || "")
    .trim()
    .toLowerCase();

/* ======================================================
 GET ORDERS (STRICT FILTER + CLEAN DATA)
====================================================== */

const getOrders = async (query) => {
  const {
    userEmail,
    type,
    status,
    search,
    fromDate,
    toDate,
    assetType,
    page = 1,
    limit = 10,
  } = query;

  let filter = { userEmail };

  /* ================= DB FETCH ONLY USER ================= */
  const allTransactions = await Transaction.find(filter).sort({
    createdAt: -1,
  });

  /* ======================================================
   🔥 DSA FILTERING (STRICT + SAFE)
  ====================================================== */
  let filtered = allTransactions.filter((item) => {
    const itemType = normalize(item.type);
    const itemStatus = normalize(item.status);
    const itemAsset = normalize(item.assetType);

    const qType = normalize(type);
    const qStatus = normalize(status);
    const qAsset = normalize(assetType);
    const qSearch = normalize(search);

    /* TYPE FILTER */
    if (qType && itemType !== qType) return false;

    /* STATUS FILTER */
    if (qStatus && itemStatus !== qStatus) return false;

    /* ASSET FILTER */
    if (qAsset && itemAsset !== qAsset) return false;

    /* SEARCH FILTER */
    if (qSearch) {
      const code = normalize(item.assetCode);
      const name = normalize(item.assetName);

      if (!code.includes(qSearch) && !name.includes(qSearch)) {
        return false;
      }
    }

    /* DATE FILTER */
    if (fromDate || toDate) {
      const date = new Date(item.createdAt);

      if (fromDate && date < new Date(fromDate)) return false;
      if (toDate && date > new Date(toDate)) return false;
    }

    return true;
  });

  /* ======================================================
   PAGINATION (DSA SLICE)
  ====================================================== */
  const total = filtered.length;

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);

  const paginated = filtered.slice(start, end);

  /* ======================================================
   MAP TO UI FORMAT
  ====================================================== */
  const orders = paginated.map((item) => ({
    _id: item._id,

    symbol: item.assetCode,
    name: item.assetName,

    assetType: (item.assetType || "").toUpperCase(),

    orderType: (item.type || "").toUpperCase(),

    quantity: safeNumber(item.quantity),
    price: safeNumber(item.price),

    status: (item.status || "completed").toUpperCase(),

    createdAt: item.createdAt,

    rejectionReason: "",
  }));

  return {
    data: orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ======================================================
 DUMMY METHODS
====================================================== */

const createOrder = async () => {
  throw new Error("Order creation not supported (using transactions)");
};

const updateOrderStatus = async () => {
  throw new Error("Update not supported");
};

const cancelOrder = async () => {
  throw new Error("Cancel not supported");
};

const modifyOrder = async () => {
  throw new Error("Modify not supported");
};

/* ======================================================
 ANALYTICS
====================================================== */

const getOrderAnalytics = async (userEmail) => {
  const transactions = await Transaction.find({ userEmail });

  let wins = 0;
  let losses = 0;

  transactions.forEach((t) => {
    const pnl = safeNumber(t.profitLoss);

    if (pnl > 0) wins++;
    if (pnl < 0) losses++;
  });

  return {
    totalOrders: transactions.length,
    wins,
    losses,
    winRate:
      transactions.length > 0
        ? ((wins / transactions.length) * 100).toFixed(2)
        : 0,
  };
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  modifyOrder,
  getOrderAnalytics,
};