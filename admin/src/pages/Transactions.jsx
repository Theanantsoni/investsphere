// src/pages/Transactions.jsx

import { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import { fetchTransactions } from "../services/transactions";
import { RefreshCcw, Search } from "lucide-react";

const Transactions = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchTransactions();

      const tx =
        res?.data?.transactions ||
        res?.transactions ||
        [];

      setData(tx);
      setFilteredData(tx);
    } catch (err) {
      console.error("Transactions Fetch Error:", err);
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
        item.username,
        item.assetType,
        item.assetCode,
        item.assetName,
        item.type,
        item.orderType,
        item.status,
        item.quantity?.toString(),
        item.price?.toString(),
        item.totalAmount?.toString(),
        item.executionPrice?.toString(),
        item.notes,
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
          <div className="flex flex-col">
            <span className="text-gray-200 font-medium">
              {row.username || "-"}
            </span>
            <span className="text-xs text-gray-500">
              {row.userEmail || "-"}
            </span>
          </div>
        ),
      },
      {
        header: "Asset",
        render: (row) => (
          <div className="flex flex-col">
            <span className="text-gray-300 text-sm">
              {row.assetName || "-"}
            </span>
            <span className="text-xs text-gray-500">
              {row.assetCode || "-"} • {row.assetType || "-"}
            </span>
          </div>
        ),
      },
      {
        header: "Type",
        render: (row) => {
          const isBuy = row.type === "BUY";

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isBuy
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              {row.type}
            </span>
          );
        },
      },
      {
        header: "Order",
        render: (row) => (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
            {row.orderType || "-"}
          </span>
        ),
      },
      {
        header: "Status",
        render: (row) => {
          const status = row.status || "unknown";

          const style =
            status === "completed"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : status === "pending"
              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20";

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${style}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        header: "Quantity",
        render: (row) => (
          <span className="text-gray-300 text-sm">
            {row.quantity ?? "-"}
          </span>
        ),
      },
      {
        header: "Price",
        render: (row) => (
          <span className="text-green-400 font-semibold">
            ₹ {row.price ?? "-"}
          </span>
        ),
      },
      {
        header: "Total",
        render: (row) => (
          <span className="text-green-500 font-semibold">
            ₹ {row.totalAmount ?? "-"}
          </span>
        ),
      },
      {
        header: "Exec Price",
        render: (row) => (
          <span className="text-gray-400 text-sm">
            {row.executionPrice ?? "-"}
          </span>
        ),
      },
      {
        header: "Reference",
        render: (row) => (
          <span className="text-gray-500 text-xs break-all">
            {row.referenceId || "-"}
          </span>
        ),
      },
      {
        header: "Notes",
        render: (row) => (
          <span className="text-gray-400 text-sm max-w-[200px] truncate">
            {row.notes || "-"}
          </span>
        ),
      },
      {
        header: "Date",
        render: (row) => (
          <span className="text-gray-500 text-sm">
            {row.createdAt
              ? new Date(row.createdAt).toLocaleString()
              : "-"}
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Transactions
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Monitor all platform transactions in real-time
          </p>
        </div>

        <button
          onClick={load}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/30 active:scale-95"
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
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner"
        />
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 shadow-xl">
        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          emptyText="No transactions found"
        />
      </div>
    </div>
  );
};

export default Transactions;