import { useState } from "react";
import InvestSphereLoader from "../../../shared/components/InvestSphereLoader";

const SIPCalculatorForm = ({ onCalculate }) => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [risk, setRisk] = useState("Medium");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // 👈 Loader start

    await new Promise((resolve) => setTimeout(resolve, 1200)); 
    // 👆 fake delay (agar API call ho to yeh remove kar dena)

    onCalculate({
      monthlyInvestment: Number(monthlyInvestment),
      years: Number(years),
      expectedReturn: Number(expectedReturn),
      risk,
    });

    setLoading(false); // 👈 Loader stop
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
      
      {/* 👇 Loader Overlay */}
      {loading && <InvestSphereLoader />}

      <h2 className="text-2xl font-bold text-slate-800 mb-8">
        SIP Investment Calculator
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        <div className="grid md:grid-cols-2 gap-8">

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Monthly Investment (₹)
            </label>
            <input
              type="number"
              min="100"
              step="100"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Investment Duration (Years)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              min="1"
              max="25"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Risk Preference
            </label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-md transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Calculating..." : "Calculate Investment Growth"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SIPCalculatorForm;