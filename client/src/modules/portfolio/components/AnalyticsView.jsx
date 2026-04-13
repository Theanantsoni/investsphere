import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  RefreshCcw,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ======================================================
  AXIOS INSTANCE
====================================================== */

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 20000,
});

/* ======================================================
  HELPERS
====================================================== */

const formatCurrency = (num) => {
  if (!num) return "₹0";
  return `₹${Number(num).toLocaleString("en-IN")}`;
};

const formatPercent = (num) => {
  if (!num) return "0%";
  return `${num.toFixed(2)}%`;
};

/* ======================================================
  COMPONENTS
====================================================== */

const StatCard = ({ title, value, change, positive }) => (
  <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>

    <div
      className={`flex items-center gap-1 mt-2 text-sm ${
        positive ? "text-green-600" : "text-red-500"
      }`}
    >
      {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      {change}
    </div>
  </div>
);

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

/* ======================================================
  MAIN COMPONENT
====================================================== */

const AnalyticsView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 CHART FIX STATE
  const [chartReady, setChartReady] = useState(false);

  const userEmail = localStorage.getItem("userEmail");

  /* ======================================================
    FETCH
  ====================================================== */

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/analytics", {
        params: { userEmail },
      });

      setData(res?.data?.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) fetchAnalytics();
  }, [userEmail]);

  /* ======================================================
    CHART DELAY FIX
  ====================================================== */

  useEffect(() => {
    const t = setTimeout(() => setChartReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  /* ======================================================
    DERIVED
  ====================================================== */

  const isProfit = useMemo(() => {
    return (data?.overview?.profitLoss || 0) >= 0;
  }, [data]);

  /* ======================================================
    STATES
  ====================================================== */

  if (loading) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow text-center">
        <div className="animate-pulse text-gray-500">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-red-500">
        {error}
      </div>
    );
  }

  /* ======================================================
    UI
  ====================================================== */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <BarChart3 size={26} /> Analytics Dashboard
          </h2>
          <p className="text-gray-500 text-sm">
            Investment insights & performance
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Invested"
          value={formatCurrency(data?.overview?.totalInvested)}
          change="Overall"
          positive
        />
        <StatCard
          title="Current Value"
          value={formatCurrency(data?.overview?.currentValue)}
          change="Live"
          positive
        />
        <StatCard
          title="Profit / Loss"
          value={formatCurrency(data?.overview?.profitLoss)}
          change={formatPercent(data?.overview?.returnPercent)}
          positive={isProfit}
        />
        <StatCard
          title="Return %"
          value={formatPercent(data?.overview?.returnPercent)}
          change="Total"
          positive={isProfit}
        />
      </div>

      {/* CHART + ALLOCATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PERFORMANCE */}
        <SectionCard
          title="Performance"
          icon={<TrendingUp className="text-blue-500" />}
        >
          <div className="w-full h-[320px] min-w-[300px]">

            {chartReady && data?.performance?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.performance}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis tickFormatter={(val) => `₹${val}`} />

                  <Tooltip formatter={(value) => formatCurrency(value)} />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Loading chart...
              </div>
            )}

          </div>
        </SectionCard>

        {/* ALLOCATION */}
        <SectionCard
          title="Asset Allocation"
          icon={<PieChart className="text-purple-500" />}
        >
          <div className="space-y-4">
            {data?.allocation?.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.type}</span>
                  <span>{formatPercent(item.percent)}</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

      </div>

      {/* PNL + SIP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <SectionCard
          title="Profit & Loss"
          icon={<Activity className="text-green-500" />}
        >
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Realized</span>
              <span>{formatCurrency(data?.pnl?.realized)}</span>
            </div>
            <div className="flex justify-between">
              <span>Unrealized</span>
              <span>{formatCurrency(data?.pnl?.unrealized)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(data?.pnl?.total)}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="SIP Insights"
          icon={<TrendingUp className="text-orange-500" />}
        >
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Total Invested</span>
              <span>{formatCurrency(data?.sip?.totalInvested)}</span>
            </div>
            <div className="flex justify-between">
              <span>Active SIPs</span>
              <span>{data?.sip?.active}</span>
            </div>
            <div className="flex justify-between">
              <span>Average</span>
              <span>{formatCurrency(data?.sip?.average)}</span>
            </div>
          </div>
        </SectionCard>

      </div>

    </div>
  );
};

export default AnalyticsView;