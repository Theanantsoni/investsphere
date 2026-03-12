import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getFundMinSip, getFundCategory, getFundRisk } from "../../sip/utils/sipUtils";

const SipWatchlist = ({ data, removeWatchlist }) => {

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-20">
        No SIP Funds in Watchlist
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {data.map((sip) => {

        const schemeCode = sip.itemCode;
        const schemeName = sip.itemName;

        const fundMinSip = getFundMinSip(schemeCode);
        const fundCategory = getFundCategory(schemeName);
        const fundRisk = getFundRisk(schemeName);

        return (

          <div
            key={sip._id}
            className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
          >

            {/* Hover Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-green-50 via-transparent to-emerald-50 pointer-events-none"></div>

            {/* CONTENT */}
            <div className="relative z-10">

              {/* HEADER */}
              <div className="flex justify-between items-start gap-4">

                <h2 className="text-lg font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-green-600 transition">
                  {schemeName}
                </h2>

                <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
                  SIP
                </span>

              </div>

              <p className="text-sm text-slate-400 mt-2">
                Scheme Code: {schemeCode}
              </p>

              <div className="my-5 border-t border-slate-100"></div>

              {/* DETAILS */}

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="font-medium text-slate-800">
                    {fundCategory}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Min SIP</span>
                  <span className="font-semibold text-slate-900">
                    ₹{fundMinSip.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Risk</span>

                  <span
                    className={`px-2 py-1 text-xs rounded-md font-semibold ${
                      fundRisk === "Low"
                        ? "bg-green-100 text-green-700"
                        : fundRisk === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {fundRisk}
                  </span>
                </div>

              </div>

            </div>

            {/* BUTTONS */}

            <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-3">

              {/* REMOVE */}

              <button
                onClick={() => removeWatchlist(schemeCode)}
                className="flex-1 border border-red-500 text-red-600 py-2.5 rounded-xl font-medium hover:bg-red-50 transition flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95"
              >
                <Trash2 size={18} />
                Remove
              </button>

              {/* VIEW DETAILS */}

              <Link
                to={`/sip/${schemeCode}`}
                className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium transition hover:scale-[1.03] active:scale-95"
              >
                View Details
              </Link>

            </div>

          </div>

        );

      })}

    </div>
  );
};

export default SipWatchlist;