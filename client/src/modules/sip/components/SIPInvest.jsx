import { useState } from "react";
import axios from "axios";
import {
  getFundMinSip,
  getFundCategory,
  getFundRisk,
} from "../utils/sipUtils";

const SIPInvest = ({ fund, user, onClose }) => {
  /* ================= BASIC DATA ================= */

  const schemeCode = fund?.schemeCode ?? fund?.scheme_code;
  const schemeName = fund?.schemeName ?? fund?.scheme_name;

  const fundMinSip = getFundMinSip(schemeCode);
  const fundCategory = getFundCategory(schemeName);
  const fundRisk = getFundRisk(schemeName);

  /* ================= STATE ================= */

  const [amount, setAmount] = useState(fundMinSip);
  const [years, setYears] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= CALCULATIONS ================= */

  const calculateReturns = () => {
    const months = years * 12;
    const rate = 12 / 100 / 12;

    const futureValue =
      amount *
      ((Math.pow(1 + rate, months) - 1) / rate) *
      (1 + rate);

    const invested = amount * months;

    return {
      invested,
      returns: futureValue,
      profit: futureValue - invested,
      months,
    };
  };

  const { invested, returns, profit, months } = calculateReturns();

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    if (!user?.email) {
      setError("User not logged in");
      return false;
    }

    if (!amount || amount < fundMinSip) {
      setError(`Minimum SIP amount is ₹${fundMinSip}`);
      return false;
    }

    if (amount % fundMinSip !== 0) {
      setError(`Amount must be multiple of ₹${fundMinSip}`);
      return false;
    }

    if (!years) {
      setError("Select duration");
      return false;
    }

    setError("");
    return true;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        userEmail: user.email,
        username: user.name,
        assetCode: String(schemeCode),
        assetName: schemeName,
        type: "sip",
        amount: Number(amount),
        duration: Number(years),

        /* 🔥 FIX: REQUIRED FIELD */
        installments: Number(months),

        /* 🔥 OPTIONAL SAFE SYNC */
        quantity: Number(months),

        totalInvested: Number(invested.toFixed(0)),
        expectedReturn: Number(returns.toFixed(0)),
        expectedProfit: Number(profit.toFixed(0)),
        category: fundCategory,
        risk: fundRisk,
      };

      console.log("Sending 👉", payload);

      const res = await axios.post(
        "http://localhost:5000/api/sip-investments/add",
        payload
      );

      console.log("Saved 👉", res.data);

      alert("Investment Saved Successfully ✅");
      onClose();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      setError(
        err?.response?.data?.message || "Error saving investment ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[fadeIn_.25s_ease]">

        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Invest in {schemeName}
        </h2>

        {/* CATEGORY + RISK */}
        <div className="mb-4 text-sm space-y-1">
          <p>
            <span className="text-slate-500">Category:</span>{" "}
            <b>{fundCategory}</b>
          </p>
          <p>
            <span className="text-slate-500">Risk:</span>{" "}
            <span
              className={`px-2 py-1 text-xs rounded ${
                fundRisk === "Low"
                  ? "bg-green-100 text-green-700"
                  : fundRisk === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {fundRisk}
            </span>
          </p>
        </div>

        {/* AMOUNT INPUT */}
        <input
          type="number"
          min={fundMinSip}
          step={fundMinSip}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none p-3 rounded-xl mb-2"
        />

        <p className="text-xs text-slate-400 mb-3">
          Min ₹{fundMinSip} • multiples only
        </p>

        {/* YEARS SELECT */}
        <div className="flex gap-2 mb-4">
          {[1, 3, 5].map((y) => (
            <button
              key={y}
              onClick={() => setYears(y)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                years === y
                  ? "bg-purple-600 text-white"
                  : "border border-slate-300 hover:bg-slate-50"
              }`}
            >
              {y} Yr
            </button>
          ))}
        </div>

        {/* RESULT BOX */}
        <div className="bg-slate-100 p-4 rounded-xl mb-4 text-sm space-y-1">
          <p>
            Invested: <b>₹{invested.toFixed(0)}</b>
          </p>
          <p>
            Returns: <b>₹{returns.toFixed(0)}</b>
          </p>
          <p className="text-green-600 font-semibold">
            Profit: ₹{profit.toFixed(0)}
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl font-medium transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SIPInvest;