import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import useIPO from "../hooks/useIPO";
import IPOList from "../components/IPOList";
import IPOSearchBar from "../components/IPOSearchBar";
import IPOCategoryFilter from "../components/IPOCategoryFilter";
import IPOInvestmentGuide from "../components/IPOInvestmentGuide";

const IPOPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("upcoming");
  const { ipos = [], loading, error } = useIPO(activeTab);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredIPOs = useMemo(() => {
    return ipos.filter((ipo) => {
      const matchesSearch =
        ipo.name?.toLowerCase().includes(search.toLowerCase()) ||
        ipo.symbol?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        ipo.exchange?.toLowerCase().includes(category.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [ipos, search, category]);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">

      {/* Application Process Button */}
<div className="mb-10">
  <button
    onClick={() => navigate("/ipo/application-process")}
    className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-md transition duration-300"
  >
    <span className="text-lg">📊</span>
    <span className="text-lg font-semibold">
      IPO Application Process Instructions
    </span>
  </button>

  <p className="text-gray-500 text-sm mt-3">
    Learn step-by-step how to apply for an IPO through your broker app.
  </p>
</div>


      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b pb-3">
        {["upcoming", "ongoing", "closed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 transition ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab} IPOs
          </button>
        ))}
      </div>

      

      {/* Search + Category */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <IPOSearchBar search={search} setSearch={setSearch} />
        </div>

        <div className="w-full md:w-auto">
          <IPOCategoryFilter category={category} setCategory={setCategory} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 mb-4">
          Error loading IPOs
        </p>
      )}

      {/* IPO Cards */}
      <IPOList ipos={filteredIPOs} loading={loading} />

      {/* Investment Guide */}
      <div className="mt-16">
        <IPOInvestmentGuide />
      </div>


    </div>
  );
};

export default IPOPage;
