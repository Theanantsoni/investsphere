// src/pages/Users.jsx

import { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import { fetchUsers } from "../services/users";
import { RefreshCcw, Search } from "lucide-react";

const Users = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers();

      const users =
        res?.data?.users ||
        res?.users ||
        [];

      setData(users);
      setFilteredData(users);
    } catch (err) {
      console.error("Users Fetch Error:", err);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ======================================================
    SEARCH
  ====================================================== */
  useEffect(() => {
    if (!search) {
      setFilteredData(data);
      return;
    }

    const lower = search.toLowerCase();

    const filtered = data.filter((item) =>
      [
        item.name,
        item.email,
        item.phone,
        item.country,
        item.state,
        item.pan,
      ]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );

    setFilteredData(filtered);
  }, [search, data]);

  /* ======================================================
    COLUMNS (FULL DETAILS)
  ====================================================== */
  const columns = useMemo(
    () => [
      {
        header: "User",
        render: (row) => (
          <div className="flex items-center gap-3">
            {row.profileImage ? (
              <img
                src={row.profileImage}
                alt="user"
                className="w-10 h-10 rounded-xl object-cover border border-gray-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {(row.name || "U")[0]}
              </div>
            )}

            <div>
              <div className="text-white font-medium">
                {row.name || "-"}
              </div>
              <div className="text-gray-400 text-xs">
                {row.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Phone",
        render: (row) => (
          <span className="text-gray-300 text-sm">
            {row.phone || "-"}
          </span>
        ),
      },
      {
        header: "PAN",
        render: (row) => (
          <span className="text-gray-400 text-sm">
            {row.pan || "-"}
          </span>
        ),
      },
      {
        header: "Country",
        render: (row) => (
          <span className="text-gray-300 text-sm">
            {row.country || "-"}
          </span>
        ),
      },
      {
        header: "State",
        render: (row) => (
          <span className="text-gray-400 text-sm">
            {row.state || "-"}
          </span>
        ),
      },
      {
        header: "Verified",
        render: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              row.verified
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {row.verified ? "Yes" : "No"}
          </span>
        ),
      },
      {
        header: "DOB",
        render: (row) => (
          <span className="text-gray-400 text-sm">
            {row.dob
              ? new Date(row.dob).toLocaleDateString()
              : "-"}
          </span>
        ),
      },
      {
        header: "Role",
        render: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              row.role === "admin"
                ? "bg-green-500/10 text-green-400"
                : "bg-indigo-500/10 text-indigo-400"
            }`}
          >
            {row.role || "user"}
          </span>
        ),
      },
      {
        header: "Status",
        render: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              row.isActive
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        header: "Created",
        render: (row) => (
          <span className="text-gray-400 text-sm">
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString()
              : "-"}
          </span>
        ),
      },
      {
        header: "Updated",
        render: (row) => (
          <span className="text-gray-500 text-sm">
            {row.updatedAt
              ? new Date(row.updatedAt).toLocaleDateString()
              : "-"}
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
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-gray-400">Manage all users data</p>
        </div>

        <button
          onClick={loadUsers}
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
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 py-2 w-full bg-gray-900 border border-gray-800 rounded-xl text-white"
        />
      </div>

      <Table
        columns={columns}
        data={filteredData}
        loading={loading}
        emptyText="No users found"
      />
    </div>
  );
};

export default Users;