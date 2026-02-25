const SIPLoadingSkeleton = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-6 rounded-xl shadow-md"
        >
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};

export default SIPLoadingSkeleton;