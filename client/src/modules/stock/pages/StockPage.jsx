import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import StockHeroSection from "../components/StockHeroSection";
import StockSearchFilters from "../components/StockSearchFilters";
import StockPagination from "../components/StockPagination";
import useStock from "../hooks/useStock";

const StockPage = () => {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { stocks, loading } = useStock();

  const itemsPerPage = 15;

  /* ================= RESET PAGE ================= */

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  /* ================= FORMAT MARKET CAP ================= */

  const formatMarketCap = (value) => {

    if (value === null || value === undefined) return "—";

    if (value >= 1e12) return (value / 1e12).toFixed(2) + "T";

    if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";

    if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";

    return value;

  };

  /* ================= FILTER LOGIC ================= */

  const filteredStocks = useMemo(() => {

    let data = [...stocks];

    if (search) {

      data = data.filter((stock) =>
        stock.symbol
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        stock.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

    }

    if (filter === "Top Gainers") {

      data = [...data]
        .sort((a, b) => (b.change || 0) - (a.change || 0))
        .slice(0, 50);

    }

    if (filter === "Top Losers") {

      data = [...data]
        .sort((a, b) => (a.change || 0) - (b.change || 0))
        .slice(0, 50);

    }

    if (filter === "Most Active") {

      data = [...data]
        .sort((a, b) => (b.volume || 0) - (a.volume || 0));

    }

    return data;

  }, [stocks, search, filter]);

  /* ================= MARKET INSIGHTS ================= */

  const topGainers = useMemo(() => {

    return [...stocks]
      .sort((a, b) => (b.change || 0) - (a.change || 0))
      .slice(0, 5);

  }, [stocks]);

  const topLosers = useMemo(() => {

    return [...stocks]
      .sort((a, b) => (a.change || 0) - (b.change || 0))
      .slice(0, 5);

  }, [stocks]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(
    filteredStocks.length / itemsPerPage
  );

  const paginatedStocks = useMemo(() => {

    const start = (page - 1) * itemsPerPage;

    return filteredStocks.slice(
      start,
      start + itemsPerPage
    );

  }, [filteredStocks, page]);

  return (

    <div className="bg-gray-50 min-h-screen">

      <StockHeroSection />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= SEARCH FILTER ================= */}

        <StockSearchFilters
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />

        {/* ================= MARKET INSIGHTS ================= */}

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* GAINERS */}

          <div className="bg-white rounded-xl shadow border p-6">

            <h2 className="font-semibold text-lg mb-4">
              Top Gainers
            </h2>

            <div className="space-y-3">

              {topGainers.map((stock) => (

                <div
                  key={stock.symbol}
                  className="flex justify-between text-sm"
                >

                  <span className="font-medium">
                    {stock.symbol}
                  </span>

                  <span className="text-green-600 font-semibold">
                    +{Number(stock.change || 0).toFixed(2)}%
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* LOSERS */}

          <div className="bg-white rounded-xl shadow border p-6">

            <h2 className="font-semibold text-lg mb-4">
              Top Losers
            </h2>

            <div className="space-y-3">

              {topLosers.map((stock) => (

                <div
                  key={stock.symbol}
                  className="flex justify-between text-sm"
                >

                  <span className="font-medium">
                    {stock.symbol}
                  </span>

                  <span className="text-red-600 font-semibold">
                    {Number(stock.change || 0).toFixed(2)}%
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* ================= STOCK TABLE ================= */}

        <div className="bg-white rounded-xl border shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-gray-100 text-gray-600 text-sm sticky top-0 z-10">

                <tr>

                  <th className="px-6 py-4 font-semibold">
                    Company
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Symbol
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Price
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Change
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Market Cap
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Volume
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading && (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-20 text-gray-400 animate-pulse"
                    >
                      Loading market data...
                    </td>

                  </tr>

                )}

                {!loading &&
                  paginatedStocks.map((stock) => {

                    const positive = (stock.change || 0) >= 0;

                    return (

                      <tr
                        key={stock.symbol}
                        onClick={() =>
                          navigate(`/stock/${stock.symbol}`)
                        }
                        className="border-t hover:bg-gray-50 transition duration-150 cursor-pointer"
                      >

                        <td className="px-6 py-5">

                          <div>

                            <p className="font-semibold text-gray-900">
                              {stock.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              NSE
                            </p>

                          </div>

                        </td>

                        <td className="px-6 py-5 font-medium text-gray-700">
                          {stock.symbol}
                        </td>

                        <td className="px-6 py-5 font-semibold text-gray-900">
                          ₹{Number(stock.price || 0).toFixed(2)}
                        </td>

                        <td
                          className={`px-6 py-5 font-semibold ${
                            positive
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {positive ? "+" : ""}
                          {Number(stock.change || 0).toFixed(2)}%
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {formatMarketCap(stock.marketCap)}
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {stock.volume
                            ? Number(stock.volume).toLocaleString()
                            : "—"}
                        </td>

                      </tr>

                    );

                  })}

                {!loading && paginatedStocks.length === 0 && (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-20 text-gray-500"
                    >
                      No stocks found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ================= PAGINATION ================= */}

        {totalPages > 1 && (

          <div className="mt-10">

            <StockPagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />

          </div>

        )}

      </div>

    </div>

  );

};

export default StockPage;