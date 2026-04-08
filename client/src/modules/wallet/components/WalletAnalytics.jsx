import React from "react";

const WalletAnalytics = ({ transactions }) => {
  const totalCredit = transactions
    .filter((t) => t.type === "CREDIT")
    .reduce((a, b) => a + b.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "DEBIT")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="bg-white p-5 rounded-2xl shadow border">
      <p>Total Credit: ₹{totalCredit}</p>
      <p>Total Debit: ₹{totalDebit}</p>
    </div>
  );
};

export default WalletAnalytics;