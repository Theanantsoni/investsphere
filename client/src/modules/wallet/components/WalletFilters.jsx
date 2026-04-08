import React from "react";

const WalletFilters = ({ setFilter }) => {
  return (
    <select
      onChange={(e) => setFilter(e.target.value)}
      className="border px-3 py-2 rounded-lg"
    >
      <option value="all">All</option>
      <option value="CREDIT">Credit</option>
      <option value="DEBIT">Debit</option>
    </select>
  );
};

export default WalletFilters;