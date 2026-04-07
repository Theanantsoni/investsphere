const express = require("express");

const {
  addStockInvestment,
  getUserStockInvestments,
} = require("../controllers/stockInvestmentController");

const router = express.Router();

/* ======================================================
   ROUTES
====================================================== */

/* ================= ADD ================= */
/*
POST /api/stock-investments/add
*/
router.post("/add", addStockInvestment);

/* ================= GET USER ================= */
/*
GET /api/stock-investments/user?email=abc@gmail.com
*/
router.get("/user", getUserStockInvestments);

/* ================= TEST ================= */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Stock Investment Route Working ✅",
  });
});

module.exports = router;