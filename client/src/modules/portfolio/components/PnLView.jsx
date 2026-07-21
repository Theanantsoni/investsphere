import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Activity,
  BarChart3,
  LineChart as LineIcon,
} from "lucide-react";
import API from "../../../config/api";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

/* ======================================================
 AXIOS
====================================================== */
const api = axios.create({
  baseURL: API,
  timeout: 20000,
});

/* ======================================================
 HELPERS
====================================================== */
const formatCurrency = (num) =>
  `₹${Math.abs(Number(num || 0)).toLocaleString("en-IN")}`;

const formatPercent = (num) =>
  `${Number(num || 0).toFixed(2)}%`;

/* Animated Number */
const useCountUp = (value) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 500;
    const step = value / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return count;
};

/* ======================================================
 COMPONENT
====================================================== */
const PnLView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("1M");

  const userEmail = localStorage.getItem("userEmail");

  const fetchPnL = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pnl", {
        params: { userEmail },
      });
      setData(res?.data?.data);
    } catch (err) {
      console.error("PnL error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) fetchPnL();
  }, [userEmail]);

  const rawProfit = data?.overview?.totalProfit || 0;

  const isProfit = useMemo(() => rawProfit >= 0, [rawProfit]);

  /* Animated values */
  const profit = useCountUp(Math.abs(rawProfit));
  const invested = useCountUp(data?.overview?.totalInvested || 0);
  const current = useCountUp(data?.overview?.currentValue || 0);

  const label = isProfit ? "Total Profit" : "Total Loss";
  const color = isProfit ? "text-green-600" : "text-red-500";

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BarChart3 size={20} /> Profit & Loss
          </h2>
          <p className="text-gray-500 text-sm">Live portfolio analytics</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {["1M", "3M", "6M", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-sm ${
                range === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {r}
            </button>
          ))}

          <button
            onClick={fetchPnL}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <div
        className={`p-6 rounded-2xl shadow border transition-all ${
          isProfit
            ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
            : "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">{label}</p>

            <h2 className={`text-3xl font-bold ${color}`}>
              {formatCurrency(profit)}
            </h2>

            <p className="text-sm mt-2">
              {formatPercent(data?.overview?.profitPercentage)}
            </p>
          </div>

          {isProfit ? (
            <TrendingUp className="text-green-600" size={40} />
          ) : (
            <TrendingDown className="text-red-500" size={40} />
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Invested" value={invested} />
        <Card title="Current Value" value={current} />
        <Card
          title="Unrealized"
          value={Math.abs(data?.pnl?.unrealized)}
          color={data?.pnl?.unrealized >= 0 ? "text-green-600" : "text-red-500"}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="P&L Trend" icon={<LineIcon size={18} />}>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <LineChart data={data?.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="value" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Realized vs Unrealized" icon={<Activity size={18} />}>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={data?.pnlCompare}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* BREAKDOWN */}
      <ChartCard title="Asset Breakdown" icon={<Activity size={18} />}>
        <div className="space-y-4">
          {data?.breakdown?.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm">
                <span>{item.type}</span>
                <span>{formatCurrency(item.value)}</span>
              </div>
              <div className="bg-gray-200 h-2 rounded-full mt-1">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* GAINERS / LOSERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListCard title="Top Gainers" data={data?.gainers} green />
        <ListCard title="Top Losers" data={data?.losers} red />
      </div>

      {/* INSIGHTS */}
      <ChartCard title="Smart Insights" icon={<Activity size={18} />}>
        <ul className="space-y-2 text-sm text-gray-600">
          {data?.insights?.map((ins, i) => (
            <li key={i}>• {ins}</li>
          ))}
        </ul>
      </ChartCard>
    </div>
  );
};

/* ======================================================
 REUSABLE
====================================================== */

const Card = ({ title, value, color }) => (
  <div className="bg-white p-5 rounded-xl shadow border">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className={`text-xl font-semibold ${color || ""}`}>
      ₹{Number(value || 0).toLocaleString("en-IN")}
    </h3>
  </div>
);

const ChartCard = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow border">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

const ListCard = ({ title, data, green, red }) => (
  <div className="bg-white p-6 rounded-2xl shadow border">
    <h3 className="font-semibold mb-4">{title}</h3>

    <div className="space-y-2 text-sm">
      {data?.map((item, i) => (
        <div key={i} className="flex justify-between">
          <span>{item.name}</span>
          <span
            className={
              item.profit >= 0
                ? "text-green-600"
                : "text-red-500"
            }
          >
            ₹{Math.abs(item.profit || 0).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default PnLView;