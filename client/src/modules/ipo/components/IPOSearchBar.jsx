import React from "react";
import { Search, X } from "lucide-react";

const IPOSearchBar = ({ search, setSearch }) => {
  return (
    <div className="relative w-full">

      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Search IPO by company name or symbol..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 
                   bg-white shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 transition duration-200"
      />

      {/* Clear Button */}
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      )}

    </div>
  );
};

export default IPOSearchBar;
