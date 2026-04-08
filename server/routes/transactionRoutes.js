const express = require("express");
const router = express.Router();

const {
  getUserTransactions,
  getTransactionById,
  deleteTransaction,
} = require("../controllers/transactionController");

router.get("/user", getUserTransactions);
router.get("/:id", getTransactionById);
router.delete("/:id", deleteTransaction);

router.get("/test/health", (req, res) => {
  res.json({
    success: true,
    message: "Transaction Route Working ✅",
  });
});

module.exports = router;