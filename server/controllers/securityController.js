const bcrypt = require("bcryptjs");
const Register = require("../models/Register");

/* ======================================================
 CHANGE PASSWORD
====================================================== */
exports.changePassword = async (req, res) => {
  try {
    /* ================= USER ================= */
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    /* ================= INPUT ================= */
    let { currentPassword, newPassword } = req.body;

    currentPassword = currentPassword?.trim();
    newPassword = newPassword?.trim();

    /* ================= VALIDATION ================= */
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    /* ================= FETCH USER ================= */
    const user = await Register.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "User password not set",
      });
    }

    /* ================= VERIFY CURRENT PASSWORD ================= */
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    /* ================= HASH NEW PASSWORD ================= */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    /* ================= SAVE ================= */
    user.password = hashedPassword;
    await user.save();

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("SECURITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};