// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import Chart from "../components/Chart";
import API from "../services/api";

import {
  Users,
  Wallet,
  TrendingUp,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    investments: 0,
    transactions: 0,
    wallets: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const res = await API.get("/admin/dashboard");

        const data = res?.data?.data || {};

        setStats({
          users: data.users || 0,
          investments: (data.stocks || 0) + (data.sip || 0) + (data.ipo || 0),
          transactions: data.transactions || 0,
          wallets: data.wallets || 0,
        });

        setChartData([
          { name: "Users", value: data.users || 0 },
          { name: "Stocks", value: data.stocks || 0 },
          { name: "SIP", value: data.sip || 0 },
          { name: "IPO", value: data.ipo || 0 },
        ]);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 text-sm">
          Monitor platform performance & analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          trend={12}
        />
        <StatsCard
          title="Investments"
          value={stats.investments}
          icon={TrendingUp}
          trend={8}
        />
        <StatsCard
          title="Transactions"
          value={stats.transactions}
          icon={Activity}
          trend={-3}
        />
        <StatsCard
          title="Wallets"
          value={stats.wallets}
          icon={Wallet}
          trend={5}
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm text-gray-400 mb-4">
            Platform Analytics
          </h3>

          <Chart data={chartData} />
        </div>

        {/* Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm text-gray-400 mb-4">
            Recent Activity
          </h3>

          <div className="space-y-4">
            {[
              "User registered",
              "New investment added",
              "Transaction completed",
              "Wallet updated",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm bg-gray-800/40 hover:bg-gray-800/70 px-3 py-2 rounded-lg transition"
              >
                <span className="text-gray-300">{item}</span>
                <span className="text-gray-500 text-xs">
                  {i + 1}h ago
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm text-gray-400 mb-4">
          Quick Insights
        </h3>

        <p className="text-gray-500 text-sm">
          More analytics and reports will be displayed here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;