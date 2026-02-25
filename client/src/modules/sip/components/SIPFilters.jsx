const SIPFilters = ({ category, setCategory, risk, setRisk }) => {
  const categories = ["All", "Equity", "Debt", "Hybrid"];
  const risks = ["All", "Low", "Medium", "High"];

  return (
    <div className="flex flex-col gap-6">

      {/* CATEGORY SECTION */}
      <div>
        <div className="flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  category === item
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* RISK SECTION */}
      <div>
        <div className="flex flex-wrap gap-3">
          {risks.map((item) => (
            <button
              key={item}
              onClick={() => setRisk(item)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  risk === item
                    ? item === "Low"
                      ? "bg-green-500 text-white shadow-md"
                      : item === "Medium"
                      ? "bg-yellow-500 text-white shadow-md"
                      : item === "High"
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-indigo-600 text-white shadow-md"
                    : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SIPFilters;