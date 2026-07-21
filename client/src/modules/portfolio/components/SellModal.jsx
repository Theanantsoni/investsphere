import React, { useState, useEffect } from "react";
import { X } from "lucide-react";


/* ====================================================== */
const SellModal = ({ asset, user, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("market");
  const [price, setPrice] = useState(asset?.avgPrice || 1);
  const [loading, setLoading] = useState(false);

  /* ================= NORMALIZE TYPE ================= */
  const normalizedType =
    asset?.assetType === "stocks"
      ? "stock"
      : asset?.assetType === "ipo"
      ? "ipo"
      : asset?.assetType;

  /* ================= MARKET PRICE ================= */
  useEffect(() => {
    if (orderType === "market") {
      const marketPrice =
        asset?.current > 0 && asset?.quantity > 0
          ? asset.current / asset.quantity
          : asset?.avgPrice || asset?.price || 1;

      setPrice(Number(marketPrice.toFixed(2)) || 1);
    }
  }, [orderType, asset]);

  /* ================= SAFE TOTAL ================= */
  const safeQty = Number(quantity) || 0;
  const safePrice = Number(price) || 0;
  const totalAmount = safePrice * safeQty;

  /* ================= VALIDATION ================= */
  const isValid =
    safeQty > 0 &&
    safeQty <= (asset?.quantity || 0) &&
    safePrice > 0;

  /* ====================================================== */
  const handleSell = async () => {
    try {
      if (!isValid) {
        alert("❌ Invalid input");
        return;
      }

      const confirmSell = window.confirm(
        `Sell ${safeQty} units of ${asset.assetName}?`
      );
      if (!confirmSell) return;

      setLoading(true);

      const payload = {
        assetId: asset._id,
        type: normalizedType, // 🔥 FIXED
        assetCode: asset.assetCode,
        quantity: safeQty,
        price: safePrice,
        orderType,
        userEmail: user?.email,
      };

      console.log("📦 SELL PAYLOAD:", payload);

      const res = await fetch(
        `${API}/orders/sell`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Backend Error:", data);
        throw new Error(data.message || "Sell failed");
      }

      alert("✅ Sell order executed successfully");

      if (onSuccess) await onSuccess();

      onClose();
    } catch (error) {
      console.error("❌ Sell Error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ====================================================== */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative animate-fadeIn">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Sell {asset?.assetName || asset?.name}
        </h2>

        {/* INFO BOX */}
        <div className="bg-gray-50 p-4 rounded-xl mb-5 text-sm border">
          <p className="text-gray-600">
            Available Qty:{" "}
            <b className="text-gray-900">{asset?.quantity || 0}</b>
          </p>
          <p className="text-gray-600 mt-1">
            Avg Price: ₹
            {Number(asset?.avgPrice || 0).toFixed(2)}
          </p>
        </div>

        {/* ORDER TYPE */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700">
            Order Type
          </label>
          <div className="flex gap-2 mt-2">
            {["market", "limit"].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  orderType === type
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* QUANTITY */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            max={asset?.quantity || 1}
            value={quantity}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val > asset.quantity) val = asset.quantity;
              if (val < 1) val = 1;
              setQuantity(val);
            }}
            className="w-full mt-1 px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* PRICE */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            disabled={orderType === "market"}
            value={price}
            onChange={(e) =>
              setPrice(Number(e.target.value) || 1)
            }
            className="w-full mt-1 px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
          />
        </div>

        {/* TOTAL */}
        <div className="mb-5 text-sm text-gray-700 flex justify-between">
          <span>Total Amount</span>
          <b>₹{totalAmount.toFixed(2)}</b>
        </div>

        {/* ACTION */}
        <button
          onClick={handleSell}
          disabled={!isValid || loading}
          className={`w-full py-3 rounded-xl text-white font-medium transition-all ${
            !isValid || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95"
          }`}
        >
          {loading ? "Processing..." : "Confirm Sell"}
        </button>
      </div>
    </div>
  );
};

export default SellModal;