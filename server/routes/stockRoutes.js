const express = require("express");
const router = express.Router();

const {
  getStocks,
  getStockDetail
} = require("../controllers/stockController");

// Stock list
router.get("/", getStocks);

// Stock detail
router.get("/:symbol", getStockDetail);

module.exports = router;