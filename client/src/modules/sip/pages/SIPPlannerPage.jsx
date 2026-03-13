import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

import useSIP from "../hooks/useSIP";
import SIPCalculatorForm from "../components/SIPCalculatorForm";
import SIPResultCard from "../components/SIPResultCard";

import { getFundCategory } from "../utils/sipUtils";

import InvestSphereLoader from "../../../shared/components/InvestSphereLoader";

const SIPPlannerPage = () => {
  const { sipData, loading } = useSIP();

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("investsphere_user")) || null;

  const [result, setResult] = useState(null);
  const [recommendedFunds, setRecommendedFunds] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  /* ================= LOAD WATCHLIST ================= */

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        if (!user?.email) return;

        const res = await axios.get(
          `http://localhost:5000/api/watchlist/${user.email}`
        );

        if (res.data.success) {
          const sipCodes = res.data.data
            .filter((item) => item.type === "sip")
            .map((item) => String(item.itemCode));

          setWatchlist(sipCodes);
        }
      } catch (error) {
        console.error("Watchlist load error:", error);
      }
    };

    loadWatchlist();
  }, [user]);

  /* ================= CALCULATE ================= */

  const handleCalculate = (formData) => {
    const { monthlyInvestment, years, expectedReturn, risk } = formData;

    const r = expectedReturn / 12 / 100;
    const n = years * 12;

    const futureValue =
      monthlyInvestment * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

    const totalInvested = monthlyInvestment * n;
    const totalReturns = futureValue - totalInvested;

    setResult({
      futureValue,
      totalInvested,
      totalReturns,
    });

    const riskCategory =
      risk === "Low" ? "Debt" : risk === "Medium" ? "Hybrid" : "Equity";

    const matchedFunds = sipData
      .filter((fund) => getFundCategory(fund.schemeName) === riskCategory)
      .slice(0, 6);

    setRecommendedFunds(matchedFunds);
  };

  if (loading) {
    return <InvestSphereLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16">

      {/* ================= BACK BUTTON ================= */}

      <div className="max-w-6xl mx-auto px-6 mb-6">
        <button
          onClick={() => navigate("/sip")}
          className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
        >
          <ArrowLeft size={20} />
          Back to SIP 
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-800">
            Smart SIP Planner
          </h1>

          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Calculate your SIP growth and discover suitable funds based on your
            risk profile.
          </p>
        </div>

        {/* CALCULATOR */}

        <div className="mb-14">
          <SIPCalculatorForm onCalculate={handleCalculate} />
        </div>

        {/* RESULT */}

        {result && (
          <SIPResultCard
            result={result}
            recommendedFunds={recommendedFunds}
            user={user}
            watchlist={watchlist}
            setWatchlist={setWatchlist}
          />
        )}
      </div>
    </div>
  );
};

export default SIPPlannerPage;