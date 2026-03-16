const express = require("express");

const router = express.Router();

const {
  sendProfileUpdateOTP,
  verifyOTPAndUpdate
} = require("../controllers/profileController");

router.post("/send-otp", sendProfileUpdateOTP);
router.post("/verify-otp", verifyOTPAndUpdate);

module.exports = router;