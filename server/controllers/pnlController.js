const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const { getPnLData } = require("../services/pnlService");

const getPnL = asyncHandler(async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({
      success: false,
      message: "userEmail required",
    });
  }

  const data = await getPnLData(userEmail);

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = { getPnL };