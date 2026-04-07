import React, { useMemo } from "react";
import { usePortfolioContext } from "../context/PortfolioContext";

import PortfolioHeader from "../components/PortfolioHeader";
import PortfolioSummary from "../components/PortfolioSummary";
import AssetAllocationChart from "../components/AssetAllocationChart";
import PortfolioFilters from "../components/PortfolioFilters";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioTable from "../components/PortfolioTable";
import PortfolioLoader from "../components/PortfolioLoader";

/* ======================================================
 PAGE
====================================================== */
const PortfolioPage = () => {
  const {
    assets,
    summary,
    allocation,
    loading,
  } = usePortfolioContext();

  /* ======================================================
 FILTER STATE (LOCAL UI ONLY)
====================================================== */
  const [filter, setFilter] = React.useState("all");

  /* ======================================================
 FILTERED ASSETS
====================================================== */
  const filteredAssets = useMemo(() => {
    if (filter === "all") return assets;
    return assets.filter((a) => a.type === filter);
  }, [assets, filter]);

  /* ======================================================
 BEST PERFORMER
====================================================== */
  const bestPerformer = useMemo(() => {
    if (!assets.length) return "-";
    return [...assets].sort((a, b) => b.profit - a.profit)[0]
      ?.name;
  }, [assets]);

  /* ======================================================
 RENDER
====================================================== */
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER */}
      <PortfolioHeader />

      {/* LOADING */}
      {loading ? (
        <PortfolioLoader />
      ) : (
        <>
          {/* SUMMARY */}
          <div className="mb-6">
            <PortfolioSummary summary={summary} />
          </div>

          {/* TOP GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* ALLOCATION */}
            <AssetAllocationChart data={allocation} />

            {/* FILTER + QUICK VIEW */}
            <div className="bg-white rounded-2xl p-5 shadow flex flex-col justify-between">
              <div>
                <h3 className="font-semibold mb-3">
                  Filter Investments
                </h3>

                <PortfolioFilters
                  filter={filter}
                  setFilter={setFilter}
                />
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Showing:{" "}
                <span className="font-medium text-gray-800">
                  {filter.toUpperCase()}
                </span>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="bg-white rounded-2xl p-5 shadow flex flex-col justify-center">
              <h3 className="font-semibold mb-3">
                Quick Insights
              </h3>

              <p className="text-sm text-gray-600">
                Assets Count:{" "}
                <b className="text-gray-800">
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

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {filteredAssets.map((asset) => (
              <PortfolioCard key={asset.id} asset={asset} />
            ))}
          </div>

          {/* TABLE */}
          <PortfolioTable assets={filteredAssets} />
        </>
      )}
    </div>
  );
};

export default PortfolioPage;