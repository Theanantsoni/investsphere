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

const App = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]">
        <Loader fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white antialiased">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* PUBLIC */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <div className="min-h-screen flex items-center justify-center px-4">
                  <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-300">
                    <Login />
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* PRIVATE */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div className="min-h-screen flex w-full">
                  <Layout user={user} />
                </div>
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
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;