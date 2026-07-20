import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
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

  // ================= KEEP ACTIVE TAB =================
  const [selectedType, setSelectedType] = useState(() => {
    return localStorage.getItem("portfolioSelectedType") || "stocks";
  });

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ================= SAVE ACTIVE TAB =================
  useEffect(() => {
    localStorage.setItem(
      "portfolioSelectedType",
      selectedType
    );
  }, [selectedType]);

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
      const type = (
        item.assetType ||
        item.type ||
        ""
      ).toLowerCase();

      if (selectedType === "stocks") {
        return type === "stocks";
      }

      if (selectedType === "ipo") {
        return type === "ipo";
      }

      if (selectedType === "sip") {
        return type === "sip";
      }

      return false;
    });
  }, [assets, selectedType]);

  /* ================= SORTED ================= */
  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      const valA = Number(a[sortKey] || 0);
      const valB = Number(b[sortKey] || 0);

      if (sortOrder === "asc") {
        return valA - valB;
      }

      return valB - valA;
    });
  }, [filteredAssets, sortKey, sortOrder]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(
    sortedAssets.length / ITEMS_PER_PAGE
  );

  const paginatedAssets = useMemo(() => {
    const start =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return sortedAssets.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [sortedAssets, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  /* ================= RESET PAGE ON TAB CHANGE ================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

  /* ================= SAFE REFRESH ================= */
  const refreshPortfolioData = useCallback(async () => {
    try {
      await fetchPortfolio();
    } catch (error) {
      console.error(
        "Portfolio Refresh Error:",
        error
      );
    }
  }, [fetchPortfolio]);

  /* ================= SELL ================= */
  const handleOpenSell = (asset) => {
    if (
      !asset.quantity ||
      asset.quantity <= 0
    ) {
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

  /* ================= SIP START / STOP ================= */
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

      // ================= REFRESH WITHOUT TAB RESET =================
      await refreshPortfolioData();
    } catch (error) {
      console.error(
        "Stop SIP Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "❌ Failed to update SIP"
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= SIP WITHDRAW ================= */
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

      // ================= REFRESH WITHOUT TAB RESET =================
      await refreshPortfolioData();
    } catch (error) {
      console.error(
        "Withdraw SIP Error:",
        error
      );

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
      <table className="w-full min-w-[950px] text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">
              Fund
            </th>

            <th className="p-4 text-center">
              Type
            </th>

            <th className="p-4 text-center">
              Monthly
            </th>

            <th className="p-4 text-center">
              Duration
            </th>

            <th className="p-4 text-center">
              Paid
            </th>

            <th
              onClick={() =>
                handleSort("invested")
              }
              className="p-4 text-center cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1">
                Invested
                <ArrowUpDown size={14} />
              </div>
            </th>

            <th
              onClick={() =>
                handleSort("current")
              }
              className="p-4 text-center cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1">
                Current
                <ArrowUpDown size={14} />
              </div>
            </th>

            <th
              onClick={() =>
                handleSort("profit")
              }
              className="p-4 text-center cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1">
                Profit
                <ArrowUpDown size={14} />
              </div>
            </th>

            <th className="p-4 text-center">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedAssets.map(
            (item, index) => {
              const isProfit =
                item.profit >= 0;

              const isStopped =
                item.status === "stopped";

              return (
                <tr
                  key={item._id || index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {item.assetName}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full text-white ${getTypeColor(
                        item.assetType
                      )}`}
                    >
                      {getTypeLabel(
                        item.assetType
                      )}
                    </span>
                  </td>

                  <td className="p-4 text-center font-medium">
                    ₹
                    {Number(
                      item.monthlyAmount
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 text-center">
                    {item.durationMonths} mo
                  </td>

                  <td className="p-4 text-center">
                    {item.installmentsPaid}
                  </td>

                  <td className="p-4 text-center">
                    ₹
                    {Number(
                      item.invested
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 text-center">
                    ₹
                    {Number(
                      item.current
                    ).toLocaleString("en-IN")}
                  </td>

                  <td
                    className={`p-4 text-center font-medium ${
                      isProfit
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹
                    {Number(
                      item.profit
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        disabled={
                          loadingId === item._id
                        }
                        onClick={() =>
                          handleStopSIP(item)
                        }
                        className={`px-4 py-1.5 rounded-lg text-white transition disabled:opacity-50 ${
                          isStopped
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {loadingId ===
                        item._id
                          ? "Loading..."
                          : isStopped
                          ? "Start"
                          : "Stop"}
                      </button>

                      <button
                        disabled={
                          loadingId === item._id
                        }
                        onClick={() =>
                          handleWithdrawSIP(
                            item
                          )
                        }
                        className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition disabled:opacity-50"
                      >
                        {loadingId ===
                        item._id
                          ? "Loading..."
                          : "Withdraw"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-5">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              handlePageChange(
                currentPage - 1
              )
            }
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map(
            (_, i) => (
              <button
                key={i}
                onClick={() =>
                  handlePageChange(i + 1)
                }
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              handlePageChange(
                currentPage + 1
              )
            }
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );

  /* ================= STOCK / IPO TABLE ================= */
  const renderNormalTable = () => (
    <>
      <table className="w-full min-w-[750px] text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4 text-left">
              Asset
            </th>

            <th className="p-4 text-center">
              Type
            </th>

            <th
              onClick={() =>
                handleSort("invested")
              }
              className="p-4 text-center cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1">
                Invested
                <ArrowUpDown size={14} />
              </div>
            </th>

            <th
              onClick={() =>
                handleSort("current")
              }
              className="p-4 text-center cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1">
                Current
                <ArrowUpDown size={14} />
              </div>
            </th>

            <th
              onClick={() =>
                handleSort("profit")
              }
              className="p-4 text-center cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1">
                Profit
                <ArrowUpDown size={14} />
              </div>
            </th>

            <th className="p-4 text-center">
              Qty
            </th>

            <th className="p-4 text-center">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedAssets.map(
            (item, index) => {
              const isProfit =
                item.profit >= 0;

              return (
                <tr
                  key={item._id || index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {item.assetName}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full text-white ${getTypeColor(
                        item.assetType
                      )}`}
                    >
                      {getTypeLabel(
                        item.assetType
                      )}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    ₹
                    {Number(
                      item.invested
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 text-center">
                    ₹
                    {Number(
                      item.current
                    ).toLocaleString("en-IN")}
                  </td>

                  <td
                    className={`p-4 text-center font-medium ${
                      isProfit
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹
                    {Number(
                      item.profit
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 text-center">
                    {item.quantity}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        handleOpenSell(item)
                      }
                      className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-5">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              handlePageChange(
                currentPage - 1
              )
            }
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map(
            (_, i) => (
              <button
                key={i}
                onClick={() =>
                  handlePageChange(i + 1)
                }
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              handlePageChange(
                currentPage + 1
              )
            }
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );

  /* ================= UI ================= */
  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* ================= TABS ================= */}
        <div className="flex gap-3 p-4 border-b bg-white">
          {["stocks", "ipo", "sip"].map(
            (type) => (
              <button
                key={type}
                onClick={() =>
                  setSelectedType(type)
                }
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedType === type
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type.toUpperCase()}
              </button>
            )
          )}
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          {selectedType === "sip"
            ? renderSIPTable()
            : renderNormalTable()}
        </div>
      </div>

      {/* ================= SELL MODAL ================= */}
      {selectedAsset && (
        <SellModal
          asset={selectedAsset}
          user={user}
          onClose={() =>
            setSelectedAsset(null)
          }
          onSuccess={async () => {
            await refreshPortfolioData();
          }}
        />
      )}
    </>
  );
};

export default PortfolioTable;