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
  } = usePortfolioContext();

  const [activeTab, setActiveTab] = useState("portfolio");

  const tabs = [
    "portfolio",
    "transactions",
    "wallet",
    "analytics",
    "pnl",
    "orders",
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 md:px-6 py-4">

      {/* ================= HEADER ================= */}
      <PortfolioHeader />

      {/* ================= TABS ================= */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 mt-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-white text-gray-600 border hover:bg-gray-100"
            }`}
          >
            {tab === "pnl" ? "P&L" : tab}
          </button>
        ))}
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <PortfolioLoader />
      ) : (
        <div className="space-y-6">

          {activeTab === "portfolio" && (
            <PortfolioView
              assets={assets}
              summary={summary}
              allocation={allocation}
            />
          )}

          {/* ✅ UPDATED */}
          {activeTab === "transactions" && (
            <TransactionsView transactions={transactions} />
          )}

          {activeTab === "wallet" && <WalletPage />}

          {activeTab === "analytics" && <AnalyticsView />}

          {activeTab === "pnl" && <PnLView summary={summary} />}

          {activeTab === "orders" && <OrdersView />}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;