import SIPCard from "./SIPCard";

const SIPList = ({ funds, watchlist, setWatchlist, user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {funds.map((fund) => (
        <SIPCard
          key={fund.schemeCode || fund.scheme_code}
          fund={fund}
          watchlist={watchlist}
          setWatchlist={setWatchlist}
          user={user}
        />
      ))}
    </div>
  );
};

export default SIPList;
