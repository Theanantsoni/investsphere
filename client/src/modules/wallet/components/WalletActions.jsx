import React, { useState } from "react";

const WalletActions = ({ onAdd, onWithdraw, loading }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");

  /* ================= VALIDATION ================= */
  const validateAmount = (value) => {
    if (!value || isNaN(value)) {
      setError("Please enter a valid amount");
      return false;
    }

    const num = Number(value);

    if (num < 500) {
      setError("Minimum amount is ₹500");
      return false;
    }

    if (num > 500000) {
      setError("Maximum amount is ₹5,00,000");
      return false;
    }

    setError("");
    return true;
  };

  /* ================= OPEN MODAL ================= */
  const openModal = (type) => {
    if (!validateAmount(amount)) return;
    setActionType(type);
    setShowModal(true);
  };

  /* ================= CONFIRM ================= */
  const handleConfirm = () => {
    const numAmount = Number(amount);
    setProcessing(true);

    setTimeout(() => {
      if (actionType === "add") {
        onAdd(numAmount);
      } else {
        onWithdraw(numAmount);
      }

      setProcessing(false);
      setShowModal(false);
      setAmount("");
    }, 800);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          placeholder="Enter amount (₹500 - ₹5,00,000)"
          className="border px-4 py-3 rounded-xl w-full"
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => openModal("add")}
            className="w-full py-3 bg-green-600 text-white rounded-xl"
          >
            Add Money
          </button>

          <button
            onClick={() => openModal("withdraw")}
            className="w-full py-3 bg-red-600 text-white rounded-xl"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              {actionType === "add" ? "Confirm Add" : "Confirm Withdraw"}
            </h2>

            <p className="text-center text-xl font-bold">₹{amount}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-full border rounded-xl py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className={`w-full text-white rounded-xl py-2 ${
                  actionType === "add"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletActions;