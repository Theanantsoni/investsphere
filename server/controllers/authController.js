const Register = require("../models/Register");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { verifyCaptcha } = require("../services/captchaService");
const { sendOTPEmail } = require("../services/emailService");

/* ================================================= */
/* SEND OTP REGISTER */
/* ================================================= */

const sendRegisterOTP = async (req, res) => {
  try {

    const { email, recaptchaToken } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    if (!recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification required"
      });
    }

    const captchaValid = await verifyCaptcha(recaptchaToken);

    if (!captchaValid) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed"
      });
    }

    const existingUser = await Register.findOne({
      email,
      verified: true
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const expireMinutes = process.env.OTP_EXPIRE_MINUTES || 5;

    const otpExpire = new Date(
      Date.now() + expireMinutes * 60000
    );

    let user = await Register.findOne({ email });

    if (!user) {
      user = new Register({
        email,
        verified: false
      });
    }

    user.otp = otp;
    user.otpExpire = otpExpire;

    await user.save();

    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "OTP sending failed"
    });

  }
};

/* ================================================= */
/* VERIFY REGISTER OTP */
/* ================================================= */

const verifyRegisterOTP = async (req, res) => {

  try {

    const { email, otp, form } = req.body;

    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    const hashedPassword = await bcrypt.hash(
      form.password,
      10
    );

    user.name = form.name;
    user.phone = form.phone;
    user.country = form.country || "India";
    user.state = form.state;
    user.pan = form.pan;
    user.dob = form.dob;
    user.password = hashedPassword;

    user.verified = true;

    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Verification failed"
    });

  }

};

/* ================================================= */
/* LOGIN */
/* ================================================= */

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter email and password"
      });
    }

    const user = await Register.findOne({
      email,
      verified: true
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login failed"
    });

  }

};

/* ================================================= */
/* FIND EMAIL BY MOBILE */
/* ================================================= */

const maskEmail = (email) => {

  const [name, domain] = email.split("@");

  return name[0] + "*****@" + domain;
};

const findEmailByMobile = async (req, res) => {

  try {

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false
      });
    }

    const users = await Register.find({
      phone,
      verified: true
    });

    const emails = users.map((u) => ({
      email: u.email,
      masked: maskEmail(u.email)
    }));

    res.json({
      success: true,
      emails
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }

};

/* ================================================= */
/* SEND FORGOT PASSWORD OTP */
/* ================================================= */

const sendForgotPasswordOTP = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not registered"
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;

    user.otpExpire = new Date(Date.now() + 5 * 60000);

    await user.save();

    await sendOTPEmail(
      email,
      otp,
      "Password Reset"
    );

    res.json({
      success: true
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }

};

/* ================================================= */
/* VERIFY OTP */
/* ================================================= */

const verifyForgotPasswordOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await Register.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    res.json({
      success: true
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }

};

/* ================================================= */
/* RESET PASSWORD */
/* ================================================= */

const resetPassword = async (req, res) => {

  try {

    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await Register.updateOne(
      { email },
      {
        $set: { password: hashed },
        $unset: { otp: "", otpExpire: "" }
      }
    );

    res.json({
      success: true
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }

};

module.exports = {
  sendRegisterOTP,
  verifyRegisterOTP,
  loginUser,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
  findEmailByMobile
};