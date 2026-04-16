// src/pages/SIP.jsx

import { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import { fetchSIP } from "../services/sip";
import { RefreshCcw, Search } from "lucide-react";

const SIP = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchSIP();

      const sipData =
        res?.data?.sip ||
        res?.sip ||
        [];

      setData(sipData);
      setFilteredData(sipData);
    } catch (err) {
      console.error("SIP Fetch Error:", err);
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
        item.assetName,
        item.userEmail,
        item.amount?.toString(),
        item.installments?.toString(),
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
        header: "Fund",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {(row.assetName || "F")[0]?.toUpperCase()}
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {row.assetName || "-"}
            </span>
          </div>
        ),
      },
      {
        header: "Amount",
        render: (row) => (
          <span className="font-semibold text-green-500">
            ₹ {row.amount ?? "-"}
          </span>
        ),
      },
      {
        header: "Installments",
        render: (row) => (
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {row.installments ?? "-"}
          </span>
        ),
      },
      {
        header: "Duration (Years)",
        render: (row) => (
          <span className="text-gray-500 text-sm">
            {row.duration ?? "-"}
          </span>
        ),
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
            SIP Investments
          </h1>
          <p className="text-gray-400">
            Manage and monitor systematic investment plans
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
          placeholder="Search SIP..."
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
        emptyText="No SIP data found"
      />
    </div>
  );
};

export default SIP;