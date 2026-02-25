import React from "react";

const StatCard = ({ children }) => (
  <div className="bg-white shadow-md rounded-2xl p-6 border border-slate-200">
    {children}
  </div>
);

const SIPStatsBar = ({ totalFunds, minSip, setMinSip }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">

      {/* Total Funds */}
      <StatCard>
        <p className="text-slate-500 text-sm">Total SIP Funds</p>
        <h2 className="text-2xl font-bold text-slate-800">{totalFunds}</h2>
      </StatCard>

      {/* Starting SIP Input */}
      <StatCard>
        <p className="text-slate-500 text-sm mb-2">Starting SIP</p>
        <input
          type="text"
          value={minSip}
          onChange={(e) => {
  const value = e.target.value.replace(/^0+(?=\d)/, "");
  setMinSip(value);
}}
          className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="Enter amount"
        />
      </StatCard>

      {/* Categories */}
      <StatCard>
        <p className="text-slate-500 text-sm">Categories</p>
        <h2 className="text-xl font-semibold text-slate-800">
          Equity / Debt / Hybrid
        </h2>
      </StatCard>

    </div>
  );
};

export default SIPStatsBar;

