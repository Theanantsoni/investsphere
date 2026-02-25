import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import useSIP from "../hooks/useSIP";
import SIPSearchBar from "../components/SIPSearchBar";
import SIPFilters from "../components/SIPFilters";
import SIPList from "../components/SIPList";
import SIPPagination from "../components/SIPPagination";
import SIPHeroSection from "../components/SIPHeroSection";
import SIPLoadingSkeleton from "../components/SIPLoadingSkeleton";
import SIPStatsBar from "../components/SIPStatsBar";

import {
  getFundMinSip,
  getFundCategory,
  getFundRisk,
} from "../utils/sipUtils";

const SIPPage = () => {
  const { sipData, loading } = useSIP();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [risk, setRisk] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [minSip, setMinSip] = useState("500");

  const itemsPerPage = 9;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, risk, minSip]);

  // 🔥 FIXED + OPTIMIZED FILTER LOGIC
  const filteredFunds = useMemo(() => {
    return sipData
      // Search Filter
      .filter((fund) =>
        fund.schemeName
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )

      // Category Filter
      .filter((fund) => {
        const fundCategory = getFundCategory(
          fund.schemeName || ""
        );
        return category === "All"
          ? true
          : fundCategory === category;
      })

      // Risk Filter
      .filter((fund) => {
        const fundRisk = getFundRisk(
          fund.schemeName || ""
        );
        return risk === "All"
          ? true
          : fundRisk === risk;
      })

      // ✅ CORRECT MIN SIP LOGIC
      .filter((fund) => {
        const fundMinSip = getFundMinSip(
          fund.schemeCode || 0
        );

        // User SIP must be >= fund's required SIP
        return Number(minSip || 0) >= fundMinSip;
      });

  }, [sipData, search, category, risk, minSip]);

  const totalPages = Math.ceil(
    filteredFunds.length / itemsPerPage
  );

  const paginatedFunds = filteredFunds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          SIP Investment Funds
        </h1>

        <Link
          to="/sip/planner"
          className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
        >
          🚀 Open Smart SIP Planner
        </Link>
      </div>

      <SIPHeroSection />

      <SIPStatsBar
        totalFunds={filteredFunds.length}
        minSip={minSip}
        setMinSip={setMinSip}
      />

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-2xl shadow-md border border-slate-200 my-6">
        <SIPSearchBar search={search} setSearch={setSearch} />
        <SIPFilters
          category={category}
          setCategory={setCategory}
          risk={risk}
          setRisk={setRisk}
        />
      </div>

      {/* Content */}
      {loading ? (
        <SIPLoadingSkeleton />
      ) : paginatedFunds.length === 0 ? (
        <div className="flex justify-center items-center py-16">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-10 max-w-xl w-full text-center">

            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-100">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2a4 4 0 014-4h4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              No SIP Funds Found
            </h3>

            <p className="text-slate-500 mb-6">
              We couldn't find any SIP funds matching your selected filters.
              Try adjusting your category, risk level, or minimum SIP amount.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setRisk("All");
                setMinSip("500");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300"
            >
              Reset Filters
            </button>

          </div>
        </div>
      ) : (
        <SIPList funds={paginatedFunds} />
      )}

      {totalPages > 1 && (
        <SIPPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

    </div>
  );
};

export default SIPPage;