const IPOFilters = ({
  search,
  setSearch,
  exchange,
  setExchange,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-8 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center gap-4">

        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by company or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Exchange */}
        <select
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="All">All Exchanges</option>
          <option value="NASDAQ Global Select">
            NASDAQ Global Select
          </option>
          <option value="NASDAQ Capital">
            NASDAQ Capital
          </option>
          <option value="NYSE">NYSE</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="date">Sort by Date</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>
    </div>
  );
};

export default IPOFilters;
