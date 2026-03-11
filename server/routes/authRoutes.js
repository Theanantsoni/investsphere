const express = require("express");

const {
  sendRegisterOTP,
  verifyRegisterOTP
} = require("../controllers/authController");

const router = express.Router();


// ======================================================
// AUTH ROUTES
// ======================================================


// --------------------------------------
// SEND OTP FOR REGISTRATION
// --------------------------------------

router.post(
  "/register/send-otp",
  sendRegisterOTP
);


// --------------------------------------
// VERIFY OTP + COMPLETE REGISTRATION
// --------------------------------------

router.post(
  "/register/verify-otp",
  verifyRegisterOTP
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;