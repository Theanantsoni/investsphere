// src/pages/IPO.jsx

import { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import { fetchIPO } from "../services/ipo";
import { RefreshCcw, Search } from "lucide-react";

const IPO = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchIPO();

      const ipoData =
        res?.data?.ipo ||
        res?.ipo ||
        [];

      setData(ipoData);
      setFilteredData(ipoData);
    } catch (err) {
      console.error("IPO Fetch Error:", err);
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
        item.assetName,
        item.userEmail,
        item.totalAmount?.toString(),
        item.status,
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
        header: "IPO Name",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {(row.companyName || "I")[0]?.toUpperCase()}
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {row.companyName || row.assetName || "-"}
            </span>
          </div>
        ),
      },
      {
        header: "Total Amount",
        render: (row) => (
          <span className="font-semibold text-green-500">
            ₹ {row.totalAmount ?? "-"}
          </span>
        ),
      },
      {
        header: "Price",
        render: (row) => (
          <span className="text-gray-400 text-sm">
            ₹ {row.price ?? "-"}
          </span>
        ),
      },
      {
        header: "Current Price",
        render: (row) => (
          <span className="text-gray-400 text-sm">
            ₹ {row.currentPrice ?? "-"}
          </span>
        ),
      },
      {
        header: "Status",
        render: (row) => {
          const status = row.status || "unknown";

          const style =
            status === "allotted"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : status === "applied"
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
        header: "User",
        render: (row) => (
          <span className="text-gray-500 text-sm break-all">
            {row.userEmail || "-"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            IPO Investments
          </h1>
          <p className="text-gray-400">
            Track and manage IPO participation data
          </p>
        </div>

        <button
          onClick={load}
          className="bg-indigo-600 px-4 py-2 rounded-xl text-white flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search IPO..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white"
        />
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        data={filteredData}
        loading={loading}
        emptyText="No IPO data found"
      />
    </div>
  );
};

export default IPO;