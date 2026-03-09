import React from "react";
import StockCard from "./StockCard";

const StockList = ({ stocks, loading }) => {

  /* ================= LOADING STATE ================= */

  if (loading) {

    return (

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {Array.from({ length: 8 }).map((_, index) => (

          <div
            key={index}
            className="bg-white border rounded-xl p-5 shadow-sm animate-pulse"
          >

            <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>

            <div className="h-3 w-32 bg-gray-200 rounded mb-6"></div>

            <div className="h-6 w-20 bg-gray-200 rounded mb-6"></div>

            <div className="grid grid-cols-2 gap-4">

              <div className="h-3 bg-gray-200 rounded"></div>

              <div className="h-3 bg-gray-200 rounded"></div>

            </div>

          </div>

        ))}

      </div>

    );

  }

  /* ================= EMPTY STATE ================= */

  if (!stocks || stocks.length === 0) {

    return (

      <div className="flex flex-col items-center justify-center py-24 text-gray-500">

        <div className="text-4xl mb-4">📉</div>

        <p className="text-lg font-medium">
          No stocks found
        </p>

        <p className="text-sm text-gray-400 mt-2">
          Try adjusting your search or filters
        </p>

      </div>

    );

  }

  /* ================= STOCK GRID ================= */

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {stocks.map((stock) => (

        <StockCard
          key={stock.symbol || stock.id}
          stock={stock}
        />

      ))}

    </div>

  );

};

export default StockList;