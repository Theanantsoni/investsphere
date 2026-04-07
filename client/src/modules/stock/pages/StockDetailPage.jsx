import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import stockService from "../services/stockService";
import StockInvest from "../components/StockInvest"; // ✅ NEW

const StockDetailPage = () => {

  const { symbol } = useParams();

  /* ================= STATE ================= */

  const [stock, setStock] = useState(null);
  const [timeframe, setTimeframe] = useState("1D");
  const [showInvest, setShowInvest] = useState(false); // ✅ NEW

  /* ================= FETCH STOCK ================= */

  useEffect(() => {

    const fetchStock = async () => {

      try {

        const res = await stockService.getStock(symbol);
        setStock(res);

      } catch (error) {

        console.error("Stock fetch error:", error);

      }

    };

    fetchStock();

  }, [symbol]);

  /* ================= LOADING ================= */

  if (!stock) {
    return (
      <div className="text-center py-32 text-gray-500">
        Loading stock data...
      </div>
    );
  }

  /* ================= DATA ================= */

  const positive = (stock.change || 0) >= 0;

  const price = Number(stock.price || 0).toFixed(2);
  const change = Number(stock.change || 0).toFixed(2);

  const timeframes = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

  const formatNumber = (value) => {
    if (!value) return "—";
    return Number(value).toLocaleString();
  };

  /* ================= UI ================= */

  return (

    <div className="bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ================= HEADER ================= */}

        <div className="bg-white rounded-xl shadow border p-6 flex flex-col md:flex-row md:items-center md:justify-between">

          {/* LEFT */}
          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              {stock.name}
            </h1>

            <p className="text-gray-500 mt-1">
              NSE : {stock.symbol}
            </p>

          </div>

          {/* RIGHT */}
          <div className="mt-6 md:mt-0 flex flex-col items-end gap-3">

            <div className="flex items-center gap-6">

              <span className="text-3xl font-bold text-gray-900">
                ₹{price}
              </span>

              <span className={`font-semibold ${
                positive
                  ? "text-green-600"
                  : "text-red-600"
              }`}>

                {positive ? "+" : ""}
                {change}%

              </span>

            </div>

            <p className="text-sm text-gray-500">
              Last updated just now
            </p>

            {/* ✅ INVEST BUTTON */}
            <button
              onClick={() => setShowInvest(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Invest Now
            </button>

          </div>

        </div>

        {/* ================= TIMEFRAME ================= */}

        <div className="flex gap-3 flex-wrap">

          {timeframes.map((t) => (

            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg text-sm border ${
                timeframe === t
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {t}
            </button>

          ))}

        </div>

        {/* ================= CHART ================= */}

        <div className="bg-white rounded-xl border shadow p-6">

          <h2 className="text-lg font-semibold mb-6">
            Price Chart
          </h2>

          <iframe
            title="TradingView Chart"
            src={`https://s.tradingview.com/widgetembed/?symbol=NSE:${stock.symbol}&interval=D&theme=light&style=1&timezone=Asia/Kolkata`}
            className="w-full h-[500px] border-0"
          />

        </div>

        {/* ================= KEY STATS ================= */}

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-lg font-semibold mb-6">
            Key Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">

            <Stat label="Market Cap" value={formatNumber(stock.marketCap)} />
            <Stat label="Volume" value={formatNumber(stock.volume)} />
            <Stat label="P/E Ratio" value={stock.pe || "—"} />
            <Stat label="EPS" value={stock.eps || "—"} />
            <Stat label="52W High" value={stock.high52 || "—"} />
            <Stat label="52W Low" value={stock.low52 || "—"} />
            <Stat label="Dividend Yield" value={stock.dividend || "—"} />
            <Stat label="Sector" value={stock.sector || "—"} />

          </div>

        </div>

        {/* ================= RETURNS ================= */}

        <div className="bg-white rounded-xl border shadow p-6">

          <h2 className="text-lg font-semibold mb-6">
            Returns
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <Stat label="1 Day" value={stock.return1d || "—"} />
            <Stat label="1 Month" value={stock.return1m || "—"} />
            <Stat label="1 Year" value={stock.return1y || "—"} />
            <Stat label="5 Years" value={stock.return5y || "—"} />

          </div>

        </div>

        {/* ================= COMPANY OVERVIEW ================= */}

        <div className="bg-white rounded-xl border shadow p-6">

          <h2 className="text-lg font-semibold mb-4">
            Company Overview
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {stock.description ||
              "Company overview information will appear here once the data is available."}
          </p>

        </div>

      </div>

      {/* ================= INVEST MODAL ================= */}

      {showInvest && (
        <StockInvest
          stock={stock}
          onClose={() => setShowInvest(false)}
        />
      )}

    </div>

  );

};

/* ================= STAT COMPONENT ================= */

const Stat = ({ label, value }) => (

  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>

);

export default StockDetailPage;