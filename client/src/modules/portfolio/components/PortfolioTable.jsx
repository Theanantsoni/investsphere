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

/* ======================================================
 COMPONENT
====================================================== */
const PortfolioTable = ({ assets }) => {
  const [sortKey, setSortKey] = useState("invested");
  const [sortOrder, setSortOrder] = useState("desc");

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
 EMPTY STATE
====================================================== */
  if (!assets || assets.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
        No portfolio data available
      </div>
    );
  }

  /* ======================================================
 RENDER
====================================================== */
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* HEADER */}
          <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">Asset</th>

              <th className="p-3 text-center">Type</th>

              <th
                className="p-3 text-center cursor-pointer select-none"
                onClick={() => handleSort("invested")}
              >
                <div className="flex items-center justify-center gap-1">
                  Invested <ArrowUpDown size={14} />
                </div>
              </th>

              <th
                className="p-3 text-center cursor-pointer select-none"
                onClick={() => handleSort("current")}
              >
                <div className="flex items-center justify-center gap-1">
                  Current <ArrowUpDown size={14} />
                </div>
              </th>

              <th
                className="p-3 text-center cursor-pointer select-none"
                onClick={() => handleSort("profit")}
              >
                <div className="flex items-center justify-center gap-1">
                  Profit <ArrowUpDown size={14} />
                </div>
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {sortedAssets.map((item, index) => {
              const isProfit = item.profit >= 0;

              return (
                <tr
                  key={item.id || index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* NAME */}
                  <td className="p-3 font-medium text-gray-800">
                    {item.name}
                  </td>

                  {/* TYPE */}
                  <td className="p-3 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full text-white ${getTypeColor(
                        item.type
                      )}`}
                    >
                      {getTypeLabel(item.type)}
                    </span>
                  </td>

                  {/* INVESTED */}
                  <td className="p-3 text-center">
                    ₹
                    {Number(item.invested).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  {/* CURRENT */}
                  <td className="p-3 text-center">
                    ₹
                    {Number(item.current).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  {/* PROFIT */}
                  <td
                    className={`p-3 text-center font-semibold flex items-center justify-center gap-1 ${
                      isProfit
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {isProfit ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}

                    ₹
                    {Number(item.profit).toLocaleString(
                      "en-IN"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;