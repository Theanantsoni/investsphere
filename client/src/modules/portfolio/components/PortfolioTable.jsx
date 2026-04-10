import React, { useState, useMemo } from "react";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  getTypeLabel,
  getTypeColor,
} from "../constants/portfolioConstants";
import { usePortfolioContext } from "../context/PortfolioContext";

/* ✅ FIXED IMPORT */
import SellModal from "./SellModal";

/* ======================================================
 COMPONENT
====================================================== */
const PortfolioTable = ({ assets, fetchPortfolio }) => {
  const { user } = usePortfolioContext();

  const [sortKey, setSortKey] = useState("invested");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedAsset, setSelectedAsset] = useState(null);

  /* ======================================================
 SORT HANDLER
====================================================== */
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  /* ======================================================
 SORTED DATA
====================================================== */
  const sortedAssets = useMemo(() => {
    if (!assets || assets.length === 0) return [];

    return [...assets].sort((a, b) => {
      const valA = a[sortKey] || 0;
      const valB = b[sortKey] || 0;

      if (sortOrder === "asc") return valA - valB;
      return valB - valA;
    });
  }, [assets, sortKey, sortOrder]);

  /* ======================================================
 OPEN SELL MODAL
====================================================== */
  const handleOpenSell = (asset) => {
    if (!asset.quantity || asset.quantity <= 0) {
      alert("❌ No quantity available");
      return;
    }
    setSelectedAsset(asset);
  };

  /* ======================================================
 EMPTY STATE
====================================================== */
  if (!assets || assets.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 text-center text-gray-500 border border-gray-100">
        <p className="text-lg font-medium">
          No portfolio data available
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Start investing to see your assets here
        </p>
      </div>
    );
  }

  /* ======================================================
 RENDER
====================================================== */
  return (
    <>
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left font-semibold">Asset</th>
                <th className="p-4 text-center font-semibold">Type</th>

                <th
                  className="p-4 text-center cursor-pointer"
                  onClick={() => handleSort("invested")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Invested <ArrowUpDown size={14} />
                  </div>
                </th>

                <th
                  className="p-4 text-center cursor-pointer"
                  onClick={() => handleSort("current")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Current <ArrowUpDown size={14} />
                  </div>
                </th>

                <th
                  className="p-4 text-center cursor-pointer"
                  onClick={() => handleSort("profit")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Profit <ArrowUpDown size={14} />
                  </div>
                </th>

                <th className="p-4 text-center font-semibold">Qty</th>
                <th className="p-4 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {sortedAssets.map((item, index) => {
                const isProfit = item.profit >= 0;

                return (
                  <tr
                    key={item._id || `${item.type}-${index}`}
                    className="border-t hover:bg-gray-50/70 transition"
                  >
                    <td className="p-4 font-medium">
                      {item.assetName || item.name}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`text-xs px-3 py-1 rounded-full text-white ${getTypeColor(
                          item.assetType || item.type
                        )}`}
                      >
                        {getTypeLabel(item.assetType || item.type)}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      ₹{Number(item.invested).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4 text-center">
                      ₹{Number(item.current).toLocaleString("en-IN")}
                    </td>

                    <td
                      className={`p-4 text-center ${
                        isProfit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{Number(item.profit).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4 text-center">
                      {item.quantity || 0}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenSell(item)}
                        disabled={!item.quantity}
                        className="px-4 py-1.5 rounded-lg bg-red-500 text-white"
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedAsset && (
        <SellModal
          asset={selectedAsset}
          user={user}
          onClose={() => setSelectedAsset(null)}
          onSuccess={fetchPortfolio}
        />
      )}
    </>
  );
};

export default PortfolioTable;