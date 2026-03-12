import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./shared/layout/MainLayout";

/* ================= HOME ================= */

import HomePage from "./pages/HomePage";

/* ================= AUTH PAGES ================= */

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

/* ================= IPO PAGES ================= */

import IPOPage from "./modules/ipo/pages/IPOPage";
import IPOApplicationProcessPage from "./modules/ipo/pages/IPOApplicationProcessPage";
import IPOApplyPage from "./modules/ipo/pages/IPOApplyPage";

/* ================= SIP PAGES ================= */

import SIPPage from "./modules/sip/pages/SIPPage";
import SIPDetailPage from "./modules/sip/pages/SIPDetailPage";
import SIPPlannerPage from "./modules/sip/pages/SIPPlannerPage";

/* ================= STOCK PAGES ================= */

import StockPage from "./modules/stock/pages/StockPage";
import StockDetailPage from "./modules/stock/pages/StockDetailPage";

/* ================= MARKET NEWS ================= */

import MarketNewsPage from "./modules/marketNews/pages/MarketNewsPage";

/* ================= WATCHLIST PAGE ================= */

import WatchlistPage from "./modules/watchlist/pages/WatchlistPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH ROUTES ================= */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ================= MAIN LAYOUT ================= */}

        <Route path="/" element={<MainLayout />}>

          {/* ================= HOME ================= */}

          <Route index element={<HomePage />} />

          {/* ================= STOCK ROUTES ================= */}

          <Route path="stock">
            <Route index element={<StockPage />} />
            <Route path=":symbol" element={<StockDetailPage />} />
          </Route>

          {/* ================= SIP ROUTES ================= */}

          <Route path="sip">
            <Route index element={<SIPPage />} />
            <Route path="planner" element={<SIPPlannerPage />} />
            <Route path=":id" element={<SIPDetailPage />} />
          </Route>

          {/* ================= IPO ROUTES ================= */}

          <Route path="ipo" element={<IPOPage />} />

          <Route
            path="ipo/application-process"
            element={<IPOApplicationProcessPage />}
          />

          {/* ================= MARKET NEWS ================= */}

          <Route path="market-news" element={<MarketNewsPage />} />

          {/* ================= WATCHLIST ================= */}

          <Route path="watchlist" element={<WatchlistPage />} />

        </Route>

        {/* ================= OUTSIDE LAYOUT ================= */}

        <Route path="ipo/apply/:symbol" element={<IPOApplyPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;