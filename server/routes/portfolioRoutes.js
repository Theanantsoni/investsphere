const express = require("express");
const router = express.Router();

const {
  getPortfolio,
} = require("../controllers/portfolioController");

/* ======================================================
 ROUTES
====================================================== */

/*
GET /api/portfolio?email=abc@gmail.com
👉 Full unified portfolio
*/
router.get("/", getPortfolio);

/*
TEST ROUTE
*/
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio Route Working ✅",
  });
});

module.exports = router;