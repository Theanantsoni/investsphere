const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const {
  getAnalyticsData,
} = require("../services/analyticsService");

/* ======================================================
  GET ANALYTICS
====================================================== */

const getAnalytics = asyncHandler(async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({
      success: false,
      message: "userEmail is required",
    });
  }

  const data = await getAnalyticsData(userEmail);

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  getAnalytics,
};