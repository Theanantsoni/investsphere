// src/utils/format.js

/* =========================================
   DATE FORMATTER
========================================= */

export const formatDate = (date) => {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

/* =========================================
   TIME FORMATTER
========================================= */

export const formatTime = (date) => {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

/* =========================================
   CURRENCY FORMATTER
========================================= */

export const formatCurrency = (amount, currency = "INR") => {
  if (amount === null || amount === undefined) return "-";

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
};

/* =========================================
   NUMBER FORMATTER
========================================= */

export const formatNumber = (num) => {
  if (num === null || num === undefined) return "-";

  return new Intl.NumberFormat("en-IN").format(num);
};

/* =========================================
   PERCENT FORMAT
========================================= */

export const formatPercent = (value) => {
  if (value === null || value === undefined) return "-";

  return `${value > 0 ? "+" : ""}${value}%`;
};

/* =========================================
   STRING TRUNCATE
========================================= */

export const truncateText = (text, max = 20) => {
  if (!text) return "-";

  return text.length > max
    ? text.substring(0, max) + "..."
    : text;
};

/* =========================================
   CAPITALIZE
========================================= */

export const capitalize = (text) => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
};