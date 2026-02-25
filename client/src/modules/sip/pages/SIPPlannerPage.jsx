import { useState } from "react";
import useSIP from "../hooks/useSIP";
import SIPCalculatorForm from "../components/SIPCalculatorForm";
import SIPResultCard from "../components/SIPResultCard";
import { getFundCategory } from "../utils/sipUtils";

const SIPPlannerPage = () => {
  const { sipData } = useSIP();

  const [result, setResult] = useState(null);
  const [recommendedFunds, setRecommendedFunds] = useState([]);

  const handleCalculate = (formData) => {
    const { monthlyInvestment, years, expectedReturn, risk } = formData;

    const r = expectedReturn / 12 / 100;
    const n = years * 12;

    const futureValue =
      monthlyInvestment *
      (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

    const totalInvested = monthlyInvestment * n;
    const totalReturns = futureValue - totalInvested;

    setResult({
      futureValue,
      totalInvested,
      totalReturns,
    });

    const riskCategory =
      risk === "Low"
        ? "Debt"
        : risk === "Medium"
        ? "Hybrid"
        : "Equity";

    const matchedFunds = sipData
      .filter(
        (fund) =>
          getFundCategory(fund.schemeName) === riskCategory
      )
      .slice(0, 6);

    setRecommendedFunds(matchedFunds);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-800">
            Smart SIP Planner
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Calculate your SIP growth and discover suitable funds based on your risk profile.
          </p>
        </div>

        {/* Calculator */}
        <div className="mb-14">
          <SIPCalculatorForm onCalculate={handleCalculate} />
        </div>

        {/* Result */}
        {result && (
          <SIPResultCard
            result={result}
            recommendedFunds={recommendedFunds}
          />
        )}

      </div>
    </div>
  );
};

export default SIPPlannerPage;