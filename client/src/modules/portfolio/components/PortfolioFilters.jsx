import React from "react";
import { PORTFOLIO_FILTERS } from "../constants/portfolioConstants";

/* ======================================================
 COMPONENT
====================================================== */
const PortfolioFilters = ({ filter, setFilter }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {PORTFOLIO_FILTERS.map((item) => {
        const isActive = filter === item.value;

        return (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
            flex items-center gap-2 shadow-sm
            ${
              isActive
                ? "bg-indigo-600 text-white shadow-md scale-[1.05]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-[1.03]"
            }`}
          >
            {/* LABEL */}
            {item.label}

            {/* ACTIVE DOT */}
            {isActive && (
              <span className="w-2 h-2 bg-white rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PortfolioFilters;