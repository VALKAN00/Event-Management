import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  // Add safety checks for all props
  const safePage = Number.isFinite(currentPage) ? currentPage : 1;
  const safeTotal = Number.isFinite(totalPages) ? totalPages : 1;
  const safeItems = Number.isFinite(totalItems) ? totalItems : 0;
  const safeItemsPerPage = Number.isFinite(itemsPerPage) ? itemsPerPage : 10;
  
  const startItem = (safePage - 1) * safeItemsPerPage + 1;
  const endItem = Math.min(safePage * safeItemsPerPage, safeItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (safeTotal <= maxVisiblePages) {
      for (let i = 1; i <= safeTotal; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, safePage - 2);
      let end = Math.min(safeTotal, start + maxVisiblePages - 1);
      
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < safeTotal) {
        if (end < safeTotal - 1) pages.push('...');
        pages.push(safeTotal);
      }
    }
    
    return pages;
  };

  if (safeTotal <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{startItem}</span>
            {' '}to{' '}
            <span className="font-medium">{endItem}</span>
            {' '}of{' '}
            <span className="font-medium">{safeItems}</span>
            {' '}results
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage === 1}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              safePage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-sm font-medium text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      safePage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage === safeTotal}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              safePage === safeTotal
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
