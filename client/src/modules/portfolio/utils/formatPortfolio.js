const {
  calculateProfit,
  calculatePercentage,
} = require("./portfolioCalculations");

/* ======================================================
 FORMAT FINAL PORTFOLIO RESPONSE
====================================================== */
const formatPortfolio = (assets) => {
  let totalInvested = 0;
  let currentValue = 0;

  const formattedAssets = assets.map((item) => {
    const profit = calculateProfit(item.invested, item.current);
    const percentage = calculatePercentage(item.invested, profit);

    totalInvested += item.invested;
    currentValue += item.current;

    return {
      ...item,
      profit,
      percentage,
    };
  });

  const totalProfit = currentValue - totalInvested;
  const profitPercentage = calculatePercentage(
    totalInvested,
    totalProfit
  );

  /* ================= ALLOCATION ================= */
  const allocationMap = {};

  formattedAssets.forEach((item) => {
    if (!allocationMap[item.type]) {
      allocationMap[item.type] = 0;
    }
    allocationMap[item.type] += item.current;
  });

  const allocation = Object.keys(allocationMap).map((key) => ({
    type: key,
    value: (
      (allocationMap[key] / currentValue) *
      100
    ).toFixed(2),
  }));

  return {
    summary: {
      totalInvested,
      currentValue,
      totalProfit,
      profitPercentage,
    },
    allocation,
    assets: formattedAssets,
  };
};

module.exports = formatPortfolio;