import React, { useState } from "react";
import { usePortfolioContext } from "../context/PortfolioContext";

import PortfolioHeader from "../components/PortfolioHeader";
import PortfolioLoader from "../components/PortfolioLoader";

/* MAIN VIEWS */
import PortfolioView from "../components/PortfolioView";
import TransactionsView from "../components/TransactionsView";
import AnalyticsView from "../components/AnalyticsView";
import PnLView from "../components/PnLView";
import OrdersView from "../components/OrdersView";

/* ✅ WALLET */
import WalletPage from "../../wallet/pages/WalletPage";

/* ======================================================
 PAGE
====================================================== */
const PortfolioPage = () => {
  const {
    assets,
    summary,
    allocation,
    loading,
    transactions,
    fetchPortfolio, // ✅ IMPORTANT FIX
  } = usePortfolioContext();

  const [activeTab, setActiveTab] = useState("portfolio");

  const tabs = [
    { key: "portfolio", label: "Portfolio" },
    { key: "transactions", label: "Transactions" },
    { key: "wallet", label: "Wallet" },
    { key: "analytics", label: "Analytics" },
    { key: "pnl", label: "P&L" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-3 sm:px-4 md:px-6 py-4">
      
      {/* ================= HEADER ================= */}
      <PortfolioHeader />

      {/* ================= TABS ================= */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 shadow-sm ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:shadow"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <PortfolioLoader />
      ) : (
        <div className="space-y-6 animate-fadeIn">

          {/* ================= PORTFOLIO ================= */}
          {activeTab === "portfolio" && (
            <PortfolioView
              assets={assets}
              summary={summary}
              allocation={allocation}
              fetchPortfolio={fetchPortfolio} // ✅ PASS FIX
            />
          )}

          {/* ================= TRANSACTIONS ================= */}
          {activeTab === "transactions" && (
            <TransactionsView transactions={transactions} />
          )}

          {/* ================= WALLET ================= */}
          {activeTab === "wallet" && <WalletPage />}

          {/* ================= ANALYTICS ================= */}
          {activeTab === "analytics" && <AnalyticsView />}

          {/* ================= PNL ================= */}
          {activeTab === "pnl" && (
            <PnLView summary={summary} />
          )}

          {/* ================= ORDERS ================= */}
          {activeTab === "orders" && <OrdersView />}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;