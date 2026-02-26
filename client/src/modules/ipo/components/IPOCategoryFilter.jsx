import React from "react";

const IPOCategoryFilter = ({ category, setCategory }) => {
  const categories = ["All", "NASDAQ", "NYSE"];

  return (
    <div className="flex gap-3 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition
            ${
              category === cat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default IPOCategoryFilter;