import SIPCard from "./SIPCard";

const SIPList = ({ funds }) => {
  if (!funds.length) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No SIP Funds Found
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {funds.map((fund) => (
        <SIPCard key={fund.schemeCode} fund={fund} />
      ))}
    </div>
  );
};

export default SIPList;