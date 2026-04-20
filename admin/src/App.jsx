// src/App.jsx

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Layout from "./components/Layout";
import Loader from "./components/Loader";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Stocks from "./pages/Stocks";
import SIP from "./pages/SIP";
import IPO from "./pages/IPO";
import Transactions from "./pages/Transactions";
import Wallets from "./pages/Wallets";
import Watchlist from "./pages/Watchlist";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import SendMessage from "./pages/SendMessage";

const App = () => {
  const { user, loading, isAuthenticated } = useAuth();

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]">
        <Loader fullScreen />
      </div>
    );
  }

  /* ================= APP ================= */
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white antialiased">
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <div className="min-h-screen flex items-center justify-center px-4">
                  <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
                    <Login />
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* ================= PRIVATE ================= */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Layout user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="sip" element={<SIP />} />
            <Route path="ipo" element={<IPO />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="wallets" element={<Wallets />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="send-messages" element={<SendMessage />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;