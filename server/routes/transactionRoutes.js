const express = require("express");

const {
  getUserTransactions,
  getTransactionById,
  deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

/* ======================================================
 ROUTES
====================================================== */

/* ================= GET USER TRANSACTIONS ================= */
/*
GET /api/transactions/user?email=abc@gmail.com
*/
router.get("/user", getUserTransactions);

/* ================= GET SINGLE ================= */
/*
GET /api/transactions/:id
*/
router.get("/:id", getTransactionById);

/* ================= DELETE ================= */
/*
DELETE /api/transactions/:id
*/
router.delete("/:id", deleteTransaction);

/* ================= TEST ================= */
router.get("/test/health", (req, res) => {
  res.json({
    success: true,
    message: "Transaction Route Working ✅",
  });
});

module.exports = router;