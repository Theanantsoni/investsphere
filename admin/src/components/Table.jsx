// src/components/Table.jsx

import { useState } from "react";
import Loader from "./Loader";

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyText = "No data found",
}) => {
  // ✅ Safety: ensure data is always array
  const safeData = Array.isArray(data) ? data : [];

  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="relative w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 transition-all duration-300">
      {/* LOADING */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader />
        </div>
      ) : (
        <>
          {/* TABLE WRAPPER */}
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <table className="w-full min-w-[600px] text-sm text-left border-collapse">
              {/* HEADER */}
              <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 backdrop-blur">
                <tr>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      className="px-5 py-3 font-semibold uppercase tracking-wider text-xs text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {safeData.length > 0 ? (
                  safeData.map((row, i) => (
                    <tr
                      key={row?._id || i}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`group transition-all duration-200 ${
                        hoveredRow === i
                          ? "bg-gray-100 dark:bg-gray-800/60 scale-[1.001]"
                          : ""
                      }`}
                    >
                      {columns.map((col, j) => (
                        <td
                          key={j}
                          className="px-5 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            {col.render
                              ? col.render(row)
                              : col.accessor
                              ? row[col.accessor] ?? "-"
                              : "-"}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length || 1}
                      className="text-center py-16 text-gray-500 dark:text-gray-400 text-sm"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="text-3xl opacity-40">📭</div>
                        <p>{emptyText}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER INFO */}
          {!loading && safeData.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
              <span>
                Showing <span className="font-medium">{safeData.length}</span>{" "}
                results
              </span>
              <span className="hidden sm:block">
                Optimized table rendering • Responsive UI
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Table;