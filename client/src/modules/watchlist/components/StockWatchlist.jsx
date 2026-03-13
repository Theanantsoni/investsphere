import { useNavigate } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { useState, useMemo } from "react";
import useStock from "../../stock/hooks/useStock";

import InvestSphereLoader from "../../../shared/components/InvestSphereLoader";

const StockWatchlist = ({ data, removeWatchlist }) => {
  const navigate = useNavigate();

  const { stocks, loading } = useStock();

  const [page, setPage] = useState(1);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const ITEMS_PER_PAGE = 5;

  /* ================= MATCH WATCHLIST WITH STOCK API ================= */

  const watchlistStocks = useMemo(() => {
    if (!data || !stocks) return [];

    return data
      .map((item) =>
        stocks.find((stock) => stock.symbol === item.itemCode)
      )
      .filter(Boolean);
  }, [data, stocks]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(watchlistStocks.length / ITEMS_PER_PAGE);

  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return watchlistStocks.slice(start, start + ITEMS_PER_PAGE);
  }, [watchlistStocks, page]);

  /* ================= REMOVE CLICK ================= */

  const handleRemoveClick = (symbol) => {
    setSelectedSymbol(symbol);
    setConfirmPopup(true);
  };

  /* ================= CONFIRM REMOVE ================= */

  const confirmRemove = () => {
    removeWatchlist(selectedSymbol);
    setConfirmPopup(false);
    setSelectedSymbol(null);
  };

  /* ================= LOADER ================= */

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <InvestSphereLoader />
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-20">
        No Stocks in Watchlist
      </p>
    );
  }

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
                    <td
                      onClick={() =>
                        navigate(`/stock/${stock.symbol}`)
                      }
                      className="px-6 py-5 cursor-pointer"
                    >
                      <p className="font-semibold text-gray-900 hover:text-green-600">
                        {stock.name}
                      </p>
                      <p className="text-xs text-gray-400">NSE</p>
                    </td>

                    <td
                      onClick={() =>
                        navigate(`/stock/${stock.symbol}`)
                      }
                      className="px-6 py-5 font-medium text-gray-700 cursor-pointer"
                    >
                      {stock.symbol}
                    </td>

                    <td
                      onClick={() =>
                        navigate(`/stock/${stock.symbol}`)
                      }
                      className="px-6 py-5 font-semibold cursor-pointer"
                    >
                      ₹{Number(stock.price || 0).toFixed(2)}
                    </td>

                    <td
                      onClick={() =>
                        navigate(`/stock/${stock.symbol}`)
                      }
                      className={`px-6 py-5 font-semibold cursor-pointer ${
                        positive
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {positive ? "+" : ""}
                      {Number(stock.change || 0).toFixed(2)}%
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() =>
                          handleRemoveClick(stock.symbol)
                        }
                        className="flex items-center gap-2 border border-red-500 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
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

      {/* ================= CONFIRM POPUP ================= */}

      {confirmPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[360px] p-6 relative text-center">
            <button
              onClick={() => setConfirmPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-3">
              Remove Stock
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to remove this stock from your
              watchlist?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmPopup(false)}
                className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmRemove}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockWatchlist;