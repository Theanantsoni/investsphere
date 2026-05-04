import React, { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  getTypeLabel,
  getTypeColor,
} from "../constants/portfolioConstants";
import { usePortfolioContext } from "../context/PortfolioContext";
import SellModal from "./SellModal";
import axios from "axios";

const ITEMS_PER_PAGE = 5;

const PortfolioTable = ({ assets, fetchPortfolio }) => {
  const { user } = usePortfolioContext();

  const [sortKey, setSortKey] = useState("invested");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedType, setSelectedType] = useState("stocks");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      const valA = Number(a[sortKey] || 0);
      const valB = Number(b[sortKey] || 0);

      if (sortOrder === "asc") return valA - valB;
      return valB - valA;
    });
  }, [filteredAssets, sortKey, sortOrder]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(sortedAssets.length / ITEMS_PER_PAGE);

  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAssets.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedAssets, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /* ================= RESET PAGE ON FILTER ================= */
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

  /* ================= SELL ================= */
  const handleOpenSell = (asset) => {
    if (!asset.quantity || asset.quantity <= 0) {
      alert("❌ No quantity available");
      return;
    }

    const fixedAsset = {
      ...asset,
      assetType:
        asset.assetType === "stocks"
          ? "stock"
          : asset.assetType === "ipo"
          ? "ipo"
          : asset.assetType,
    };

    setSelectedAsset(fixedAsset);
  };

  /* ================= SIP ACTIONS ================= */
  const handleStopSIP = async (item) => {
    const confirmAction = window.confirm(
      item.status === "stopped"
        ? "Restart this SIP?"
        : "Stop this SIP?"
    );
    if (!confirmAction) return;

    try {
      setLoadingId(item._id);

      await axios.put(
        `http://localhost:5000/api/sip-investments/stop/${item._id}`
      );

      alert(
        item.status === "stopped"
          ? "✅ SIP Restarted Successfully"
          : "✅ SIP Stopped Successfully"
      );

      await fetchPortfolio();
    } catch (error) {
      console.error("Stop SIP Error:", error);

      alert(
        error?.response?.data?.message ||
          "❌ Failed to update SIP"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleWithdrawSIP = async (item) => {
    const confirmAction = window.confirm(
      "Withdraw this SIP? Amount will be credited to wallet."
    );
    if (!confirmAction) return;

    try {
      setLoadingId(item._id);

      await axios.put(
        `http://localhost:5000/api/sip-investments/withdraw/${item._id}`
      );

      alert("✅ SIP Withdrawn Successfully");
      await fetchPortfolio();
    } catch (error) {
      console.error("Withdraw SIP Error:", error);

      alert(
        error?.response?.data?.message ||
          "❌ Failed to withdraw SIP"
      );
    } finally {
      setLoadingId(null);
    }
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
    <>
      <table className="w-full text-sm min-w-[900px]">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Fund</th>
            <th className="p-4 text-center">Type</th>
            <th className="p-4 text-center">Monthly</th>
            <th className="p-4 text-center">Duration</th>
            <th className="p-4 text-center">Paid</th>
            <th className="p-4 text-center cursor-pointer" onClick={() => handleSort("invested")}>
              Invested <ArrowUpDown size={14} />
            </th>
            <th className="p-4 text-center cursor-pointer" onClick={() => handleSort("current")}>
              Current <ArrowUpDown size={14} />
            </th>
            <th className="p-4 text-center cursor-pointer" onClick={() => handleSort("profit")}>
              Profit <ArrowUpDown size={14} />
            </th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {paginatedAssets.map((item, index) => {
            const isProfit = item.profit >= 0;
            const isStopped = item.status === "stopped";

            return (
              <tr key={item._id || index} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{item.assetName}</td>

                <td className="p-4 text-center">
                  <span className={`text-xs px-3 py-1 rounded-full text-white ${getTypeColor(item.assetType)}`}>
                    {getTypeLabel(item.assetType)}
                  </span>
                </td>

                <td className="p-4 text-center">₹{Number(item.monthlyAmount).toLocaleString("en-IN")}</td>
                <td className="p-4 text-center">{item.durationMonths} mo</td>
                <td className="p-4 text-center">{item.installmentsPaid}</td>

                <td className="p-4 text-center">₹{Number(item.invested).toLocaleString("en-IN")}</td>
                <td className="p-4 text-center">₹{Number(item.current).toLocaleString("en-IN")}</td>

                <td className={`p-4 text-center ${isProfit ? "text-green-600" : "text-red-600"}`}>
                  ₹{Number(item.profit).toLocaleString("en-IN")}
                </td>

                <td className="p-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      disabled={loadingId === item._id}
                      onClick={() => handleStopSIP(item)}
                      className={`px-3 py-1 text-white rounded ${isStopped ? "bg-green-500" : "bg-yellow-500"}`}
                    >
                      {isStopped ? "Start" : "Stop"}
                    </button>

                    <button
                      disabled={loadingId === item._id}
                      onClick={() => handleWithdrawSIP(item)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Withdraw
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ================= PAGINATION UI ================= */}
      <div className="flex justify-center items-center gap-2 p-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </>
  );

  /* ================= STOCK / IPO TABLE ================= */
  const renderNormalTable = () => (
    <>
      <table className="w-full text-sm min-w-[700px]">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">Asset</th>
            <th className="p-4 text-center">Type</th>
            <th className="p-4 text-center cursor-pointer" onClick={() => handleSort("invested")}>
              Invested <ArrowUpDown size={14} />
            </th>
            <th className="p-4 text-center cursor-pointer" onClick={() => handleSort("current")}>
              Current <ArrowUpDown size={14} />
            </th>
            <th className="p-4 text-center cursor-pointer" onClick={() => handleSort("profit")}>
              Profit <ArrowUpDown size={14} />
            </th>
            <th className="p-4 text-center">Qty</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {paginatedAssets.map((item, index) => {
            const isProfit = item.profit >= 0;

            return (
              <tr key={item._id || index} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{item.assetName}</td>

                <td className="p-4 text-center">
                  <span className={`text-xs px-3 py-1 rounded-full text-white ${getTypeColor(item.assetType)}`}>
                    {getTypeLabel(item.assetType)}
                  </span>
                </td>

                <td className="p-4 text-center">₹{Number(item.invested).toLocaleString("en-IN")}</td>
                <td className="p-4 text-center">₹{Number(item.current).toLocaleString("en-IN")}</td>

                <td className={`p-4 text-center ${isProfit ? "text-green-600" : "text-red-600"}`}>
                  ₹{Number(item.profit).toLocaleString("en-IN")}
                </td>

                <td className="p-4 text-center">{item.quantity}</td>

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

      {/* ================= PAGINATION UI ================= */}
      <div className="flex justify-center items-center gap-2 p-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </>
  );

  /* ================= UI ================= */
  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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

        <div className="overflow-x-auto">
          {selectedType === "sip"
            ? renderSIPTable()
            : renderNormalTable()}
        </div>
      </div>

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