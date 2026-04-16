// src/pages/Stocks.jsx

import { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import { fetchStocks } from "../services/stocks";
import { RefreshCcw, Search } from "lucide-react";

const Stocks = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchStocks();

      const stocks =
        res?.data?.stocks ||
        res?.stocks ||
        [];

      setData(stocks);
      setFilteredData(stocks);
    } catch (err) {
      console.error("Stocks Fetch Error:", err);
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
        item.companyName,
        item.symbol,
        item.userEmail,
        item.totalAmount?.toString(),
      ]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );

    setFilteredData(filtered);
  }, [search, data]);

  /* ======================================================
    COLUMNS (FIXED)
  ====================================================== */
  const columns = useMemo(
    () => [
      {
        header: "Stock",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {(row.symbol || "S")[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-medium">
                {row.companyName}
              </span>
              <span className="text-gray-400 text-xs">
                {row.symbol}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Type",
        render: (row) => (
          <span className={`px-2 py-1 rounded-full text-xs ${
            row.type === "buy"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}>
            {row.type}
          </span>
        ),
      },
      {
        header: "Quantity",
        render: (row) => (
          <span className="text-gray-300">
            {row.quantity}
          </span>
        ),
      },
      {
        header: "Price",
        render: (row) => (
          <span className="text-gray-400">
            ₹ {row.price}
          </span>
        ),
      },
      {
        header: "Total",
        render: (row) => (
          <span className="font-semibold text-green-400">
            ₹ {row.totalAmount}
          </span>
        ),
      },
      {
        header: "Status",
        render: (row) => {
          const status = row.status;

          const style =
            status === "completed"
              ? "bg-green-500/10 text-green-400"
              : status === "pending"
              ? "bg-yellow-500/10 text-yellow-400"
              : "bg-red-500/10 text-red-400";

          return (
            <span className={`px-2 py-1 rounded-full text-xs ${style}`}>
              {status}
            </span>
          );
        },
      },
      {
        header: "User",
        render: (row) => (
          <span className="text-gray-400 text-sm">
            {row.userEmail}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Stock Investments
          </h1>
          <p className="text-gray-400">
            View and manage stock records
          </p>
        </div>

        <button
          onClick={load}
          className="bg-indigo-600 px-4 py-2 rounded-xl text-white flex gap-2 items-center"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 py-2 w-full bg-gray-900 border border-gray-800 rounded-xl text-white"
        />
      </div>

      <Table
        columns={columns}
        data={filteredData}
        loading={loading}
        emptyText="No stocks found"
      />
    </div>
  );
};

export default Stocks;