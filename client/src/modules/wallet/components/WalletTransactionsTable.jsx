import React from "react";

const WalletTransactionsTable = ({ transactions }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow border overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} className="border-b">
              <td
                className={
                  t.type === "CREDIT"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {t.type}
              </td>
              <td>₹{t.amount}</td>
              <td>{t.description}</td>
              <td>
                {new Date(t.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletTransactionsTable;