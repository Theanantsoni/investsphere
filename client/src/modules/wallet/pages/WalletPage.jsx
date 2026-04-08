import React, { useState } from "react";
import { useWallet } from "../hooks/useWallet";

import WalletBalance from "../components/WalletBalance";
import WalletActions from "../components/WalletActions";
import WalletTransactionsTable from "../components/WalletTransactionsTable";
import WalletFilters from "../components/WalletFilters";
import WalletSearch from "../components/WalletSearch";
import WalletAnalytics from "../components/WalletAnalytics";
import WalletTransfer from "../components/WalletTransfer";
import WalletCards from "../components/WalletCards";
import WalletSecurity from "../components/WalletSecurity";
import WalletKYC from "../components/WalletKYC";

const WalletPage = () => {
  const {
    wallet,
    loading,
    popupError,
    setPopupError,
    handleAdd,
    handleWithdraw,
    handleTransfer,
  } = useWallet();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  if (!wallet) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-gray-500 text-lg">Loading wallet...</p>
      </div>
    );
  }

  let filtered = wallet.transactions || [];

  if (filter !== "all") {
    filtered = filtered.filter((t) => t.type === filter);
  }

  if (search) {
    filtered = filtered.filter((t) =>
      t.description?.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= GRID TOP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WalletBalance balance={wallet.balance} />

        <WalletActions
          onAdd={handleAdd}
          onWithdraw={handleWithdraw}
          loading={loading}
        />

        <WalletTransfer onTransfer={handleTransfer} />
      </div>

      {/* ================= ANALYTICS ================= */}
      <WalletAnalytics transactions={wallet.transactions} />

      {/* ================= FILTER + SEARCH ================= */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <WalletFilters setFilter={setFilter} />
        <WalletSearch setSearch={setSearch} />
      </div>

      {/* ❌ INLINE ERROR REMOVED */}

      {/* ================= TABLE ================= */}
      <WalletTransactionsTable transactions={filtered} />

      {/* ================= EXTRA ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WalletCards />
        <WalletSecurity />
        <WalletKYC />
      </div>

      {/* ================= POPUP ERROR ================= */}
      {popupError && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-sm text-center space-y-4 shadow-xl">

            <h2 className="text-lg font-semibold text-red-600">
              Warning
            </h2>

            <p className="text-gray-700">{popupError}</p>

            <button
              onClick={() => setPopupError("")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;