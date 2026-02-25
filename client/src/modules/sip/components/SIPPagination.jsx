const SIPPagination = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex justify-center gap-3 mt-10">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-gray-400 flex items-center">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default SIPPagination;