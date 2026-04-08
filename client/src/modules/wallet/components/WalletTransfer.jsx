import React, { useState } from "react";

const WalletTransfer = ({ onTransfer }) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!email) {
      setErrorPopup("Please enter recipient email");
      return false;
    }

    if (!amount || amount < 500 || amount > 500000) {
      setErrorPopup("Amount must be between ₹500 - ₹5,00,000");
      return false;
    }

    return true;
  };

  /* ================= OPEN CONFIRM ================= */
  const handleTransferClick = () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  /* ================= CONFIRM TRANSFER ================= */
  const confirmTransfer = async () => {
    setLoading(true);

    try {
      await onTransfer(email, Number(amount));

      setShowConfirm(false);
      setEmail("");
      setAmount("");
    } catch (err) {
      setShowConfirm(false);
      setErrorPopup(
        err?.response?.data?.message ||
          "Transfer failed. User may not exist"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow border space-y-3">
        <h2 className="font-semibold">Transfer Money</h2>

        <input
          type="email"
          placeholder="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

        <button
          onClick={handleTransferClick}
          className="bg-blue-600 text-white py-2 rounded-lg w-full"
        >
          Transfer
        </button>
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Confirm Transfer</h2>

            <p>Email: {email}</p>
            <p>Amount: ₹{amount}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full border py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={confirmTransfer}
                className="w-full bg-blue-600 text-white py-2 rounded-xl"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ERROR POPUP ================= */}
      {errorPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-sm text-center space-y-4">
            <p className="text-red-600 font-medium">{errorPopup}</p>

            <button
              onClick={() => setErrorPopup("")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletTransfer;