import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./shared/layout/MainLayout";

/* ================= PROTECTED ROUTE ================= */
import ProtectedRoute from "./shared/components/ProtectedRoute";

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

/* ================= PORTFOLIO PAGES ================= */
import PortfolioPage from "./modules/portfolio/pages/PortfolioPage";
import PortfolioDetailPage from "./modules/portfolio/pages/PortfolioDetailPage";

/* 🔥 IMPORT PROVIDER (IMPORTANT FIX) */
import { PortfolioProvider } from "./modules/portfolio/context/PortfolioContext";

/* ================= MARKET NEWS ================= */
import MarketNewsPage from "./modules/marketNews/pages/MarketNewsPage";

/* ================= WATCHLIST ================= */
import WatchlistPage from "./modules/watchlist/pages/WatchlistPage";

/* ================= PROFILE ================= */
import Profile from "./pages/Profile";

/* ================= SETTINGS ================= */
import Settings from "./pages/Settings";
import ProfileUpdate from "./shared/components/ProfileUpdate";
import SendReport from "./pages/SendReport";

/* ================= SECURITY ================= */
import SecurityPage from "./pages/SecurityPage";

function App() {
  return (
    <BrowserRouter>
      {/* ================= GLOBAL TOASTER ================= */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        {/* ================= AUTH ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ================= MAIN LAYOUT ================= */}
        <Route path="/" element={<MainLayout />}>
          
          {/* ================= HOME ================= */}
          <Route index element={<HomePage />} />

          {/* ================= PROTECTED ================= */}

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile-update"
            element={
              <ProtectedRoute>
                <ProfileUpdate />
              </ProtectedRoute>
            }
          />

          <Route
            path="send-report"
            element={
              <ProtectedRoute>
                <SendReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="security"
            element={
              <ProtectedRoute>
                <SecurityPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />

          {/* ================= PORTFOLIO (🔥 FIXED) ================= */}
          <Route
            path="portfolio"
            element={
              <ProtectedRoute>
                <PortfolioProvider>
                  <PortfolioPage />
                </PortfolioProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="portfolio/:id"
            element={
              <ProtectedRoute>
                <PortfolioProvider>
                  <PortfolioDetailPage />
                </PortfolioProvider>
              </ProtectedRoute>
            }
          />

          {/* ================= STOCK ================= */}
          <Route path="stock">
            <Route index element={<StockPage />} />
            <Route path=":symbol" element={<StockDetailPage />} />
          </Route>

          {/* ================= SIP ================= */}
          <Route path="sip">
            <Route index element={<SIPPage />} />
            <Route path="planner" element={<SIPPlannerPage />} />
            <Route path=":id" element={<SIPDetailPage />} />
          </Route>

          {/* ================= IPO ================= */}
          <Route path="ipo" element={<IPOPage />} />

          <Route
            path="ipo/application-process"
            element={<IPOApplicationProcessPage />}
          />

          {/* ================= NEWS ================= */}
          <Route path="market-news" element={<MarketNewsPage />} />
        </Route>

        {/* ================= OUTSIDE ================= */}
        <Route path="/ipo/apply/:symbol" element={<IPOApplyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;