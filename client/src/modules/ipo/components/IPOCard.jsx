import React from "react";
import { useNavigate } from "react-router-dom";

const IPOCard = ({ ipo }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date;
  };

  const formatNumber = (num) => {
    if (!num) return "N/A";
    return Number(num).toLocaleString("en-IN");
  };

  const badgeColor =
    ipo.status === "upcoming"
      ? "bg-yellow-100 text-yellow-700"
      : ipo.status === "ongoing"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition flex flex-col justify-between">

      <div>
        <h2 className="text-lg font-bold">{ipo.name}</h2>
        <p className="text-gray-500 text-sm mb-3">{ipo.exchange}</p>

        <p><b>Symbol:</b> {ipo.symbol}</p>
        <p><b>Type:</b> {ipo.type}</p>
        <p><b>Open Date:</b> {formatDate(ipo.openDate)}</p>
        <p><b>Close Date:</b> {formatDate(ipo.closeDate)}</p>
        <p><b>Issue Price:</b> {ipo.price}</p>
        <p><b>Shares Offered:</b> {formatNumber(ipo.numberOfShares)}</p>
        <p><b>Total Value:</b> ₹ {formatNumber(ipo.totalSharesValue)}</p>

        <div className="mt-3">
          <span
            className={`px-3 py-1 text-xs rounded-full ${badgeColor} capitalize`}
          >
            {ipo.status}
          </span>
        </div>
      </div>

      {/* Apply Button Only If Ongoing */}
      {ipo.status === "ongoing" && (
        <button
          onClick={() => navigate(`/ipo/apply/${ipo.symbol}`)}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition mt-4"
        >
          Apply Now
        </button>
      )}

    </div>
  );
};

export default IPOCard;
