import { useState } from "react";

const SIPCalculatorForm = ({ onCalculate }) => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [risk, setRisk] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();

    onCalculate({
      monthlyInvestment: Number(monthlyInvestment),
      years: Number(years),
      expectedReturn: Number(expectedReturn),
      risk,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">

      <h2 className="text-2xl font-bold text-slate-800 mb-8">
        SIP Investment Calculator
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* GRID LAYOUT */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Monthly Investment */}
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

          {/* Investment Duration */}
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

          {/* Expected Return */}
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

          {/* Risk Preference */}
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

        {/* Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-md transition-all duration-300"
          >
            Calculate Investment Growth
          </button>
        </div>

      </form>
    </div>
  );
};

export default SIPCalculatorForm;