// src/utils/constants.js

/* =========================================
   APP CONFIG
========================================= */

export const APP_NAME = "InvestSphere Admin";

/* =========================================
   ROUTES
========================================= */

export const ROUTES = {
  DASHBOARD: "/",
  USERS: "/users",
  STOCKS: "/stocks",
  SIP: "/sip",
  IPO: "/ipo",
  TRANSACTIONS: "/transactions",
  WALLETS: "/wallets",
  WATCHLIST: "/watchlist",
  REPORTS: "/reports",
  LOGIN: "/login",
};

/* =========================================
   STATUS COLORS (Tailwind classes)
========================================= */

export const STATUS_STYLES = {
  success: "bg-green-500/10 text-green-400",
  pending: "bg-yellow-500/10 text-yellow-400",
  failed: "bg-red-500/10 text-red-400",
};

/* =========================================
   TABLE DEFAULTS
========================================= */

export const TABLE_PAGE_SIZE = 10;

/* =========================================
   DATE FORMATS
========================================= */

export const DATE_FORMAT = "DD MMM YYYY";

/* =========================================
   CURRENCY
========================================= */

export const DEFAULT_CURRENCY = "INR";

/* =========================================
   EMPTY STATES
========================================= */

export const EMPTY_MESSAGES = {
  USERS: "No users found",
  STOCKS: "No stock investments",
  SIP: "No SIP data",
  IPO: "No IPO records",
  TRANSACTIONS: "No transactions available",
  WALLETS: "No wallets found",
  WATCHLIST: "No watchlist items",
  REPORTS: "No reports available",
};

/* =========================================
   LOCAL STORAGE KEYS
========================================= */

export const STORAGE_KEYS = {
  TOKEN: "admin_token",
};