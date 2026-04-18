// admin/src/pages/Notifications.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  RefreshCcw,
  PlusCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const LIMIT = 10;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedFields, setExpandedFields] = useState({});

  const fetchNotifications = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/admin/notifications?page=${pageNum}&limit=${LIMIT}`
      );
      setNotifications(res.data.notifications || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const totalPages = Math.ceil(total / LIMIT);

  const getStyle = (action) => {
    if (action === "insert")
      return {
        color: "text-blue-400",
        bg: "bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-blue-500/30",
        icon: <PlusCircle size={18} />,
      };
    if (action === "update")
      return {
        color: "text-green-400",
        bg: "bg-gradient-to-r from-green-500/10 to-green-600/5 border-green-500/30",
        icon: <Edit size={18} />,
      };
    if (action === "delete")
      return {
        color: "text-red-400",
        bg: "bg-gradient-to-r from-red-500/10 to-red-600/5 border-red-500/30",
        icon: <Trash2 size={18} />,
      };

    return {
      color: "text-gray-400",
      bg: "bg-gray-800 border-gray-700",
      icon: null,
    };
  };

  const isLargeObject = (val) => {
    return typeof val === "object" && val !== null;
  };

  const formatValue = (val, expanded, toggle) => {
    if (val === undefined || val === null) return "-";

    if (isLargeObject(val)) {
      const json = JSON.stringify(val, null, 2);

      if (!expanded) {
        return (
          <div className="space-y-1">
            <div className="truncate text-green-300">
              {json.slice(0, 120)}...
            </div>
            <button
              onClick={toggle}
              className="text-xs text-indigo-400 hover:underline"
            >
              View more
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <pre className="bg-gray-950 p-3 rounded-lg text-xs overflow-auto max-h-64 border border-gray-800">
            {json}
          </pre>
          <button
            onClick={toggle}
            className="text-xs text-indigo-400 hover:underline"
          >
            Show less
          </button>
        </div>
      );
    }

    return String(val);
  };

  /* ================= FIELD ROW ================= */
  const FieldRow = ({ label, oldVal, newVal, isChanged }) => {
    const keyId = `${label}`;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-gray-800 py-3 text-sm">
        <div className="text-gray-400 font-medium break-all">{label}</div>

        <div
          className={`break-all ${
            isChanged ? "text-red-400 line-through" : "text-gray-500"
          }`}
        >
          {formatValue(
            oldVal,
            expandedFields[`${keyId}-old`],
            () =>
              setExpandedFields((prev) => ({
                ...prev,
                [`${keyId}-old`]: !prev[`${keyId}-old`],
              }))
          )}
        </div>

        <div
          className={`break-all ${
            isChanged ? "text-green-400 font-semibold" : "text-white"
          }`}
        >
          {formatValue(
            newVal,
            expandedFields[`${keyId}-new`],
            () =>
              setExpandedFields((prev) => ({
                ...prev,
                [`${keyId}-new`]: !prev[`${keyId}-new`],
              }))
          )}
        </div>
      </div>
    );
  };

  /* ================= DETAILS ================= */
  const renderDetails = (data, action) => {
    if (!data) return null;

    const before = data.before || {};
    const after = data.after || {};
    const updatedFields = data.updatedFields || {};

    const keys = Array.from(
      new Set([
        ...Object.keys(before),
        ...Object.keys(after),
        ...Object.keys(updatedFields),
      ])
    );

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 text-xs text-gray-500 pb-2 border-b border-gray-700 uppercase tracking-wide">
          <div>Field</div>
          <div>Old Value</div>
          <div>Updated Value</div>
        </div>

        {keys.map((key) => {
          let oldVal = before[key];
          let newVal = after[key];

          if (updatedFields[key] !== undefined) {
            newVal = updatedFields[key];

            if (oldVal === undefined) {
              oldVal = before[key] ?? "-";
            }
          }

          const isChanged =
            action === "insert"
              ? true
              : action === "delete"
              ? true
              : JSON.stringify(oldVal) !== JSON.stringify(newVal);

          return (
            <FieldRow
              key={key}
              label={key}
              oldVal={oldVal}
              newVal={newVal}
              isChanged={isChanged}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl flex items-center gap-2 font-semibold tracking-tight">
          <Bell /> Notifications
        </h1>

        <button
          onClick={() => fetchNotifications(page)}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex gap-2 transition shadow-lg active:scale-95"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((n) => {
            const style = getStyle(n.action);

            return (
              <div
                key={n._id}
                onClick={() => setSelected(n)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.015] hover:shadow-xl ${style.bg}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className={`${style.color}`}>{style.icon}</div>

                    <div>
                      <div className={`font-semibold ${style.color}`}>
                        {n.message}
                      </div>
                      <div className="text-xs text-gray-400">
                        {n.collection}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-800 rounded disabled:opacity-40 hover:bg-gray-700 transition"
        >
          <ChevronLeft size={16} />
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded transition ${
              page === i + 1
                ? "bg-indigo-600 shadow-md"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-800 rounded disabled:opacity-40 hover:bg-gray-700 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 w-full max-w-5xl rounded-2xl p-6 shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Full Details</h2>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>

            <div className="bg-black rounded-lg p-4 max-h-[70vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-700">
              {renderDetails(selected.details, selected.action)}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow-lg transition active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;