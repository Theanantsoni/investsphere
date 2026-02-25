import { Link } from "react-router-dom";
import {
  getFundMinSip,
  getFundCategory,
  getFundRisk,
} from "../utils/sipUtils";

const SIPCard = ({ fund }) => {
  const fundMinSip = getFundMinSip(fund.schemeCode);
  const fundCategory = getFundCategory(fund.schemeName);
  const fundRisk = getFundRisk(fund.schemeName);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">

      {/* Top Content */}
      <div>
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-lg font-semibold text-slate-800 leading-snug line-clamp-2">
            {fund.schemeName}
          </h2>

          <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium whitespace-nowrap">
            SIP
          </span>
        </div>

        <p className="text-sm text-slate-500 mt-2">
          Scheme Code: {fund.schemeCode}
        </p>

        <div className="my-4 border-t border-slate-100"></div>

        {/* Details */}
        <div className="space-y-2">

          <div className="flex justify-between">
            <span className="text-slate-500">Category</span>
            <span className="font-medium text-slate-800">
              {fundCategory}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Min SIP</span>
            <span className="text-slate-800 font-medium">
              ₹{fundMinSip.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Risk</span>
            <span
              className={`font-semibold ${
                fundRisk === "Low"
                  ? "text-green-600"
                  : fundRisk === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {fundRisk}
            </span>
          </div>

        </div>
      </div>

      {/* Button */}
      <Link
        to={`/sip/${fund.schemeCode}`}
        className="mt-6 block text-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 rounded-xl font-medium transition-all duration-300"
      >
        View Details
      </Link>

    </div>
  );
};

export default SIPCard;