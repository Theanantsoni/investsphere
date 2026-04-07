import React from "react";

/* ======================================================
 COMPONENT
====================================================== */
const PortfolioLoader = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ================= SUMMARY ================= */}
      <div className="bg-gray-200 h-32 rounded-2xl"></div>

      {/* ================= TOP GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART */}
        <div className="bg-gray-200 h-48 rounded-2xl"></div>

        {/* FILTER */}
        <div className="bg-gray-200 h-48 rounded-2xl"></div>

        {/* QUICK STATS */}
        <div className="bg-gray-200 h-48 rounded-2xl"></div>
      </div>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-200 h-32 rounded-2xl"
          ></div>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-gray-200 h-64 rounded-2xl"></div>
    </div>
  );
};

export default PortfolioLoader;