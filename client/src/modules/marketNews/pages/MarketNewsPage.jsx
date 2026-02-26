import { useState } from "react";
import useNews from "../hooks/useNews";
import NewsCard from "../components/NewsCard";
import InvestSphereLoader from "../../../shared/components/InvestSphereLoader";
import { Newspaper, TrendingUp, Landmark, BarChart3 } from "lucide-react";

const MarketNewsPage = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("market");

  const { news = [], totalPages, loading } = useNews(page, category);

  const categories = [
    { key: "market", label: "Market", icon: <Newspaper size={16} /> },
    { key: "ipo", label: "IPO", icon: <Landmark size={16} /> },
    { key: "sip", label: "SIP", icon: <TrendingUp size={16} /> },
    { key: "stock", label: "Stock", icon: <BarChart3 size={16} /> },
  ];

  // ✅ FIRST PAGE LOAD → FULL GIF LOADER
  if (loading && news.length === 0) {
    return <InvestSphereLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 md:px-12 py-12">

      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Market Insights & Financial News
        </h1>
        <p className="text-gray-500 mt-3">
          Stay updated with latest IPO, SIP, Stock & Market trends.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setCategory(cat.key);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm
              ${
                category === cat.key
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-white hover:bg-blue-50 hover:text-blue-600"
              }
            `}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 animate-pulse">
          Fetching latest financial news...
        </div>
      )}

      {/* News Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item, index) => (
          <NewsCard key={index} item={item} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-14">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-5 py-2 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-40 transition"
        >
          ⬅ Prev
        </button>

        <span className="text-gray-600 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-5 py-2 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-40 transition"
        >
          Next ➡
        </button>
      </div>

    </div>
  );
};

export default MarketNewsPage;