const InvestSphereLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      
      {/* Animated Circle */}
      <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Animated Text */}
      <h1 className="mt-6 text-2xl font-bold tracking-wide">
        <span className="text-blue-600">Invest</span>
        <span className="text-slate-800">Sphere</span>
      </h1>

      <p className="text-sm text-slate-500 mt-2 animate-pulse">
        Loading financial insights...
      </p>
    </div>
  );
};

export default InvestSphereLoader;