import { useState } from "react";
import axios from "axios";
import API from "../../../config/api";
const StockInvest = ({ stock, onClose }) => {

  /* ================= BASIC DATA ================= */

  const marketPrice = Number(stock.price || 0);

  /* ================= STATE ================= */

  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("market"); // market / limit
  const [price, setPrice] = useState(marketPrice);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= CALCULATIONS ================= */

  const total = quantity * (orderType === "market" ? marketPrice : price);

  /* ================= VALIDATION ================= */

  const validate = () => {
    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return false;
    }

    if (orderType === "limit" && price <= 0) {
      setError("Enter valid price");
      return false;
    }

    setError("");
    return true;
  };

  /* ================= SUBMIT ================= */

  const handleBuy = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("investsphere_user"));

      const payload = {
        userEmail: user?.email,
        username: user?.name,

        symbol: stock.symbol,
        companyName: stock.name,

        quantity: Number(quantity),
        orderType,

        price: orderType === "market" ? marketPrice : Number(price),

        totalAmount: Number(total),

        status: "completed", // future: pending/executed
        type: "buy",
      };

      console.log("Stock Order 👉", payload);

      const res = await axios.post(
        `${API}/api/stock-investments/add`,
        payload
      );

      console.log("Saved 👉", res.data);

      alert("Stock Purchased Successfully ✅");
      onClose();

    } catch (err) {
      console.error(err);
      setError("Failed to place order ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-4">
          Buy {stock.name}
        </h2>

        {/* STOCK INFO (DISABLED) */}
        <div className="bg-gray-100 p-3 rounded mb-4 text-sm">
          <p><b>Symbol:</b> {stock.symbol}</p>
          <p><b>Market Price:</b> ₹{marketPrice}</p>
        </div>

        {/* ORDER TYPE */}
        <div className="flex gap-2 mb-4">
          {["market", "limit"].map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex-1 py-2 rounded ${
                orderType === type
                  ? "bg-purple-600 text-white"
                  : "border"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* QUANTITY */}
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border p-3 rounded mb-3"
          placeholder="Quantity"
        />

        {/* PRICE (ONLY LIMIT) */}
        {orderType === "limit" && (
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border p-3 rounded mb-3"
            placeholder="Limit Price"
          />
        )}

        {/* TOTAL */}
        <div className="bg-gray-100 p-3 rounded mb-3">
          <p>Total: ₹{total.toFixed(2)}</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-600 text-sm mb-3">
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleBuy}
            className="bg-purple-600 text-white px-5 py-2 rounded"
          >
            {loading ? "Processing..." : "Buy"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StockInvest;