import { useMemo } from "react";

const useAssetAllocation = (assets) => {
  const allocation = useMemo(() => {
    const total = assets.reduce(
      (acc, item) => acc + (item.current || 0),
      0
    );

    if (total === 0) return [];

    const grouped = {
      stock: 0,
      sip: 0,
      ipo: 0,
    };

    assets.forEach((item) => {
      grouped[item.type] += item.current || 0;
    });

    return Object.keys(grouped).map((key) => ({
      label: key.toUpperCase(),
      value: ((grouped[key] / total) * 100).toFixed(2),
    }));
  }, [assets]);

  return allocation;
};

export default useAssetAllocation;