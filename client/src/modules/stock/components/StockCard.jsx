import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StockCard = ({ stock }) => {

  const navigate = useNavigate();

  const changeValue = Number(stock?.change || 0);
  const priceValue = Number(stock?.price || 0);

  const isPositive = changeValue >= 0;

  const formatMarketCap = (value) => {

    if (value === null || value === undefined) return "—";

    if (value >= 1e12)
      return (value / 1e12).toFixed(2) + "T";

    if (value >= 1e9)
      return (value / 1e9).toFixed(2) + "B";

    if (value >= 1e6)
      return (value / 1e6).toFixed(2) + "M";

    return value;

  };

  return (

    <div
      onClick={() => navigate(`/stocks/${stock.symbol}`)}
      className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-lg transition duration-200 cursor-pointer"
    >

      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">

        <div className="flex items-center gap-3">

          {/* LOGO */}

          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold">

            {stock.symbol?.slice(0, 2)}

          </div>

          <div>

            <h3 className="font-semibold text-gray-900">
              {stock.symbol}
            </h3>

            <p className="text-xs text-gray-500">
              {stock.name}
            </p>

          </div>

        </div>

        {/* CHANGE */}

        <div className={`flex items-center gap-1 text-sm font-semibold ${
          isPositive
            ? "text-green-600"
            : "text-red-600"
        }`}>

          {isPositive
            ? <TrendingUp size={16}/>
            : <TrendingDown size={16}/>
          }

          {isPositive ? "+" : ""}
          {changeValue.toFixed(2)}%

        </div>

      </div>

      {/* PRICE */}

      <div className="mb-4">

        <p className="text-2xl font-bold text-gray-900">

          ₹{priceValue.toFixed(2)}

        </p>

      </div>

      {/* EXTRA INFO */}

      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">

        <div>

          <p>Market Cap</p>

          <p className="font-medium text-gray-700">

            {formatMarketCap(stock.marketCap)}

          </p>

        </div>

        <div>

          <p>Volume</p>

          <p className="font-medium text-gray-700">

            {stock.volume
              ? Number(stock.volume).toLocaleString()
              : "—"}

          </p>

        </div>

      </div>

    </div>

  );

};

export default StockCard;