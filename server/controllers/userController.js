const User = require("../models/Register");

/* ======================================================
   GET USER PROFILE BY EMAIL
====================================================== */

const getUserProfileByEmail = async (req, res) => {
  try {

    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {

    console.error("Profile Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

module.exports = {
  getUserProfileByEmail
};