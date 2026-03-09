import React from "react";

const StockPagination = ({ page, totalPages, setPage }) => {

  const pages = [...Array(totalPages).keys()].map((n) => n + 1);

  return (

    <div className="flex justify-center gap-2 mt-10">

      {pages.map((p) => (

        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-4 py-2 border rounded ${
            page === p
              ? "bg-indigo-600 text-white"
              : "bg-white"
          }`}
        >
          {p}
        </button>

      ))}

    </div>
  );
};

export default StockPagination;