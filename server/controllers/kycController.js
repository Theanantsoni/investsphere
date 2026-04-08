const KYC = require("../models/KYCModel");

exports.submitKYC = async (req, res) => {
  try {
    const data = await KYC.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};