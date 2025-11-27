import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '' 
}) => {
  // Safe default for onPageChange
  const handlePageChange = (page) => {
    if (typeof onPageChange === 'function') {
      onPageChange(page);
    } else {
      console.warn('onPageChange is not a function');
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
      >
        ←
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-2 rounded-lg transition-colors ${
            currentPage === page
              ? 'bg-yellow-500 text-black font-semibold'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;