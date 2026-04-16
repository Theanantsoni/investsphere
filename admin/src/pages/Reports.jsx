// src/pages/Reports.jsx

import { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import { fetchReports } from "../services/reports";
import { RefreshCcw, Search } from "lucide-react";

const Reports = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchReports();

      const reports =
        res?.data?.reports ||
        res?.reports ||
        [];

      setData(reports);
      setFilteredData(reports);
    } catch (err) {
      console.error("Reports Fetch Error:", err);
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
        item.title,
        item.name,
        item.userEmail,
        item.userName,
        item.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );

    setFilteredData(filtered);
  }, [search, data]);

  /* ======================================================
    COLUMNS (UPDATED FULL)
  ====================================================== */
  const columns = useMemo(
    () => [
      {
        header: "Title",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {(row.title || "R")[0]?.toUpperCase()}
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {row.title || "-"}
            </span>
          </div>
        ),
      },
      {
        header: "Description",
        render: (row) => (
          <span className="text-gray-600 dark:text-gray-300 text-sm max-w-xs truncate">
            {row.description || "-"}
          </span>
        ),
      },
      {
        header: "User Name",
        render: (row) => (
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {row.userName || "-"}
          </span>
        ),
      },
      {
        header: "Email",
        render: (row) => (
          <span className="text-gray-500 dark:text-gray-400 text-sm break-all">
            {row.userEmail || "-"}
          </span>
        ),
      },
      {
        header: "Created",
        render: (row) => (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString()
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View system-generated reports and analytics
          </p>
        </div>

        <button
          onClick={load}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 shadow-xl">
        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          emptyText="No reports found"
        />
      </div>
    </div>
  );
};

export default Reports;