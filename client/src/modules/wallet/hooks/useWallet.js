import { useEffect, useState } from "react";
import {
  getWallet,
  addMoney,
  withdrawMoney,
  transferMoney,
} from "../services/walletService";

export const useWallet = () => {
  const user = JSON.parse(localStorage.getItem("investsphere_user"));

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW POPUP ERROR STATE
  const [popupError, setPopupError] = useState("");

  /* ================= VALIDATION ================= */
  const validateAmount = (amount) => {
    if (!amount || isNaN(amount)) {
      setPopupError("Invalid amount");
      return false;
    }

    if (amount < 500) {
      setPopupError("Minimum amount is ₹500");
      return false;
    }

    if (amount > 500000) {
      setPopupError("Maximum amount is ₹5,00,000");
      return false;
    }

    return true;
  };

  /* ================= FETCH WALLET ================= */
  const fetchWallet = async () => {
    try {
      const data = await getWallet(user.email);
      setWallet(data);
    } catch (err) {
      setPopupError("Failed to load wallet");
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchWallet();
    }
  }, []);

  /* ================= ADD MONEY ================= */
  const handleAdd = async (amount) => {
    if (!validateAmount(amount)) return;

    setLoading(true);
    try {
      const data = await addMoney({
        email: user.email,
        amount,
      });

      setWallet(data);
    } catch (err) {
      setPopupError(err?.response?.data?.message || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= WITHDRAW MONEY ================= */
  const handleWithdraw = async (amount) => {
    if (!validateAmount(amount)) return;

    setLoading(true);
    try {
      const data = await withdrawMoney({
        email: user.email,
        amount,
      });

      setWallet(data);
    } catch (err) {
      setPopupError(err?.response?.data?.message || "Withdraw failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TRANSFER ================= */
  const handleTransfer = async (to, amount) => {
    if (!to) {
      setPopupError("Recipient email required");
      throw new Error("Invalid email");
    }

    if (!validateAmount(amount)) return;

    setLoading(true);
    try {
      const data = await transferMoney({
        from: user.email,
        to,
        amount,
      });

      setWallet(data);
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Receiver user not registered";

      setPopupError(msg);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    wallet,
    loading,
    popupError,
    setPopupError,
    handleAdd,
    handleWithdraw,
    handleTransfer,
  };
};