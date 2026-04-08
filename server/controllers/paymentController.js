exports.processPayment = async (req, res) => {
  try {
    // Demo payment
    res.json({
      success: true,
      message: "Payment simulated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
