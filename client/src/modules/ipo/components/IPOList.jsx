import { useState, useEffect } from "react";
import IPOCard from "./IPOCard";
import IPOPagination from "./IPOPagination";
import InvestSphereLoader from "../../../shared/components/InvestSphereLoader";

const IPOList = ({ ipos = [], loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [ipos]);

  if (!Array.isArray(ipos)) {
    return <p className="text-center">No IPO Data</p>;
  }

  const totalPages = Math.ceil(ipos.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentIPOs = ipos.slice(startIndex, startIndex + cardsPerPage);

  // ✅ Loading → GIF Loader instead of text
  if (loading) return <InvestSphereLoader />;

  if (!loading && currentIPOs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white shadow-md rounded-2xl p-10 max-w-md w-full text-center border border-slate-100 hover:shadow-lg transition duration-300">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-50">
            <span className="text-3xl">📉</span>
          </div>

          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            No IPOs Found
          </h3>

          <p className="text-slate-500 text-sm mb-6">
            There are currently no IPOs available matching your criteria. Try
            adjusting filters or check back later.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentIPOs.map((ipo) => (
          <IPOCard key={ipo.symbol} ipo={ipo} />
        ))}
      </div>

      <IPOPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default IPOList;
