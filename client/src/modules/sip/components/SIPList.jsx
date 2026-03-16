import SIPCard from "./SIPCard";

const SIPList = ({ funds = [], watchlist, setWatchlist, user }) => {

  const safeFunds = Array.isArray(funds) ? funds : [];

  if (safeFunds.length === 0) {
    return (
      <div className="col-span-full text-center py-16 text-slate-500">
        No SIP funds available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeFunds.map((fund) => (
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