const Register = require("../models/Register");
const Otp = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const { sendOTPEmail } = require("../services/emailService");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ===================================
SEND OTP
=================================== */

exports.sendProfileUpdateOTP = async (req, res) => {
  try {
    const { email, field, value } = req.body;

    if (!email || !field || !value) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!["phone", "password"].includes(field)) {
      return res.status(400).json({ message: "Invalid field" });
    }

    const otp = generateOTP();
    const expireMinutes = process.env.OTP_EXPIRE_MINUTES || 5;

    const expiresAt = new Date(Date.now() + expireMinutes * 60000);

    await Otp.create({
      email,
      otp,
      field,
      value,
      expiresAt
    });

    await sendOTPEmail(email, otp, `Update ${field}`);

    res.json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "OTP sending failed"
    });
  }
};

/* ===================================
VERIFY OTP AND UPDATE FIELD
=================================== */

exports.verifyOTPAndUpdate = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const otpDoc = await Otp.findOne({ email, otp });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const { field, value } = otpDoc;

    let updateValue = value;

    if (field === "password") {
      const salt = await bcrypt.genSalt(10);
      updateValue = await bcrypt.hash(value, salt);
    }

    await Register.updateOne(
      { email },
      { $set: { [field]: updateValue } }
    );

    await Otp.deleteOne({ _id: otpDoc._id });

    res.json({
      message: `${field} updated successfully`
    });

  } catch (error) {

    res.status(500).json({
      message: "Update failed"
    });

  }
};