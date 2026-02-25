import { useMemo, useState } from "react";

const useIPOFilters = (ipoData) => {
  const [search, setSearch] = useState("");
  const [exchange, setExchange] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const filteredData = useMemo(() => {
    if (!Array.isArray(ipoData)) return [];

    let data = [...ipoData];

    // Safe Search
    if (search.trim() !== "") {
      data = data.filter((ipo) => {
        const name = ipo?.name || "";
        const symbol = ipo?.symbol || "";
        return (
          name.toLowerCase().includes(search.toLowerCase()) ||
          symbol.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Exchange Filter
    if (exchange !== "All") {
      data = data.filter((ipo) => ipo?.exchange === exchange);
    }

    // Sorting
    if (sortBy === "date") {
      data.sort(
        (a, b) =>
          new Date(b?.date || 0) - new Date(a?.date || 0)
      );
    }


    if (sortBy === "price") {
      data.sort((a, b) => {
        const priceA =
          parseFloat(a?.price?.split("-")[0]) || 0;
        const priceB =
          parseFloat(b?.price?.split("-")[0]) || 0;
        return priceB - priceA;
      });
    }

    return data;
  }, [ipoData, search, exchange, sortBy]);

  return {
    filteredData,
    search,
    setSearch,
    exchange,
    setExchange,
    sortBy,
    setSortBy,
  };
};

export default useIPOFilters;
