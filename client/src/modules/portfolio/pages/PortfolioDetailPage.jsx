import React from "react";
import { useParams } from "react-router-dom";
import usePortfolio from "../hooks/usePortfolio";

const PortfolioDetailPage = () => {
  const { id } = useParams();
  const { assets } = usePortfolio();

  const asset = assets.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className="p-6 text-center text-gray-500">
        Asset not found
      </div>
    );
  }

  const isProfit = asset.profit >= 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {asset.name}
            </h1>
            <p className="text-sm text-gray-400">
              {asset.type.toUpperCase()}
            </p>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              isProfit
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isProfit ? "Profit" : "Loss"}
          </span>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Invested Amount
            </p>
            <p className="text-xl font-bold text-gray-800">
              ₹{asset.invested.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Current Value
            </p>
            <p className="text-xl font-bold text-gray-800">
              ₹{asset.current.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Profit / Loss
            </p>
            <p
              className={`text-xl font-bold ${
                isProfit ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{asset.profit.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Return %
            </p>
            <p className="text-xl font-bold text-gray-800">
              {asset.percentage}%
            </p>
          </div>
        </div>

        {/* EXTRA INFO */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            Investment Insights
          </h3>

          <p className="text-sm text-gray-600">
            This asset has generated{" "}
            <b
              className={
                isProfit ? "text-green-600" : "text-red-600"
              }
            >
              {asset.percentage}%
            </b>{" "}
            return based on your investment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailPage;