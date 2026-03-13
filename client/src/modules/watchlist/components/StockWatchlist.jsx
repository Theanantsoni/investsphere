import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import useStock from "../../stock/hooks/useStock";

const StockWatchlist = ({ data, removeWatchlist }) => {
  const navigate = useNavigate();
  const { stocks } = useStock();

  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-20">No Stocks in Watchlist</p>
    );
  }

  /* ================= MATCH WATCHLIST WITH STOCK API ================= */

  const watchlistStocks = data
    .map((item) => stocks.find((stock) => stock.symbol === item.itemCode))
    .filter(Boolean);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(watchlistStocks.length / ITEMS_PER_PAGE);

  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return watchlistStocks.slice(start, start + ITEMS_PER_PAGE);
  }, [watchlistStocks, page]);

  return (
    <div>
      {/* ================= STOCK TABLE ================= */}

      <div className="bg-white rounded-xl border shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Symbol</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Change</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedStocks.map((stock) => {
                const positive = (stock.change || 0) >= 0;

                return (
                  <tr
                    key={stock.symbol}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* COMPANY */}

                    <td
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className="px-6 py-5 cursor-pointer"
                    >
                      <p className="font-semibold text-gray-900 hover:text-green-600 transition">
                        {stock.name}
                      </p>

                      <p className="text-xs text-gray-400">NSE</p>
                    </td>

                    {/* SYMBOL */}

                    <td
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className="px-6 py-5 font-medium text-gray-700 cursor-pointer"
                    >
                      {stock.symbol}
                    </td>

                    {/* PRICE */}

                    <td
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className="px-6 py-5 font-semibold cursor-pointer"
                    >
                      ₹{Number(stock.price || 0).toFixed(2)}
                    </td>

                    {/* CHANGE */}

                    <td
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className={`px-6 py-5 font-semibold cursor-pointer ${
                        positive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {positive ? "+" : ""}
                      {Number(stock.change || 0).toFixed(2)}%
                    </td>

                    {/* REMOVE */}

                    <td className="px-6 py-5">
                      <button
                        onClick={() => removeWatchlist(stock.symbol)}
                        className="flex items-center gap-2 border border-red-500 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition hover:scale-[1.03]"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PAGINATION ================= */}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* PREV */}

          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}

          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;

            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  page === pageNumber
                    ? "bg-purple-600 text-white shadow"
                    : "border hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* NEXT */}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StockWatchlist;
