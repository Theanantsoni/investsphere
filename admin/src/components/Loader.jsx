// src/components/Loader.jsx

const Loader = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen" : "h-40"
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs text-indigo-400 font-semibold">
          Loading
        </div>
      </div>
    </div>
  );
};

export default Loader;