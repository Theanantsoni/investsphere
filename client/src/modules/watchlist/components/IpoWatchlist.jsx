import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IpoWatchlist = ({ data, removeWatchlist }) => {
  const navigate = useNavigate();

  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ALL IPO ================= */

  useEffect(() => {
    const fetchIpos = async () => {
      try {
        const [upcoming, ongoing, closed] = await Promise.all([
          axios.get("http://localhost:5000/api/ipo/upcoming"),
          axios.get("http://localhost:5000/api/ipo/ongoing"),
          axios.get("http://localhost:5000/api/ipo/closed"),
        ]);

        const allIpos = [
          ...(upcoming.data.data || []),
          ...(ongoing.data.data || []),
          ...(closed.data.data || []),
        ];

        setIpos(allIpos);
      } catch (error) {
        console.log("IPO fetch error");
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

  const ipoData = data.map((item) => {
    const match = ipos.find(
      (ipo) => String(ipo.symbol) === String(item.itemCode),
    );

    // if IPO exists in API
    if (match) return match;

    // fallback when IPO API is empty
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

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <p className="text-gray-400 text-center py-20">Loading IPO data...</p>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ipoData.map((ipo) => (
        <div
          key={ipo.symbol}
          className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
        >
          <div>
            {/* HEADER */}

            <h2 className="text-lg font-bold text-slate-800 mb-2">
              {ipo.name}
            </h2>

            <p className="text-slate-400 text-sm mb-3">{ipo.exchange}</p>

            {/* DETAILS */}

            <div className="space-y-1 text-sm text-slate-700">
              <p>
                <b>Symbol:</b> {ipo.symbol}
              </p>
              <p>
                <b>Exchange:</b> {ipo.exchange}
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
              <p>
                <b>Shares Offered:</b>{" "}
                {Number(ipo.numberOfShares).toLocaleString()}
              </p>
              <p>
                <b>Total Value:</b> ₹{" "}
                {Number(ipo.totalSharesValue).toLocaleString()}
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
  );
};

export default IpoWatchlist;
