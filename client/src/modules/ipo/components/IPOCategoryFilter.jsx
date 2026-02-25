import React from "react";

const IPOCategoryFilter = ({ category, setCategory }) => {
  const categories = ["All", "NSE", "NASDAQ", "SME"];

  return (
    <div className="flex gap-3 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-4 py-1 rounded-full text-sm border 
            ${category === cat 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-700"}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default IPOCategoryFilter;
