import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { CartesianGrid } from "recharts";

const Home = () => {
  const [coins, setCoins] = useState([]);
  const [indices, setIndices] = useState({});
  const [gold, setGold] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSymbol, setSelectedSymbol] = useState("^NSEI");

  const [initialLoading, setInitialLoading] = useState(true);

  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState([]);

  const fetchMarketData = async () => {
    try {
      if (initialLoading) setLoading(true);

      // 🔥 Fetch Indices (Backend)
      const indexRes = await fetch("http://localhost:5000/api/market");
      if (!indexRes.ok) throw new Error("Index API failed");
      const indexData = await indexRes.json();
      setIndices(indexData);

      // 🔥 Fetch Crypto + Gold (Backend Proxy)
      const cryptoRes = await fetch("http://localhost:5000/api/crypto");
      if (!cryptoRes.ok) throw new Error("Crypto API failed");
      const cryptoData = await cryptoRes.json();

      setCoins(cryptoData.coins || []);
      setGold(cryptoData.gold || null);

      setError(null);
    } catch (err) {
      console.error("Market fetch error:", err.message);

      setError("Unable to load market data.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // 1️⃣ Fetch market cards on load
  useEffect(() => {
    fetchMarketData();
  }, []);

  // 2️⃣ Fetch chart on symbol/duration change
  useEffect(() => {
    fetchChartData();
  }, [selectedSymbol, days]);

  // 3️⃣ Auto refresh chart
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChartData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const renderIndexCard = (title, data) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1">
      <h4 className="text-gray-500 text-sm uppercase tracking-wide">{title}</h4>

      <p className="text-3xl font-bold mt-2">
        ₹ {data?.c ? Number(data.c).toLocaleString() : "Fetching..."}
      </p>

      <p
        className={`mt-2 text-lg font-semibold ${
          data?.dp >= 0 ? "text-green-600" : "text-red-500"
        }`}
      >
        {data?.dp !== undefined ? data.dp.toFixed(2) + "%" : "--"}
      </p>
    </div>
  );

  const fetchChartData = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/market-history?symbol=${selectedSymbol}&days=${days}`,
      );

      const data = await res.json();
      setChartData(data);
    } catch (err) {
      console.log("Chart fetch error");
      setChartData([]);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* ================= ENTERPRISE HERO ================= */}
      <section className="relative bg-gradient-to-b from-white to-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-700 mb-8">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            India’s Smart Investment Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            Smart Investing
            <span className="block text-indigo-600">Starts Here</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed mb-12">
            Track markets, explore IPOs, analyze stocks, and plan SIP
            investments — all from one intelligent financial dashboard built for
            modern investors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <Link
              to="/ipo"
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition duration-300"
            >
              Explore IPOs
            </Link>

            <Link
              to="/stock"
              className="px-8 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition duration-300"
            >
              Analyze Stocks
            </Link>

            <Link
              to="/sip"
              className="px-8 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition duration-300"
            >
              SIP Calculator
            </Link>
          </div>

          {/* Divider */}
          <div className="mt-20 border-t border-gray-200 pt-10"></div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-10 text-gray-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="text-indigo-600">●</span>
              Real-time Insights
            </div>

            <div className="flex items-center gap-2">
              <span className="text-indigo-600">●</span>
              IPO & Stock Analysis
            </div>

            <div className="flex items-center gap-2">
              <span className="text-indigo-600">●</span>
              Long-term Wealth Planning
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARKET ================= */}
      <section className="py-24 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 tracking-tight">
            Live Market Overview
          </h2>

          <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto">
            Track real-time movements of major indices, gold prices and market
            trends with a clean and professional dashboard experience.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Sensex */}
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-200">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Sensex"
                className="w-14 h-14 mx-auto mb-4"
              />

              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Sensex
              </h3>

              <p className="text-2xl font-bold mt-3 text-gray-900">
                ₹{" "}
                {indices?.sensex?.c !== undefined
                  ? Number(indices.sensex.c).toLocaleString()
                  : "Fetching..."}
              </p>

              <p
                className={`mt-2 font-semibold ${
                  indices?.sensex?.dp >= 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {indices?.sensex?.dp !== undefined
                  ? indices.sensex.dp.toFixed(2) + "%"
                  : "--"}
              </p>
            </div>

            {/* Nifty */}
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-200">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
                alt="Nifty"
                className="w-14 h-14 mx-auto mb-4"
              />

              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Nifty 50
              </h3>

              <p className="text-2xl font-bold mt-3 text-gray-900">
                ₹{" "}
                {indices?.nifty?.c !== undefined
                  ? Number(indices.nifty.c).toLocaleString()
                  : "Fetching..."}
              </p>

              <p
                className={`mt-2 font-semibold ${
                  indices?.nifty?.dp >= 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {indices?.nifty?.dp !== undefined
                  ? indices.nifty.dp.toFixed(2) + "%"
                  : "--"}
              </p>
            </div>

            {/* Bank Nifty */}
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-200">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                alt="Bank Nifty"
                className="w-14 h-14 mx-auto mb-4"
              />

              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Bank Nifty
              </h3>

              <p className="text-2xl font-bold mt-3 text-gray-900">
                ₹{" "}
                {indices?.bankNifty?.c !== undefined
                  ? Number(indices.bankNifty.c).toLocaleString()
                  : "Fetching..."}
              </p>

              <p
                className={`mt-2 font-semibold ${
                  indices?.bankNifty?.dp >= 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {indices?.bankNifty?.dp !== undefined
                  ? indices.bankNifty.dp.toFixed(2) + "%"
                  : "--"}
              </p>
            </div>

            {/* Gold */}
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-200">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2909/2909763.png"
                alt="Gold"
                className="w-14 h-14 mx-auto mb-4"
              />

              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Gold
              </h3>

              <p className="text-2xl font-bold mt-3 text-gray-900">
                ₹{" "}
                {gold && gold.inr !== undefined
                  ? gold.inr.toLocaleString()
                  : "Fetching..."}
              </p>

              <p
                className={`mt-2 font-semibold ${
                  gold && gold.inr_24h_change >= 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {gold?.inr_24h_change !== undefined
                  ? gold.inr_24h_change.toFixed(2) + "%"
                  : "--"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CRYPTO ================= */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 tracking-tight">
            Top Cryptocurrencies
          </h2>

          <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto">
            Monitor leading digital assets and track daily price movements in
            real-time with a clean and structured layout.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {coins.length === 0 ? (
              <p className="col-span-4 text-center text-gray-500">
                Fetching crypto data...
              </p>
            ) : (
              coins.map((coin) => (
                <div
                  key={coin.id}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 text-center"
                >
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-12 h-12 mx-auto mb-4"
                  />

                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {coin.name}
                  </h4>

                  <p className="text-lg font-bold mt-3 text-gray-900">
                    ₹{" "}
                    {coin.current_price
                      ? coin.current_price.toLocaleString()
                      : "Fetching..."}
                  </p>

                  <p
                    className={`mt-2 font-semibold ${
                      coin.price_change_percentage_24h >= 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h !== undefined
                      ? coin.price_change_percentage_24h.toFixed(2) + "%"
                      : "--"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================= MARKET PERFORMANCE CHART ================= */}
      <section className="py-24 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {selectedSymbol === "^NSEI" && "Nifty 50"}
                  {selectedSymbol === "^NSEBANK" && "Bank Nifty"}
                  {selectedSymbol === "^BSESN" && "Sensex"}
                  {selectedSymbol === "GC=F" && "Gold"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Market trend analysis for selected duration
                </p>
              </div>

              <div className="flex gap-4">
                {/* INDEX SELECTOR */}
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="border border-gray-300 bg-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="^NSEI">Nifty 50</option>
                  <option value="^NSEBANK">Bank Nifty</option>
                  <option value="^BSESN">Sensex</option>
                  <option value="GC=F">Gold</option>
                </select>

                {/* DURATION SELECTOR */}
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="border border-gray-300 bg-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value={1}>1D</option>
                  <option value={7}>7D</option>
                  <option value={30}>1M</option>
                  <option value={90}>3M</option>
                </select>
              </div>
            </div>

            {/* STATS */}
            {chartData.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {(() => {
                  const start = chartData[0].value;
                  const end = chartData[chartData.length - 1].value;
                  const change = ((end - start) / start) * 100;
                  const high = Math.max(...chartData.map((d) => d.value));
                  const low = Math.min(...chartData.map((d) => d.value));

                  return (
                    <>
                      <div className="bg-slate-50 p-5 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-xs uppercase tracking-wide">
                          Change
                        </p>
                        <p
                          className={`text-lg font-semibold mt-1 ${
                            change >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {change.toFixed(2)}%
                        </p>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-xs uppercase tracking-wide">
                          High
                        </p>
                        <p className="text-lg font-semibold mt-1 text-gray-900">
                          ₹{high.toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-xs uppercase tracking-wide">
                          Low
                        </p>
                        <p className="text-lg font-semibold mt-1 text-gray-900">
                          ₹{low.toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-xs uppercase tracking-wide">
                          Current
                        </p>
                        <p className="text-lg font-semibold mt-1 text-gray-900">
                          ₹{end.toFixed(2)}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* CHART */}
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={
                        chartData.length > 1 &&
                        chartData[chartData.length - 1].value >
                          chartData[0].value
                          ? "#16a34a"
                          : "#dc2626"
                      }
                      stopOpacity={0.3}
                    />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />

                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "none",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={
                    chartData.length > 1 &&
                    chartData[chartData.length - 1].value > chartData[0].value
                      ? "#16a34a"
                      : "#dc2626"
                  }
                  strokeWidth={2.5}
                  fill="url(#colorValue)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* INSIGHT TEXT */}
            {chartData.length > 1 && (
              <div className="mt-10 bg-indigo-50 border border-indigo-100 text-indigo-700 p-5 rounded-lg text-sm">
                {chartData[chartData.length - 1].value > chartData[0].value
                  ? "The market is showing bullish momentum over the selected period. Buyers are currently dominating the trend."
                  : "The market is under bearish pressure over the selected period. Sellers are currently in control."}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Why Choose InvestSphere?
          </h2>

          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
            Built for modern investors who demand clarity, performance, and
            intelligent financial insights in one unified platform.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Real-Time Insights
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get live updates of stock indices, gold prices, and
                cryptocurrencies to make faster and more informed investment
                decisions.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Advanced IPO Tracking
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monitor upcoming and ongoing IPOs with structured insights and
                relevant market intelligence in one place.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Smart Portfolio Planning
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Plan SIP investments and evaluate long-term growth using
                data-driven projections and analytical tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARKET MOOD ================= */}
      <section className="py-24 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Today’s Market Mood
          </h2>

          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
            Understand overall market direction and investor sentiment through a
            structured overview of current momentum.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-green-600">Bullish</h3>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                Investors are optimistic and buying pressure is currently
                dominating market sentiment.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <div className="text-3xl mb-4">⚖️</div>
              <h3 className="text-lg font-semibold text-indigo-600">
                Balanced
              </h3>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                Market conditions remain stable with moderate price fluctuations
                and steady participation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <div className="text-3xl mb-4">📉</div>
              <h3 className="text-lg font-semibold text-red-600">Volatile</h3>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                Increased uncertainty is causing rapid movements and higher
                short-term risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INVESTMENT PATH ================= */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Choose Your Investment Path
          </h2>

          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
            Select your risk appetite and explore structured strategies aligned
            with your long-term financial goals.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Safe & Stable
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Best suited for disciplined long-term SIP investors seeking
                steady and predictable growth.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Balanced Growth
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A mix of SIP investments and carefully selected equities for
                moderate growth potential.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Aggressive Returns
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Focus on IPO opportunities and high-growth stocks with higher
                return potential and risk exposure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TOP THEMES ================= */}
      <section className="py-24 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 tracking-tight">
            Popular Investment Themes
          </h2>

          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Explore curated investment baskets aligned with trending sectors and
            long-term growth opportunities.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Large Cap Growth
              </h3>
              <p className="text-green-600 text-2xl font-bold mb-3">+18%</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stable companies with consistent long-term performance and lower
                volatility.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Tech Stocks Basket
              </h3>
              <p className="text-green-600 text-2xl font-bold mb-3">+24%</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                High-growth technology driven companies shaping the future
                economy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Recent IPO Picks
              </h3>
              <p className="text-green-600 text-2xl font-bold mb-3">+32%</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Newly listed companies showing strong early-stage market
                momentum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WEALTH JOURNEY ================= */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Your Wealth Growth Journey
          </h2>

          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
            A structured roadmap that demonstrates how disciplined investing
            builds long-term financial independence.
          </p>

          <div className="space-y-8">
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                Year 1
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Start investing ₹5,000 monthly and build financial discipline
                while establishing consistent habits.
              </p>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                Year 5
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Compounding begins accelerating portfolio growth, creating
                noticeable momentum in wealth accumulation.
              </p>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                Year 10
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Long-term consistency transforms disciplined investments into
                sustainable wealth creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINANCIAL EDUCATION ================= */}
      <section className="py-24 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 tracking-tight">
            Learn Before You Invest
          </h2>

          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Strengthen your financial knowledge with core investment concepts
            before making long-term decisions.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                What is IPO?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Initial Public Offering where companies raise capital by
                offering shares to the public.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                What is SIP?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Systematic Investment Plan that enables disciplined and periodic
                investing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                What is CAGR?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Compound Annual Growth Rate representing consistent yearly
                investment growth.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Risk vs Return
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Higher return potential generally comes with increased
                investment risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-slate-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Ready to Grow Your Portfolio?
          </h2>

          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of investors who trust InvestSphere to make smarter,
            data-driven financial decisions.
          </p>

          <Link
            to="/register"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 hover:shadow-md transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
