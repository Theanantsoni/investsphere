const express = require("express");
const router = express.Router();

const {
  getMarketSnapshot,
  getMarketHistory,
  getTicker
} = require("../controllers/marketController");

// Main routes
router.get("/", getMarketSnapshot);
router.get("/history", getMarketHistory);
router.get("/ticker", getTicker);

module.exports = router;