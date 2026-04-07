/* ======================================================
 STOCK CURRENT VALUE (SIMULATION)
====================================================== */
const calculateStockCurrentValue = (stock) => {
  // 🔥 future: real market price API
  const growthFactor = 1.1; // +10%
  return stock.totalAmount * growthFactor;
};

/* ======================================================
 IPO CURRENT VALUE (SIMULATION)
====================================================== */
const calculateIPOCurrentValue = (ipo) => {
  const growthFactor = 1.15; // +15%
  return ipo.totalAmount * growthFactor;
};

/* ======================================================
 PROFIT CALCULATION
====================================================== */
const calculateProfit = (invested, current) => {
  return current - invested;
};

/* ======================================================
 PERCENTAGE CALCULATION
====================================================== */
const calculatePercentage = (invested, profit) => {
  if (invested === 0) return 0;
  return ((profit / invested) * 100).toFixed(2);
};

module.exports = {
  calculateStockCurrentValue,
  calculateIPOCurrentValue,
  calculateProfit,
  calculatePercentage,
};