// routes/adminRoutes.js

const express = require("express");
const router = express.Router();

/* =========================================
   CONTROLLERS
========================================= */
const {
  getAllUsers,
  getAllStocks,
  getAllSIP,
  getAllIPO,
  getAllTransactions,
  getAllWallets,
  getAllWatchlist,
  getAllReports,
  getDashboardStats,
  getAllNotifications,
  markNotificationAsRead,
} = require("../controllers/adminController");

/* =========================================
   (OPTIONAL) MIDDLEWARE PLACEHOLDER
========================================= */
// const { protect, isAdmin } = require("../middleware/authMiddleware");
// router.use(protect, isAdmin);

/* =========================================
   BASE ROUTE
========================================= */
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Admin API Running 🚀",
  });
});

/* =========================================
   DASHBOARD
========================================= */
router.get("/dashboard", getDashboardStats);

/* =========================================
   USERS
========================================= */
router.route("/users").get(getAllUsers);

/* =========================================
   INVESTMENTS
========================================= */
router.route("/stocks").get(getAllStocks);
router.route("/sip").get(getAllSIP);
router.route("/ipo").get(getAllIPO);

/* =========================================
   TRANSACTIONS
========================================= */
router.route("/transactions").get(getAllTransactions);

/* =========================================
   WALLETS
========================================= */
router.route("/wallets").get(getAllWallets);

/* =========================================
   WATCHLIST
========================================= */
router.route("/watchlist").get(getAllWatchlist);

/* =========================================
   REPORTS
========================================= */
router.route("/reports").get(getAllReports);

/* =========================================
   🔔 NOTIFICATIONS
========================================= */
router.get("/notifications", getAllNotifications);
router.patch("/notifications/:id/read", markNotificationAsRead);

/* =========================================
   FUTURE READY
========================================= */
// router.route("/users/:id").delete(deleteUser);
// router.route("/reports/:id").patch(updateReportStatus);

module.exports = router;