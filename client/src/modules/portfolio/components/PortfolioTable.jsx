import React, { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  getTypeLabel,
  getTypeColor,
} from "../constants/portfolioConstants";
import { usePortfolioContext } from "../context/PortfolioContext";
import SellModal from "./SellModal";

const PortfolioTable = ({ assets, fetchPortfolio }) => {
  const { user } = usePortfolioContext();

  const [sortKey, setSortKey] = useState("invested");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedType, setSelectedType] = useState("stocks");
  const [selectedAsset, setSelectedAsset] = useState(null);

  /* ================= SORT ================= */
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

  /* ================= FILTER ================= */
  const filteredAssets = useMemo(() => {
    if (!assets) return [];

    return assets.filter((item) => {
      const type = (item.assetType || item.type || "").toLowerCase();

      if (selectedType === "stocks") return type === "stocks";
      if (selectedType === "ipo") return type === "ipo";
      if (selectedType === "sip") return type === "sip";

      return false;
    });
  }, [assets, selectedType]);

  /* ================= SORTED ================= */
  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      const valA = a[sortKey] || 0;
      const valB = b[sortKey] || 0;

      if (sortOrder === "asc") return valA - valB;
      return valB - valA;
    });
  }, [filteredAssets, sortKey, sortOrder]);

  /* ================= SELL ================= */
  const handleOpenSell = (asset) => {
    if (!asset.quantity || asset.quantity <= 0) {
      alert("❌ No quantity available");
      return;
    }
    setSelectedAsset(asset);
  };

  /* ================= EMPTY ================= */
  if (!assets || assets.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
        No portfolio data available
      </div>
    );
  }

  /* ================= SIP TABLE ================= */
  const renderSIPTable = () => (
    <table className="w-full text-sm min-w-[900px]">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="p-4 text-left">Fund</th>
          <th className="p-4 text-center">Type</th>

          <th className="p-4 text-center">Monthly</th>
          <th className="p-4 text-center">Duration</th>
          <th className="p-4 text-center">Paid</th>

          <th
            className="p-4 text-center cursor-pointer"
            onClick={() => handleSort("invested")}
          >
            Invested <ArrowUpDown size={14} />
          </th>

          <th
            className="p-4 text-center cursor-pointer"
            onClick={() => handleSort("current")}
          >
            Current <ArrowUpDown size={14} />
          </th>

          <th
            className="p-4 text-center cursor-pointer"
            onClick={() => handleSort("profit")}
          >
            Profit <ArrowUpDown size={14} />
          </th>

          <th className="p-4 text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {sortedAssets.map((item, index) => {
          const isProfit = item.profit >= 0;

          return (
            <tr
              key={item._id || index}
              className="border-t hover:bg-gray-50"
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
                ₹{item.monthlyAmount || 0}
              </td>

              <td className="p-4 text-center">
                {item.durationMonths || 0} mo
              </td>

              <td className="p-4 text-center">
                {item.installmentsPaid || 0}
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
                <div className="flex gap-2 justify-center">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded">
                    Stop
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded">
                    Withdraw
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  /* ================= STOCK / IPO TABLE ================= */
  const renderNormalTable = () => (
    <table className="w-full text-sm min-w-[700px]">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="p-4 text-left">Asset</th>
          <th className="p-4 text-center">Type</th>

          <th
            className="p-4 text-center cursor-pointer"
            onClick={() => handleSort("invested")}
          >
            Invested <ArrowUpDown size={14} />
          </th>

          <th
            className="p-4 text-center cursor-pointer"
            onClick={() => handleSort("current")}
          >
            Current <ArrowUpDown size={14} />
          </th>

          <th
            className="p-4 text-center cursor-pointer"
            onClick={() => handleSort("profit")}
          >
            Profit <ArrowUpDown size={14} />
          </th>

          <th className="p-4 text-center">Qty</th>
          <th className="p-4 text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {sortedAssets.map((item, index) => {
          const isProfit = item.profit >= 0;

          return (
            <tr
              key={item._id || index}
              className="border-t hover:bg-gray-50"
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
  );

  /* ================= UI ================= */
  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* FILTER BUTTONS */}
        <div className="flex gap-3 p-4 border-b">
          {["stocks", "ipo", "sip"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {selectedType === "sip"
            ? renderSIPTable()
            : renderNormalTable()}
        </div>
      </div>

      {/* SELL MODAL */}
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