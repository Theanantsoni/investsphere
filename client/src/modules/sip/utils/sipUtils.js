// =======================
// MIN SIP LOGIC
// =======================
export const getFundMinSip = (schemeCode) => {
  const lastDigit = Number(schemeCode?.toString().slice(-1) || 0);

  if (lastDigit % 4 === 0) return 10000;
  if (lastDigit % 3 === 0) return 5000;
  if (lastDigit % 2 === 0) return 1000;

  return 500;
};

// =======================
// CATEGORY DETECTION LOGIC
// =======================
export const getFundCategory = (schemeName = "") => {
  const name = schemeName.toLowerCase();

  // Hybrid FIRST (important)
  if (
    name.includes("hybrid") ||
    name.includes("balanced") ||
    name.includes("advantage")
  ) {
    return "Hybrid";
  }

  // Debt
  if (
    name.includes("debt") ||
    name.includes("liquid") ||
    name.includes("bond") ||
    name.includes("income") ||
    name.includes("duration")
  ) {
    return "Debt";
  }

  // Equity
  if (
    name.includes("equity") ||
    name.includes("large") ||
    name.includes("mid") ||
    name.includes("small") ||
    name.includes("flexi") ||
    name.includes("growth")
  ) {
    return "Equity";
  }

  return "Equity"; // fallback
};

// =======================
// RISK LOGIC
// =======================
export const getFundRisk = (schemeName = "") => {
  const category = getFundCategory(schemeName);

  if (category === "Debt") return "Low";
  if (category === "Hybrid") return "Medium";
  return "High";
};