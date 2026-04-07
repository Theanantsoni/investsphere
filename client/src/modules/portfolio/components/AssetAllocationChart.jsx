import React from "react";
import { PieChart } from "lucide-react";

/* ======================================================
 COLORS MAP
====================================================== */
const COLORS = {
  STOCK: "bg-blue-500",
  SIP: "bg-purple-500",
  IPO: "bg-green-500",
};

/* ======================================================
 COMPONENT
====================================================== */
const AssetAllocationChart = ({ data }) => {
  /* ================= SAFETY ================= */
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow text-center text-gray-500">
        No allocation data available
      </div>
    );
  }

  /* ======================================================
 RENDER
====================================================== */
  return (
    <div className="bg-white rounded-2xl p-5 shadow relative overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <PieChart size={18} />
          Asset Allocation
        </h3>
      </div>

      {/* BARS */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const color =
            COLORS[item.label] || "bg-indigo-500";

          return (
            <div key={index}>
              {/* LABEL */}
              <div className="flex justify-between text-sm mb-1 text-gray-600">
                <span className="font-medium">
                  {item.label}
                </span>
                <span className="font-semibold text-gray-800">
                  {item.value}%
                </span>
              </div>

              {/* BAR */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${color} transition-all duration-500`}
                  style={{
                    width: `${item.value}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER SUMMARY */}
      <div className="mt-6 text-xs text-gray-500">
        Distribution based on current portfolio value
      </div>
    </div>
  );
};

export default AssetAllocationChart;