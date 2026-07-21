import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API from "../../../config/api";


/* ======================================================
 API CONFIG
====================================================== */


/* ======================================================
 CUSTOM HOOK
====================================================== */
const usePortfolio = () => {
  const [assets, setAssets] = useState([]);
  const [summary, setSummary] = useState({
    totalInvestment: 0,
    totalAssets: 0,
    totalStocks: 0,
    totalSIPs: 0,
    totalIPOs: 0,
  });
  const [filter, setFilter] = useState("all");
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
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);

        if (!user?.email) {
          setAssets([]);
          return;
        }

        const res = await axios.get(
          `${API}/portfolio?email=${user.email}`
        );

        if (!res.data?.success) {
          throw new Error("Portfolio API failed");
        }

        const { summary, data } = res.data;

        /* ================= SAVE SUMMARY ================= */
        setSummary(summary || {});

        /* ======================================================
 NORMALIZE DATA (UI FRIENDLY FORMAT)
====================================================== */

        /* 🔹 STOCKS */
        const stockAssets =
          data?.stocks?.map((item) => {
            const currentValue = item.totalInvestment * 1.1; // 🔥 mock
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
            const currentValue = item.totalInvestment * 1.08; // 🔥 mock
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
            const currentValue = item.totalInvestment * 1.15; // 🔥 mock
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
        const allAssets = [
          ...stockAssets,
          ...sipAssets,
          ...ipoAssets,
        ];

        setAssets(allAssets);
      } catch (err) {
        console.error("Portfolio fetch error:", err.message);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [user?.email]);

  /* ======================================================
 FILTER
====================================================== */
  const filteredAssets = useMemo(() => {
    if (filter === "all") return assets;
    return assets.filter((a) => a.type === filter);
  }, [assets, filter]);

  /* ======================================================
 TOTAL CALCULATIONS (UI USE)
====================================================== */
  const totals = useMemo(() => {
    const totalInvested = assets.reduce(
      (acc, a) => acc + (a.invested || 0),
      0
    );

    const totalCurrent = assets.reduce(
      (acc, a) => acc + (a.current || 0),
      0
    );

    const totalProfit = totalCurrent - totalInvested;

    const totalPercentage =
      totalInvested > 0
        ? (totalProfit / totalInvested) * 100
        : 0;

    return {
      totalInvested,
      totalCurrent,
      totalProfit,
      totalPercentage: Number(totalPercentage.toFixed(2)),
    };
  }, [assets]);

  /* ======================================================
 RETURN
====================================================== */
  return {
    assets: filteredAssets,
    rawAssets: assets, // 🔥 useful for charts
    summary,
    totals,
    filter,
    setFilter,
    loading,
  };
};

export default usePortfolio;