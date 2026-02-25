import { useState, useEffect } from "react";
import IPOCard from "./IPOCard";
import IPOPagination from "./IPOPagination";

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

  if (loading) return <p>Loading...</p>;

  if (!loading && currentIPOs.length === 0) {
    return <p className="text-center">No IPOs Available</p>;
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