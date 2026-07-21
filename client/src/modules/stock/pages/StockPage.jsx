import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../../config/api";

import StockHeroSection from "../components/StockHeroSection";
import StockSearchFilters from "../components/StockSearchFilters";
import StockPagination from "../components/StockPagination";
import useStock from "../hooks/useStock";

const StockPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [user, setUser] = useState(null);
  const [watchLoading, setWatchLoading] = useState(null);

  const [watchlist, setWatchlist] = useState([]);

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
  });

  const { stocks, loading } = useStock();

  const itemsPerPage = 15;

  /* ================= USER CHECK ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("investsphere_user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchWatchlist(parsed.email);
    }
  }, []);

  /* ================= FETCH WATCHLIST ================= */

  const fetchWatchlist = async (email) => {
    try {
      const res = await axios.get(`${API}/api/watchlist/${email}`);

      if (res.data.success) {
        const symbols = res.data.data.map((item) => item.itemCode);
        setWatchlist(symbols);
      }
    } catch (error) {
      console.log("Watchlist load error");
    }
  };

  /* ================= POPUP ================= */

  const showPopup = (title, message) => {
    setPopup({
      show: true,
      title,
      message,
    });
  };

  const closePopup = () => {
    setPopup({
      show: false,
      title: "",
      message: "",
    });
  };

  /* ================= RESET PAGE ================= */

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  /* ================= FILTER LOGIC ================= */

  const filteredStocks = useMemo(() => {
    let data = [...stocks];

    if (search) {
      data = data.filter(
        (stock) =>
          stock.symbol?.toLowerCase().includes(search.toLowerCase()) ||
          stock.name?.toLowerCase().includes(search.toLowerCase()),
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
      data = [...data].sort((a, b) => (b.volume || 0) - (a.volume || 0));
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

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);

  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredStocks.slice(start, start + itemsPerPage);
  }, [filteredStocks, page]);

  /* ================= NAVIGATE TO DETAILS ================= */

  const handleStockClick = (symbol) => {
    if (!user || !user.email) {
      showPopup(
        "Login Required",
        "Please login to view detailed stock information.",
      );
      return;
    }

    navigate(`/stock/${symbol}`);
  };

  /* ================= ADD WATCHLIST ================= */

  const handleWatchlist = async (stock) => {
    if (!user || !user.email) {
      showPopup(
        "Login Required",
        "Please login first to add this stock to your watchlist.",
      );
      return;
    }

    if (watchlist.includes(stock.symbol)) {
      showPopup(
        "Already Added",
        `${stock.symbol} is already in your watchlist.`,
      );
      return;
    }

    try {
      setWatchLoading(stock.symbol);

      const response = await axios.post(`${API}/api/watchlist/add`, {
        email: user.email,
        itemCode: stock.symbol,
        itemName: stock.name,
        type: "stock",
      });

      if (response.data.success) {
        setWatchlist((prev) => [...prev, stock.symbol]);

        showPopup(
          "Success",
          `${stock.symbol} has been added to your watchlist.`,
        );
      }
    } catch (error) {
      showPopup(
        "Error",
        error.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setWatchLoading(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <StockHeroSection />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <StockSearchFilters
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />

        {/* ================= MARKET INSIGHTS ================= */}

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow border p-6 hover:shadow-lg transition">
            <h2 className="font-semibold text-lg mb-4">Top Gainers</h2>

            <div className="space-y-3">
              {topGainers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex justify-between text-sm"
                >
                  <span className="font-medium">{stock.symbol}</span>

                  <span className="text-green-600 font-semibold">
                    +{Number(stock.change || 0).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border p-6 hover:shadow-lg transition">
            <h2 className="font-semibold text-lg mb-4">Top Losers</h2>

            <div className="space-y-3">
              {topLosers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex justify-between text-sm"
                >
                  <span className="font-medium">{stock.symbol}</span>

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
              <thead className="bg-gray-100 text-gray-600 text-sm sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-semibold">Company</th>
                  <th className="px-6 py-4 font-semibold">Symbol</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Change</th>
                  <th className="px-6 py-4 font-semibold">Watchlist</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" className="text-center py-20 animate-pulse">
                      Loading market data...
                    </td>
                  </tr>
                )}

                {!loading &&
                  paginatedStocks.map((stock) => {
                    const positive = (stock.change || 0) >= 0;
                    const added = watchlist.includes(stock.symbol);

                    return (
                      <tr
                        key={stock.symbol}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td
                          onClick={() => handleStockClick(stock.symbol)}
                          className="px-6 py-5 cursor-pointer"
                        >
                          <p className="font-semibold">{stock.name}</p>
                          <p className="text-xs text-gray-400">NSE</p>
                        </td>

                        <td
                          onClick={() => handleStockClick(stock.symbol)}
                          className="px-6 py-5 cursor-pointer"
                        >
                          {stock.symbol}
                        </td>

                        <td
                          onClick={() => handleStockClick(stock.symbol)}
                          className="px-6 py-5 font-semibold cursor-pointer"
                        >
                          ₹{Number(stock.price || 0).toFixed(2)}
                        </td>

                        <td
                          onClick={() => handleStockClick(stock.symbol)}
                          className={`px-6 py-5 font-semibold cursor-pointer ${
                            positive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {positive ? "+" : ""}
                          {Number(stock.change || 0).toFixed(2)}%
                        </td>

                        <td className="px-6 py-5">
                          {added ? (
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                              Already Added
                            </button>
                          ) : (
                            <button
                              onClick={() => handleWatchlist(stock)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition hover:scale-105"
                            >
                              {watchLoading === stock.symbol
                                ? "Adding..."
                                : "Add to Watchlist"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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

      {/* ================= PROFESSIONAL MODAL ================= */}

      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">
                !
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                {popup.title}
              </h3>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {popup.message}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closePopup}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-medium transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;
