import React from "react";

const WalletSearch = ({ setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search transactions"
      onChange={(e) => setSearch(e.target.value)}
      className="border px-3 py-2 rounded-lg w-full"
    />
  );
};

export default WalletSearch;