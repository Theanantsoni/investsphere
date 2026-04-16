// src/pages/Watchlist.jsx

import { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import { fetchWatchlist } from "../services/watchlist";
import { RefreshCcw, Search } from "lucide-react";

const Watchlist = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchWatchlist();

      // ✅ FIX: backend response support
      const watchlist =
        res?.data?.watchlist ||
        res?.watchlist ||
        [];

      setData(watchlist);
      setFilteredData(watchlist);
    } catch (err) {
      console.error("Watchlist Fetch Error:", err);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ======================================================
    FILTER (TYPE + SEARCH)
  ====================================================== */
  useEffect(() => {
    let temp = [...data];

    // 🔹 Type Filter
    if (activeTab !== "all") {
      temp = temp.filter((item) =>
        (item.type || "").toLowerCase() === activeTab
      );
    }

    // 🔹 Search Filter
    if (search) {
      const lower = search.toLowerCase();

      temp = temp.filter((item) =>
        [
          item.stockName,
          item.userEmail,
          item.itemName,
          item.email,
          item.type,
        ]
          .join(" ")
          .toLowerCase()
          .includes(lower)
      );
    }

    setFilteredData(temp);
  }, [search, data, activeTab]);

  /* ======================================================
    COLUMNS
  ====================================================== */
  const columns = useMemo(
    () => [
      {
        header: "Stock",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
              {(row.stockName || row.itemName || "S")[0]?.toUpperCase()}
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {row.stockName || row.itemName || "-"}
            </span>
          </div>
        ),
      },
      {
        header: "Type",
        render: (row) => {
          const type = row.type || "stock";
          return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 capitalize">
              {type}
            </span>
          );
        },
      },
      {
        header: "User",
        render: (row) => (
          <span className="text-gray-500 dark:text-gray-400 text-sm break-all">
            {row.userEmail || row.email || "-"}
          </span>
        ),
      },
    ],
    []
  );

  const tabs = [
    { label: "All", value: "all" },
    { label: "Stock", value: "stock" },
    { label: "IPO", value: "ipo" },
    { label: "SIP", value: "sip" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Watchlist
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track user-selected stocks and interests
          </p>
        </div>

        <button
          onClick={load}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg shadow-indigo-600/30 active:scale-95"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.value
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search watchlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 shadow-xl shadow-black/10 dark:shadow-black/30">
        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          emptyText="No watchlist data found"
        />
      </div>
    </div>
  );
};

export default Watchlist;