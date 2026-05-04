import React, { useState, useMemo } from "react";

const WalletTransactionsTable = ({ transactions = [] }) => {
  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const totalPages = Math.ceil(transactions.length / recordsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return transactions.slice(
      startIndex,
      startIndex + recordsPerPage
    );
  }, [transactions, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /* ================= EMPTY ================= */
  if (!transactions.length) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
        No transactions available
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow border">
      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="py-3">Type</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Description</th>
              <th className="py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((t, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td
                  className={`py-2 font-medium ${
                    t.type === "CREDIT"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.type}
                </td>

                <td className="py-2">
                  ₹{Number(t.amount || 0).toLocaleString("en-IN")}
                </td>

                <td className="py-2">{t.description}</td>

                <td className="py-2">
                  {new Date(t.date).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-2 mt-5 flex-wrap">
        {/* PREV */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* NEXT */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WalletTransactionsTable;