import React, { useMemo, useState } from "react";
import PortfolioSummary from "./PortfolioSummary";
import AssetAllocationChart from "./AssetAllocationChart";
import PortfolioFilters from "./PortfolioFilters";
import PortfolioCard from "./PortfolioCard";
import PortfolioTable from "./PortfolioTable";

/* ======================================================
 COMPONENT
====================================================== */
const PortfolioView = ({
  assets = [],
  summary = {},
  allocation = [],
  fetchPortfolio,
}) => {
  const [filter, setFilter] = useState("all");

  /* ================= FILTER ================= */
  const filteredAssets = useMemo(() => {
    if (filter === "all") return assets;

    return assets.filter(
      (a) => (a.assetType || a.type) === filter
    );
  }, [assets, filter]);

  /* ================= BEST ================= */
  const bestPerformer = useMemo(() => {
    if (!assets.length) return "-";

    const sorted = [...assets].sort(
      (a, b) => (b.profit || 0) - (a.profit || 0)
    );

    return sorted[0]?.assetName || sorted[0]?.name || "-";
  }, [assets]);

  return (
    <div className="space-y-6">
      {/* ================= SUMMARY ================= */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Portfolio Summary
          </h2>

          <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-600 font-medium shadow-sm">
            {summary?.profitPercentage || 0}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 hover:shadow transition">
            <p className="text-xs text-gray-500">Total Invested</p>
            <h3 className="text-lg font-semibold text-gray-800 mt-1">
              ₹{Number(summary?.totalInvested || 0).toLocaleString("en-IN")}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 hover:shadow transition">
            <p className="text-xs text-gray-500">Current Value</p>
            <h3 className="text-lg font-semibold text-gray-800 mt-1">
              ₹{Number(summary?.currentValue || 0).toLocaleString("en-IN")}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 hover:shadow transition">
            <p className="text-xs text-gray-500">Profit / Loss</p>
            <h3
              className={`text-lg font-semibold mt-1 ${
                summary?.totalProfit >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ₹{Number(summary?.totalProfit || 0).toLocaleString("en-IN")}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 hover:shadow transition">
            <p className="text-xs text-gray-500">Return %</p>
            <h3 className="text-lg font-semibold text-gray-800 mt-1">
              {summary?.profitPercentage || 0}%
            </h3>
          </div>
        </div>
      </div>

      {/* ================= TOP GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-3 text-gray-700">
            Asset Allocation
          </h3>
          <AssetAllocationChart data={allocation} />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-3 text-gray-700">
            Filter Investments
          </h3>

          <PortfolioFilters filter={filter} setFilter={setFilter} />

          <p className="mt-3 text-sm text-gray-500">
            Showing:{" "}
            <b className="text-gray-800">
              {filter.toUpperCase()}
            </b>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition flex flex-col justify-center">
          <h3 className="font-semibold mb-3 text-gray-700">
            Quick Insights
          </h3>

          <p className="text-sm text-gray-600">
            Assets:{" "}
            <b className="text-gray-900">
              {filteredAssets.length}
            </b>
          </p>

          <p className="text-sm text-gray-600 mt-2">
            Best Performer:{" "}
            <b className="text-green-600">
              {bestPerformer}
            </b>
          </p>
        </div>
      </div>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssets.map((asset, index) => (
          <PortfolioCard
            key={asset._id || `${asset.assetCode}-${index}`}
            asset={asset}
          />
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 border border-gray-100">
        <PortfolioTable
          assets={filteredAssets}
          fetchPortfolio={fetchPortfolio} // ✅ IMPORTANT
        />
      </div>
    </div>
  );
};

export default PortfolioView;