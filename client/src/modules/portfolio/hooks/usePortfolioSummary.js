import { useMemo } from "react";

const usePortfolioSummary = (assets) => {
  const summary = useMemo(() => {
    const totalInvested = assets.reduce(
      (acc, item) => acc + (item.invested || 0),
      0
    );

    const currentValue = assets.reduce(
      (acc, item) => acc + (item.current || 0),
      0
    );

    const totalProfit = currentValue - totalInvested;

    const profitPercentage =
      totalInvested > 0
        ? ((totalProfit / totalInvested) * 100).toFixed(2)
        : 0;

    return {
      totalInvested,
      currentValue,
      totalProfit,
      profitPercentage,
    };
  }, [assets]);

  return summary;
};

export default usePortfolioSummary;