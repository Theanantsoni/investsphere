import React from "react";

const PnLView = ({ summary }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-semibold mb-4">Profit & Loss</h2>

      <p>Total Profit: ₹{summary?.totalProfit}</p>
      <p>Return: {summary?.profitPercentage}%</p>
    </div>
  );
};

export default PnLView;