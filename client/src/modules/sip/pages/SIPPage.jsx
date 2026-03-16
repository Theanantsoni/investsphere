import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import useSIP from "../hooks/useSIP";

import SIPSearchBar from "../components/SIPSearchBar";
import SIPFilters from "../components/SIPFilters";
import SIPList from "../components/SIPList";
import SIPPagination from "../components/SIPPagination";
import SIPHeroSection from "../components/SIPHeroSection";
import SIPLoadingSkeleton from "../components/SIPLoadingSkeleton";
import SIPStatsBar from "../components/SIPStatsBar";

import InvestSphereLoader from "../../../shared/components/InvestSphereLoader";

import { getFundMinSip, getFundCategory, getFundRisk } from "../utils/sipUtils";

const SIPPage = () => {
  const { sipData, loading } = useSIP();

  const safeSipData = Array.isArray(sipData) ? sipData : [];

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState(["All"]);
  const [risk, setRisk] = useState(["All"]);

  const [currentPage, setCurrentPage] = useState(1);

  const [minSip, setMinSip] = useState("500");

  const [initialLoad, setInitialLoad] = useState(true);

  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  const itemsPerPage = 9;

  /* ================= LOAD USER ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("investsphere_user");

    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetchWatchlist(parsedUser.email);
  }, []);

  /* ================= FETCH WATCHLIST ================= */

  const fetchWatchlist = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/watchlist/${email}`,
      );

      if (res.data.success) {
        const codes = res.data.data.map((item) => String(item.itemCode));

        setWatchlist(codes);
      }
    } catch (error) {
      console.log("Watchlist fetch error");
    }
  };

  /* FIRST LOAD DETECT */

  useEffect(() => {
    if (!loading && sipData.length > 0) {
      setInitialLoad(false);
    }
  }, [loading, sipData]);

  /* RESET PAGE */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, risk, minSip]);

  /* FILTER LOGIC */

  const filteredFunds = useMemo(() => {
    const funds = Array.isArray(sipData) ? sipData : [];

    return funds
      .filter((fund) =>
        fund.schemeName?.toLowerCase().includes(search.toLowerCase()),
      )

      .filter((fund) => {
        const fundCategory = getFundCategory(fund.schemeName || "");

        if (category.includes("All")) return true;

        return category.includes(fundCategory);
      })

      .filter((fund) => {
        const fundRisk = getFundRisk(fund.schemeName || "");

        if (risk.includes("All")) return true;

        return risk.includes(fundRisk);
      })

      .filter((fund) => {
        const fundMinSip = getFundMinSip(fund.schemeCode || 0);

        return Number(minSip || 0) >= fundMinSip;
      });
  }, [sipData, search, category, risk, minSip]);

  const totalPages = Math.ceil(filteredFunds.length / itemsPerPage);

  const paginatedFunds = filteredFunds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (initialLoad && loading && sipData.length === 0) {
    return <InvestSphereLoader />;
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          SIP Investment Funds
        </h1>

        <Link
          to="/sip/planner"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
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

      {/* FILTER AREA */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 bg-white p-6 rounded-2xl shadow-md border border-slate-200 my-6">
        {/* SEARCH */}

        <div className="w-full md:max-w-md">
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            Search SIP Fund
          </label>

          <SIPSearchBar search={search} setSearch={setSearch} />
        </div>

        {/* FILTERS */}

        <SIPFilters
          category={category}
          setCategory={setCategory}
          risk={risk}
          setRisk={setRisk}
        />
      </div>

      {/* CONTENT */}

      {loading ? (
        <SIPLoadingSkeleton />
      ) : paginatedFunds.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              No SIP Funds Found
            </h3>

            <button
              onClick={() => {
                setSearch("");
                setCategory(["All"]);
                setRisk(["All"]);
                setMinSip("500");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <SIPList
          funds={paginatedFunds}
          watchlist={watchlist}
          setWatchlist={setWatchlist}
          user={user}
        />
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
