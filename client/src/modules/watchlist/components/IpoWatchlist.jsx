import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IpoWatchlist = ({ data, removeWatchlist }) => {
  const navigate = useNavigate();

  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

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

  /* ================= EMPTY WATCHLIST ================= */

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-20">No IPOs in Watchlist</p>
    );
  }

  /* ================= MATCH WATCHLIST ================= */

  const ipoData = useMemo(() => {
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

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <p className="text-gray-400 text-center py-20">Loading IPO data...</p>
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
                  <b>Symbol:</b> {ipo.symbol || "N/A"}
                </p>

                <p>
                  <b>Exchange:</b> {ipo.exchange || "N/A"}
                </p>

                <p>
                  <b>Open Date:</b> {ipo.openDate || "N/A"}
                </p>

                <p>
                  <b>Close Date:</b> {ipo.closeDate || "N/A"}
                </p>

                <p>
                  <b>Issue Price:</b> {ipo.price || "N/A"}
                </p>

                <p>
                  <b>Shares Offered:</b>{" "}
                  {ipo.numberOfShares && ipo.numberOfShares > 0
                    ? Number(ipo.numberOfShares).toLocaleString("en-IN")
                    : "N/A"}
                </p>

                <p>
                  <b>Total Value:</b>{" "}
                  {ipo.totalSharesValue && ipo.totalSharesValue > 0
                    ? `₹ ${Number(ipo.totalSharesValue).toLocaleString("en-IN")}`
                    : "N/A"}
                </p>
              </div>

              {/* STATUS */}

              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold capitalize ${
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
                onClick={() => removeWatchlist(ipo.symbol)}
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

export default IpoWatchlist;
