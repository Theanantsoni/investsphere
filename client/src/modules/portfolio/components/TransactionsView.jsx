import React, { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 5;

const TransactionsView = ({ transactions = [] }) => {
  const [activeType, setActiveType] = useState("asset");
  const [search, setSearch] = useState("");
  const [assetFilter, setAssetFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  /* ================= HELPERS ================= */
  const getAmount = (t) => t.totalAmount || t.amount || 0;

  const getDate = (t) =>
    t.createdAt
      ? new Date(t.createdAt).toLocaleDateString()
      : t.date
      ? new Date(t.date).toLocaleDateString()
      : "-";

  /* ================= SIP WITHDRAW LABEL ================= */
  const getActionLabel = (transaction) => {
    if (
      transaction.assetType?.toLowerCase() === "sip" &&
      transaction.type === "SELL"
    ) {
      return "WITHDRAW";
    }

    return transaction.type;
  };

  /* ================= FILTER LOGIC ================= */
  const filteredData = useMemo(() => {
    let data =
      activeType === "asset"
        ? transactions.filter((t) => t.assetType !== "wallet")
        : transactions.filter(
            (t) =>
              t.assetType === "wallet" ||
              t.type === "CREDIT" ||
              t.type === "DEBIT"
          );

    if (search.trim()) {
      data = data.filter((t) =>
        JSON.stringify(t)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (activeType === "asset" && assetFilter !== "ALL") {
      data = data.filter((t) => t.type === assetFilter);
    }

    if (activeType === "payment" && paymentFilter !== "ALL") {
      data = data.filter((t) => t.type === paymentFilter);
    }

    return data;
  }, [
    transactions,
    activeType,
    search,
    assetFilter,
    paymentFilter,
  ]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(
    filteredData.length / ITEMS_PER_PAGE
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;

    return filteredData.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredData, page]);

  /* ================= COLOR TEXT ================= */
  const getTextColor = (type) => {
    switch (type) {
      case "BUY":
        return "text-blue-600 font-semibold";

      case "SELL":
        return "text-orange-500 font-semibold";

      case "CREDIT":
        return "text-green-600 font-semibold";

      case "DEBIT":
        return "text-red-600 font-semibold";

      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-lg border border-gray-100 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          Transactions
        </h2>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex flex-wrap gap-2">

        <button
          onClick={() => {
            setActiveType("asset");
            setPage(1);
          }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeType === "asset"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Asset Transactions
        </button>

        <button
          onClick={() => {
            setActiveType("payment");
            setPage(1);
          }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeType === "payment"
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Payment Transactions
        </button>

      </div>

      {/* ================= SEARCH + FILTER ================= */}
      <div className="flex flex-col lg:flex-row gap-3">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full lg:flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        {/* ASSET FILTER */}
        {activeType === "asset" && (
          <select
            value={assetFilter}
            onChange={(e) => {
              setAssetFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="ALL">
              All
            </option>

            <option
              value="BUY"
              className="text-blue-600 font-semibold"
            >
              BUY
            </option>

            <option
              value="SELL"
              className="text-orange-500 font-semibold"
            >
              SELL / WITHDRAW
            </option>

          </select>
        )}

        {/* PAYMENT FILTER */}
        {activeType === "payment" && (
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-green-200 bg-green-50 text-green-700 font-semibold focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="ALL">
              All
            </option>

            <option
              value="CREDIT"
              className="text-green-600 font-semibold"
            >
              CREDIT
            </option>

            <option
              value="DEBIT"
              className="text-red-600 font-semibold"
            >
              DEBIT
            </option>

          </select>
        )}

      </div>

      {/* ================= TABLE ================= */}
      <div className="w-full overflow-x-auto">

        <table className="w-full min-w-[700px] text-sm text-left">

          <thead>
            {activeType === "asset" ? (
              <tr className="text-gray-500 text-xs uppercase tracking-wide border-b">

                <th className="py-3 px-3">
                  Asset
                </th>

                <th className="py-3 px-3">
                  Type
                </th>

                <th className="py-3 px-3">
                  Action
                </th>

                <th className="py-3 px-3">
                  Qty
                </th>

                <th className="py-3 px-3">
                  Amount
                </th>

                <th className="py-3 px-3">
                  Date
                </th>

              </tr>
            ) : (
              <tr className="text-gray-500 text-xs uppercase tracking-wide border-b">

                <th className="py-3 px-3">
                  Type
                </th>

                <th className="py-3 px-3">
                  Amount
                </th>

                <th className="py-3 px-3">
                  Description
                </th>

                <th className="py-3 px-3">
                  Date
                </th>

              </tr>
            )}
          </thead>

          <tbody>

            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-gray-400"
                >
                  No transactions found
                </td>
              </tr>
            ) : activeType === "asset" ? (
              paginatedData.map((t) => {

                const actionLabel =
                  getActionLabel(t);

                return (
                  <tr
                    key={t._id}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                  >

                    <td className="py-3 px-3 whitespace-nowrap">
                      {t.assetName}
                    </td>

                    <td className="py-3 px-3 text-gray-600">
                      {t.assetType}
                    </td>

                    <td
                      className={`py-3 px-3 ${getTextColor(
                        t.type
                      )}`}
                    >
                      {actionLabel}
                    </td>

                    <td className="py-3 px-3">
                      {t.quantity}
                    </td>

                    <td className="py-3 px-3 font-medium">
                      ₹{getAmount(t)}
                    </td>

                    <td className="py-3 px-3 text-gray-500">
                      {getDate(t)}
                    </td>

                  </tr>
                );
              })
            ) : (
              paginatedData.map((t) => (
                <tr
                  key={t._id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >

                  <td
                    className={`py-3 px-3 ${getTextColor(
                      t.type
                    )}`}
                  >
                    {t.type}
                  </td>

                  <td className="py-3 px-3 font-medium">
                    ₹{getAmount(t)}
                  </td>

                  <td className="py-3 px-3 text-gray-600 break-words max-w-[250px]">
                    {t.description}
                  </td>

                  <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                    {getDate(t)}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 pt-2">

          <button
            onClick={() =>
              setPage((p) =>
                Math.max(p - 1, 1)
              )
            }
            className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-100"
          >
            Prev
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => (
              <button
                key={i}
                onClick={() =>
                  setPage(i + 1)
                }
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  page === i + 1
                    ? "bg-blue-600 text-white shadow"
                    : "border hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(
                  p + 1,
                  totalPages
                )
              )
            }
            className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-100"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
};

export default TransactionsView;