import React from "react";

const WalletBalance = ({ balance }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border">
      <p className="text-gray-500 text-sm">Wallet Balance</p>
      <h2 className="text-3xl font-bold text-green-600 mt-2">
        ₹{balance}
      </h2>
    </div>
  );
};

export default WalletBalance;