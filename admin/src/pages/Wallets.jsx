// src/pages/Wallets.jsx

import { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import { fetchWallets } from "../services/wallets";
import { RefreshCcw, Search } from "lucide-react";

const Wallets = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchWallets();

      // ✅ FIX: backend response support
      const wallets =
        res?.data?.wallets ||
        res?.wallets ||
        [];

      setData(wallets);
      setFilteredData(wallets);
    } catch (err) {
      console.error("Wallets Fetch Error:", err);
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
    SEARCH FILTER
  ====================================================== */
  useEffect(() => {
    if (!search) {
      setFilteredData(data);
      return;
    }

    const lower = search.toLowerCase();

    const filtered = data.filter((item) =>
      [
        item.userEmail,
        item.email,
        item.balance?.toString(),
        item.currency,
      ]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );

    setFilteredData(filtered);
  }, [search, data]);

  /* ======================================================
    COLUMNS
  ====================================================== */
  const columns = useMemo(
    () => [
      {
        header: "User",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
              {(row.userEmail || row.email || "U")[0]?.toUpperCase()}
            </div>
            <span className="text-gray-700 dark:text-gray-300 text-sm break-all">
              {row.userEmail || row.email || "-"}
            </span>
          </div>
        ),
      },
      {
        header: "Balance",
        render: (row) => (
          <span className="font-semibold text-green-500 dark:text-green-400">
            ₹ {row.balance ?? 0}
          </span>
        ),
      },
      {
        header: "Currency",
        render: (row) => (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow">
            {row.currency || "INR"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Wallets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and monitor user wallet balances
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

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search wallets..."
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
          emptyText="No wallets found"
        />
      </div>
    </div>
  );
};

export default Wallets;