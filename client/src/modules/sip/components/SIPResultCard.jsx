import SIPCard from "./SIPCard";

const SIPResultCard = ({ result, recommendedFunds }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">

      {/* Section Title */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800">
          Investment Summary
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-14">

        <div className="bg-slate-50 rounded-2xl p-6 text-center border">
          <p className="text-sm text-slate-500 mb-2">Total Invested</p>
          <p className="text-2xl font-bold text-slate-800">
            ₹{result.totalInvested.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
          <p className="text-sm text-slate-500 mb-2">Estimated Returns</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{result.totalReturns.toLocaleString()}
          </p>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100">
          <p className="text-sm text-slate-500 mb-2">Future Value</p>
          <p className="text-2xl font-bold text-indigo-600">
            ₹{result.futureValue.toLocaleString()}
          </p>
        </div>

      </div>

      {/* Recommended Funds */}
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-6">
          Recommended SIP Funds
        </h3>

        {recommendedFunds.length === 0 ? (
          <div className="bg-slate-50 border rounded-2xl p-8 text-center text-slate-500">
            No funds matched your selected risk profile.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedFunds.map((fund) => (
              <SIPCard key={fund.schemeCode} fund={fund} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SIPResultCard;