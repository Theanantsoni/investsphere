const express = require("express");

const {
  addIPOinvestment,
  getUserIPOinvestments,
} = require("../controllers/ipoInvestmentController");

const router = express.Router();

/* ======================================================
   ROUTES
====================================================== */

/*
POST /api/ipo-investments/add
*/
router.post("/add", addIPOinvestment);

/*
GET /api/ipo-investments/user?email=abc@gmail.com
*/
router.get("/user", getUserIPOinvestments);

/*
TEST
*/
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "IPO Investment Route Working ✅",
  });
});

module.exports = router;