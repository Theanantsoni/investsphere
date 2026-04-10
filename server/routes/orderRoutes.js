const express = require("express");
const router = express.Router();

const {
  createSellOrder,
} = require("../controllers/orderController");

/* ======================================================
 ROUTES
====================================================== */

// SELL ORDER (🔥 FIXED: removed asyncHandler)
router.post("/sell", createSellOrder);

module.exports = router;