const express = require("express");

const {
  sendRegisterOTP,
  verifyRegisterOTP,
  loginUser,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
  findEmailByMobile
} = require("../controllers/authController");

const router = express.Router();

/* ================= REGISTER ================= */

router.post("/register/send-otp", sendRegisterOTP);
router.post("/register/verify-otp", verifyRegisterOTP);

/* ================= LOGIN ================= */

router.post("/login", loginUser);

/* ================= FORGOT PASSWORD ================= */

router.post("/forgot-password/send-otp", sendForgotPasswordOTP);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOTP);
router.post("/forgot-password/reset", resetPassword);

/* ================= FIND EMAIL BY MOBILE ================= */

router.post("/find-email-by-mobile", findEmailByMobile);

module.exports = router;