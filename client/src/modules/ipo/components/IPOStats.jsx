const IPOStats = ({ ipoData }) => {
  const total = ipoData.length;
  const exchanges = [...new Set(ipoData.map((ipo) => ipo.exchange))];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <p className="text-gray-500 text-sm">Total IPOs</p>
        <h2 className="text-2xl font-bold text-blue-600">
          {total}
        </h2>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <p className="text-gray-500 text-sm">Exchanges</p>
        <h2 className="text-2xl font-bold text-blue-600">
          {exchanges.length}
        </h2>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <p className="text-gray-500 text-sm">Latest IPO</p>
        <h2 className="text-xl font-semibold">
          {ipoData[0]?.name || "N/A"}
        </h2>
      </div>
    </div>
  );
};

export default IPOStats;
