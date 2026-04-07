import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { PORTFOLIO_API } from "../constants/portfolioConstants";

/* ======================================================
 CONTEXT
====================================================== */
const PortfolioContext = createContext();

/* ======================================================
 PROVIDER
====================================================== */
export const PortfolioProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [allocation, setAllocation] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= USER ================= */
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("investsphere_user"));
    } catch {
      return null;
    }
  }, []);

  /* ======================================================
 FETCH PORTFOLIO (🔥 SINGLE API)
====================================================== */
  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      if (!user?.email) {
        setAssets([]);
        setSummary(null);
        setAllocation([]);
        return;
      }

      const res = await axios.get(
        `${PORTFOLIO_API.BASE}/portfolio?email=${user.email}`
      );

      if (!res.data?.success) {
        throw new Error("Portfolio API failed");
      }

      const { summary: apiSummary, data } = res.data;

      /* ======================================================
 NORMALIZE DATA
====================================================== */

      /* 🔹 STOCKS */
      const stockAssets =
        data?.stocks?.map((item) => {
          const currentValue = item.totalInvestment * 1.1; // mock
          const profit = currentValue - item.totalInvestment;
          const percentage =
            item.totalInvestment > 0
              ? (profit / item.totalInvestment) * 100
              : 0;

          return {
            id: item.assetCode,
            name: item.assetName,
            type: "stock",
            invested: item.totalInvestment,
            current: currentValue,
            profit,
            percentage: Number(percentage.toFixed(2)),
            quantity: item.totalQuantity,
            avgPrice: item.avgPrice,
          };
        }) || [];

      /* 🔹 SIP */
      const sipAssets =
        data?.sips?.map((item) => {
          const currentValue = item.totalInvestment * 1.08; // mock
          const profit = currentValue - item.totalInvestment;
          const percentage =
            item.totalInvestment > 0
              ? (profit / item.totalInvestment) * 100
              : 0;

          return {
            id: item.assetCode,
            name: item.assetName,
            type: "sip",
            invested: item.totalInvestment,
            current: currentValue,
            profit,
            percentage: Number(percentage.toFixed(2)),
            installments: item.totalInstallments,
          };
        }) || [];

      /* 🔹 IPO */
      const ipoAssets =
        data?.ipos?.map((item) => {
          const currentValue = item.totalInvestment * 1.15; // mock
          const profit = currentValue - item.totalInvestment;
          const percentage =
            item.totalInvestment > 0
              ? (profit / item.totalInvestment) * 100
              : 0;

          return {
            id: item.assetCode,
            name: item.assetName,
            type: "ipo",
            invested: item.totalInvestment,
            current: currentValue,
            profit,
            percentage: Number(percentage.toFixed(2)),
            shares: item.totalShares,
            avgPrice: item.avgPrice,
            status: item.status,
          };
        }) || [];

      /* ================= MERGE ================= */
      const mergedAssets = [
        ...stockAssets,
        ...sipAssets,
        ...ipoAssets,
      ];

      /* ======================================================
 TOTAL CALCULATIONS
====================================================== */
      let totalInvested = 0;
      let currentValue = 0;

      mergedAssets.forEach((item) => {
        totalInvested += item.invested;
        currentValue += item.current;
      });

      const totalProfit = currentValue - totalInvested;

      const profitPercentage =
        totalInvested > 0
          ? (totalProfit / totalInvested) * 100
          : 0;

      /* ======================================================
 ALLOCATION (🔥 PIE CHART READY)
====================================================== */
      const grouped = {
        stock: 0,
        sip: 0,
        ipo: 0,
      };

      mergedAssets.forEach((item) => {
        grouped[item.type] += item.current;
      });

      const allocationData = Object.keys(grouped).map((key) => ({
        label: key.toUpperCase(),
        value:
          currentValue > 0
            ? Number(
                ((grouped[key] / currentValue) * 100).toFixed(2)
              )
            : 0,
      }));

      /* ======================================================
 SET STATE
====================================================== */
      setAssets(mergedAssets);

      setSummary({
        totalInvested,
        currentValue,
        totalProfit,
        profitPercentage: Number(profitPercentage.toFixed(2)),
        totalAssets: apiSummary?.totalAssets || mergedAssets.length,
        totalStocks: apiSummary?.totalStocks || stockAssets.length,
        totalSIPs: apiSummary?.totalSIPs || sipAssets.length,
        totalIPOs: apiSummary?.totalIPOs || ipoAssets.length,
      });

      setAllocation(allocationData);
    } catch (error) {
      console.error("Portfolio Context Error:", error.message);
      setAssets([]);
      setSummary(null);
      setAllocation([]);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
 INIT LOAD
====================================================== */
  useEffect(() => {
    fetchPortfolio();
  }, [user?.email]);

  /* ======================================================
 CONTEXT VALUE
====================================================== */
  const value = {
    assets,
    summary,
    allocation,
    loading,
    refreshPortfolio: fetchPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

/* ======================================================
 HOOK
====================================================== */
export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error(
      "usePortfolioContext must be used within PortfolioProvider"
    );
  }

  return context;
};