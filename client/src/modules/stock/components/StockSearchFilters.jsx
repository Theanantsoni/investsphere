import React from "react";
import { Search } from "lucide-react";

const StockSearchFilters = ({
  search,
  setSearch,
  filter,
  setFilter
}) => {

  const filters = [
    "All",
    "Top Gainers",
    "Top Losers",
    "Most Active",
    "52W High",
    "52W Low"
  ];

  return (

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

      {/* SEARCH */}

      <div className="relative w-full md:w-96">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search stock..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

      </div>

      {/* FILTER BUTTONS */}

      <div className="flex flex-wrap gap-3">

        {filters.map((item) => (

          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              filter === item
                ? "bg-indigo-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {item}
          </button>

        ))}

      </div>

    </div>

  );

};

export default StockSearchFilters;