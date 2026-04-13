const express = require("express");
const router = express.Router();

const {
  getAnalytics,
} = require("../controllers/analyticsController");

/* ======================================================
  ROUTES
====================================================== */

// GET FULL ANALYTICS
router.get("/", getAnalytics);

module.exports = router;