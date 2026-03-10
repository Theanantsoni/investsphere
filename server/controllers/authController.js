const User = require("../models/User");

const registerUser = async (req, res) => {
  try {

    const { name, email, phone, country, state, pan, dob } = req.body;

    if (!name || !email || !phone || !country || !state || !pan || !dob) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      country,
      state,
      pan,
      dob,
    });

    res.status(201).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  registerUser,
};