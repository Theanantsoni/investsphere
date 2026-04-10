import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { PORTFOLIO_API } from "../constants/portfolioConstants";

/* ====================================================== */
const PortfolioContext = createContext();

/* ====================================================== */
export const PortfolioProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [allocation, setAllocation] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= USER ================= */
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("investsphere_user"));
    } catch {
      return null;
    }
  }, []);

  /* ====================================================== */
  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      if (!user?.email) {
        setAssets([]);
        setSummary(null);
        setAllocation([]);
        setTransactions([]);
        return;
      }

      const [portfolioRes, walletRes] = await Promise.all([
        axios.get(`${PORTFOLIO_API.BASE}/portfolio?email=${user.email}`),
        axios.get(`${PORTFOLIO_API.BASE}/wallet?email=${user.email}`),
      ]);

      if (!portfolioRes.data?.success) {
        throw new Error("Portfolio API failed");
      }

      const { summary: apiSummary, data } = portfolioRes.data;

      /* ================= TRANSACTIONS ================= */
      const portfolioTx = data?.transactions || [];
      const walletTx = walletRes?.data?.wallet?.transactions || [];

      const mergedTransactions = [...portfolioTx, ...walletTx]
        .map((t) => ({
          ...t,
          assetType: t.assetType || "wallet",
          assetName: t.assetName || "Wallet",
          totalAmount: t.totalAmount || t.amount || 0,
          createdAt: t.createdAt || t.date || new Date(),
        }))
        .sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

      setTransactions(mergedTransactions);

      /* ================= NORMALIZER ================= */
      const normalize = (item) => {
        const type = item.assetType || item.type || "unknown";

        return {
          _id: item._id,
          assetCode: item.assetCode || item.code || item.symbol || "",
          assetName: item.assetName || item.name || "",
          name: item.assetName || item.name || "",
          assetType: type,
          type: type,

          invested: Number(item.invested || item.totalInvestment || 0),
          current: Number(item.current || 0),
          profit: Number(item.profit || 0),

          percentage:
            item.invested > 0
              ? Number(((item.profit / item.invested) * 100).toFixed(2))
              : 0,

          quantity: Number(
            item.quantity ||
              item.totalShares ||
              item.installments ||
              0
          ),

          avgPrice: Number(item.avgPrice || item.price || 0),

          status: item.status || "active",
        };
      };

      const mergedAssets = [
        ...(data?.stocks || []).map(normalize),
        ...(data?.sips || []).map(normalize),
        ...(data?.ipos || []).map(normalize),
      ];

      /* ================= TOTAL ================= */
      const totalInvested = mergedAssets.reduce(
        (sum, i) => sum + (i.invested || 0),
        0
      );

      const currentValue = mergedAssets.reduce(
        (sum, i) => sum + (i.current || 0),
        0
      );

      const totalProfit = currentValue - totalInvested;

      const profitPercentage =
        totalInvested > 0
          ? Number(((totalProfit / totalInvested) * 100).toFixed(2))
          : 0;

      /* ================= ALLOCATION ================= */
      const grouped = {
        stock: 0,
        sip: 0,
        ipo: 0,
      };

      mergedAssets.forEach((i) => {
        if (!grouped[i.assetType]) return;
        grouped[i.assetType] += i.current || 0;
      });

      const allocationData = Object.keys(grouped).map((key) => ({
        label: key.toUpperCase(),
        value:
          currentValue > 0
            ? Number(((grouped[key] / currentValue) * 100).toFixed(2))
            : 0,
      }));

      /* ================= SET STATE ================= */
      setAssets(mergedAssets);

      setSummary({
        totalInvested,
        currentValue,
        totalProfit,
        profitPercentage,
        totalAssets: apiSummary?.totalAssets || mergedAssets.length,
        totalStocks: apiSummary?.totalStocks || 0,
        totalSIPs: apiSummary?.totalSIPs || 0,
        totalIPOs: apiSummary?.totalIPOs || 0,
      });

      setAllocation(allocationData);
    } catch (error) {
      console.error("Portfolio Error:", error.message);
      setAssets([]);
      setSummary(null);
      setAllocation([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchPortfolio();
  }, [user?.email]);

  /* ================= CONTEXT VALUE ================= */
  const value = {
    user,
    assets,
    summary,
    allocation,
    transactions,
    loading,
    fetchPortfolio,
    refreshPortfolio: fetchPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

/* ====================================================== */
export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error(
      "usePortfolioContext must be used within PortfolioProvider"
    );
  }

  return context;
};