const User = require("../models/User");

// ============================================
// REGISTER USER
// ============================================

const registerUser = async (req, res) => {

  try {

    const { name, email, phone, country, state, pan, dob } = req.body;

    if (!name || !email || !phone || !country || !state || !pan || !dob) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      country,
      state,
      pan,
      dob
    });

    res.json({
      success: true,
      user
    });

  } catch (error) {

    console.log("Register error:", error.message);

    res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = {
  registerUser
};