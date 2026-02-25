const SIPSearchBar = ({ search, setSearch }) => {
  return (
    <div className="w-full md:w-96">
      <input
        type="text"
        placeholder="Search SIP Fund..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-5 py-3 rounded-xl border border-slate-300 bg-white shadow-sm
        focus:ring-2 focus:ring-green-500 focus:border-green-500
        outline-none transition-all duration-300 text-slate-700 placeholder-slate-400"
      />
    </div>
  );
};

export default SIPSearchBar;