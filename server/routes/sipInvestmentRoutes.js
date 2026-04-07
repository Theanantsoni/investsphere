const express = require("express");

/* ======================================================
   CONTROLLERS
====================================================== */

const {
  addSIPinvestment,
  getUserSIPinvestments,
} = require("../controllers/SIPinvestmentController");

/* ======================================================
   MIDDLEWARE (OPTIONAL - ADD LATER)
====================================================== */

// const authMiddleware = require("../middleware/authMiddleware");

/* ======================================================
   ROUTER INIT
====================================================== */

const router = express.Router();

/* ======================================================
   ROUTES
====================================================== */

/* ================= ADD SIP INVESTMENT ================= */
/*
POST /api/sip-investments/add
BODY:
{
  userEmail,
  username,
  assetCode,
  assetName,
  amount,
  duration,
  totalInvested,
  expectedReturn,
  expectedProfit,
  category,
  risk
}
*/

router.post(
  "/add",
  // authMiddleware, // 🔐 enable later
  addSIPinvestment
);

/* ================= GET USER SIP INVESTMENTS ================= */
/*
GET /api/sip-investments/user?email=abc@gmail.com
*/

router.get(
  "/user",
  // authMiddleware, // 🔐 enable later
  getUserSIPinvestments
);

/* ================= HEALTH CHECK ================= */
/*
GET /api/sip-investments/test
*/

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "SIP Investment Route Working ✅",
    timestamp: new Date(),
  });
});

/* ======================================================
   FUTURE ROUTES (SCALABLE STRUCTURE)
====================================================== */

// router.put("/:id", updateSIPinvestment);
// router.delete("/:id", deleteSIPinvestment);

/* ======================================================
   EXPORT
====================================================== */

module.exports = router;