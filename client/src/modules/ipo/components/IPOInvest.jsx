import { useState, useMemo } from "react";
import axios from "axios";

const IPOInvest = ({ ipo, user, onClose }) => {
  const [lots, setLots] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ======================================================
     🔥 PRICE PARSER (VERY IMPORTANT FIX)
  ====================================================== */

  const parsedPrice = useMemo(() => {
    if (!ipo.price) return 0;

    // Remove ₹ and spaces
    const clean = ipo.price.replace(/₹/g, "").trim();

    // Handle range "125 - 135"
    if (clean.includes("-")) {
      const parts = clean.split("-").map(p => Number(p.trim()));
      return parts[1] || parts[0]; // use upper price
    }

    return Number(clean);
  }, [ipo.price]);

  /* ======================================================
     CALCULATIONS
  ====================================================== */

  const lotSize = ipo.lotSize || 10;
  const totalShares = lots * lotSize;
  const totalAmount = totalShares * parsedPrice;

  /* ======================================================
     SUBMIT
  ====================================================== */

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!parsedPrice || parsedPrice <= 0) {
        setError("Invalid IPO price");
        return;
      }

      const payload = {
        userEmail: user.email,
        username: user.name || "User",

        ipoCode: ipo.symbol,
        companyName: ipo.name,

        lotSize,
        lots,
        totalShares,

        price: parsedPrice, // ✅ FIXED
        totalAmount,

        status: "applied",
      };

      const res = await axios.post(
        "http://localhost:5000/api/ipo-investments/add",
        payload
      );

      if (res.data.success) {
        alert("IPO Applied Successfully 🚀");
        onClose();
      }

    } catch (err) {
      console.error("IPO Apply Error:", err);
      setError(
        err.response?.data?.message || "Failed to apply IPO"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">

        {/* HEADER */}
        <h2 className="text-xl font-bold mb-2">
          Apply IPO: {ipo.name}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          {ipo.exchange} • {ipo.symbol}
        </p>

        {/* INFO */}
        <div className="space-y-2 text-sm mb-4">
          <p><b>Price:</b> ₹{parsedPrice}</p>
          <p><b>Lot Size:</b> {lotSize}</p>
        </div>

        {/* INPUT */}
        <div className="mb-4">
          <label className="text-sm font-medium">Lots</label>
          <input
            type="number"
            min={1}
            value={lots}
            onChange={(e) => setLots(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* SUMMARY */}
        <div className="bg-gray-100 p-3 rounded-lg mb-4 text-sm">
          <p><b>Total Shares:</b> {totalShares}</p>
          <p><b>Total Amount:</b> ₹{totalAmount}</p>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700"
          >
            {loading ? "Processing..." : "Apply IPO"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IPOInvest;