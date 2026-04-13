import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  RefreshCcw,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/* ======================================================
 AXIOS
====================================================== */
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 20000,
});

/* ======================================================
 HELPERS
====================================================== */
const formatCurrency = (num) =>
  `₹${Number(num || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN");

/* ======================================================
 STATUS BADGE (MEMOIZED)
====================================================== */
const StatusBadge = React.memo(({ status }) => {
  const styles = {
    COMPLETED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-200 text-gray-700",
  };

  const labels = {
    COMPLETED: "Executed",
    PENDING: "Processing",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {labels[status] || status}
    </span>
  );
});

/* ======================================================
 ORDER CARD (MEMOIZED + PURE)
====================================================== */
const OrderCard = React.memo(({ order }) => {
  const isBuy = order.orderType === "BUY";

  return (
    <div className="group bg-white p-5 rounded-2xl shadow border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 will-change-transform">
      {/* TOP */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{order.symbol}</h3>
          <p className="text-xs text-gray-500">{order.name}</p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      {/* TYPE */}
      <div className="mt-3 flex items-center gap-2">
        {isBuy ? (
          <TrendingUp className="text-green-500" size={16} />
        ) : (
          <TrendingDown className="text-red-500" size={16} />
        )}

        <span
          className={`text-sm font-semibold ${
            isBuy ? "text-green-600" : "text-red-500"
          }`}
        >
          {order.orderType}
        </span>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Quantity</p>
          <p className="font-medium">{order.quantity}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Price</p>
          <p className="font-medium">{formatCurrency(order.price)}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Value</p>
          <p className="font-semibold text-blue-600">
            {formatCurrency(order.quantity * order.price)}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Asset</p>
          <p className="font-medium">{order.assetType || "-"}</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-5 text-xs text-gray-400">
        <span>{formatDate(order.createdAt)}</span>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          {order.status === "PENDING" && (
            <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
              Cancel
            </button>
          )}

          {order.status === "FAILED" && (
            <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

/* ======================================================
 MAIN COMPONENT
====================================================== */
const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assetFilter, setAssetFilter] = useState("");

  const [page, setPage] = useState(1);
  const limit = 8;

  const userEmail = localStorage.getItem("userEmail");

  /* ======================================================
 FETCH (MEMOIZED)
 ====================================================== */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/orders", {
        params: {
          userEmail,
          search,
          type: typeFilter,
          status: statusFilter,
          assetType: assetFilter,
          page,
          limit,
        },
      });

      setOrders(res?.data?.data?.data || []);
      setPagination(res?.data?.data?.pagination || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userEmail, search, typeFilter, statusFilter, assetFilter, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ======================================================
 AUTO REFRESH
 ====================================================== */
  useEffect(() => {
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  /* ======================================================
 VIRTUALIZATION (VISIBLE WINDOW)
 ====================================================== */
  const visibleOrders = useMemo(() => {
    return orders.slice(0, 50); // limit render (virtualization-lite)
  }, [orders]);

  /* ======================================================
 UI
 ====================================================== */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Orders</h2>
          <p className="text-sm text-gray-500">
            Track and analyze your trades
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow border flex flex-wrap gap-3">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl w-full md:w-1/3">
          <Search size={16} />
          <input
            className="ml-2 bg-transparent outline-none w-full"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => {
            setPage(1);
            setTypeFilter(e.target.value);
          }}
        >
          <option value="">All Types</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="COMPLETED">Executed</option>
          <option value="PENDING">Processing</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => {
            setPage(1);
            setAssetFilter(e.target.value);
          }}
        >
          <option value="">All Assets</option>
          <option value="STOCK">Stock</option>
          <option value="SIP">SIP</option>
          <option value="IPO">IPO</option>
        </select>
      </div>

      {/* STATS */}
      <div className="bg-white p-4 rounded-2xl shadow border flex justify-between">
        <p>
          Total Orders:{" "}
          <span className="font-semibold">
            {pagination?.total || 0}
          </span>
        </p>
        <p className="text-sm flex items-center gap-1 text-gray-500">
          <Clock size={14} /> Auto-refresh: 10s
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center p-10">Loading orders...</div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* PAGINATION */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-4 items-center">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="p-2 bg-gray-200 rounded-lg"
          >
            <ChevronLeft size={16} />
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(p + 1, pagination.totalPages)
              )
            }
            className="p-2 bg-gray-200 rounded-lg"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersView;