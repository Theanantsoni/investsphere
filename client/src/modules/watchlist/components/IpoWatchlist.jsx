import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InvestSphereLoader from "../../../shared/components/InvestSphereLoader";

const IpoWatchlist = ({ data, removeWatchlist }) => {
  const navigate = useNavigate();

  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [confirmPopup, setConfirmPopup] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const ITEMS_PER_PAGE = 3;

  /* ================= FETCH IPO DATA ================= */

  useEffect(() => {
    const fetchIpos = async () => {
      try {
        setLoading(true);

        const [upcomingRes, ongoingRes, closedRes] = await Promise.all([
          axios.get("http://localhost:5000/api/ipo/upcoming"),
          axios.get("http://localhost:5000/api/ipo/ongoing"),
          axios.get("http://localhost:5000/api/ipo/closed"),
        ]);

        const allIpos = [
          ...(upcomingRes.data || []),
          ...(ongoingRes.data || []),
          ...(closedRes.data || []),
        ];

        setIpos(allIpos);
      } catch (error) {
        console.log("IPO fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIpos();
  }, []);

  /* ================= MATCH WATCHLIST ================= */

  const ipoData = useMemo(() => {
    if (!data) return [];

    return data.map((item) => {
      const match = ipos.find(
        (ipo) =>
          String(ipo.symbol).toLowerCase() ===
          String(item.itemCode).toLowerCase(),
      );

      if (match) return match;

      return {
        symbol: item.itemCode,
        name: item.itemName,
        exchange: "NSE",
        openDate: "TBA",
        closeDate: "TBA",
        price: "TBA",
        numberOfShares: 0,
        totalSharesValue: 0,
        status: "upcoming",
      };
    });
  }, [data, ipos]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(ipoData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return ipoData.slice(start, start + ITEMS_PER_PAGE);
  }, [ipoData, page]);

  /* ================= REMOVE CLICK ================= */

  const handleRemoveClick = (symbol) => {
    setSelectedSymbol(symbol);
    setConfirmPopup(true);
  };

  /* ================= CONFIRM REMOVE ================= */

  const confirmRemove = async () => {
    if (!selectedSymbol) return;

    try {
      await removeWatchlist(selectedSymbol);
    } catch (error) {
      console.log("Remove error:", error);
    }

    setConfirmPopup(false);
    setSelectedSymbol(null);
  };

  /* ================= LOADER ================= */

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <InvestSphereLoader />
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="bg-white border rounded-2xl shadow-md p-10 text-center max-w-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            No IPO Watchlist
          </h2>

          <p className="text-gray-500 text-sm">No watchlist IPO data found.</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div>
      {/* ================= IPO CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((ipo) => (
          <div
            key={ipo.symbol}
            className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">
                {ipo.name}
              </h2>

              <p className="text-slate-400 text-sm mb-3">
                {ipo.exchange || "N/A"}
              </p>

              <div className="space-y-1 text-sm text-slate-700">
                <p>
                  <b>Symbol:</b> {ipo.symbol}
                </p>

                <p>
                  <b>Open Date:</b> {ipo.openDate}
                </p>

                <p>
                  <b>Close Date:</b> {ipo.closeDate}
                </p>

                <p>
                  <b>Issue Price:</b> {ipo.price}
                </p>
              </div>

              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    ipo.status === "ongoing"
                      ? "bg-green-100 text-green-700"
                      : ipo.status === "upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ipo.status}
                </span>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => navigate(`/ipo/apply/${ipo.symbol}`)}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition"
              >
                Apply Now
              </button>

              <button
                onClick={() => handleRemoveClick(ipo.symbol)}
                className="flex items-center justify-center gap-2 border border-red-500 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50 transition"
              >
                <Trash2 size={18} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1;

            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  page === p
                    ? "bg-purple-600 text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      )}

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

            <h2 className="text-lg font-semibold mb-3">Remove IPO</h2>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to remove this IPO from your watchlist?
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

export default IpoWatchlist;
