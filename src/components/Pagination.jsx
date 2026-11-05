const baseClass =
  "cursor-pointer rounded-md border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50";
const defaultClass = `${baseClass} border-gray-200 bg-white hover:bg-gray-50`;
const activeClass = `${baseClass} border-blue-500 bg-blue-500 text-white`;

const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

// Always returns at most 7 slots, e.g. [1, "...", 5, 6, 7, "...", 17]
function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) return range(1, totalPages);
  if (currentPage <= 4) return [...range(1, 5), "...", totalPages];
  if (currentPage >= totalPages - 3) {
    return [1, "...", ...range(totalPages - 4, totalPages)];
  }
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="@container">
      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        <button
          type="button"
          className={defaultClass}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ← Previous
        </button>

        <span className="px-2 text-sm text-gray-700 @lg:hidden">
          {currentPage} of {totalPages}
        </span>

        <div className="hidden items-center gap-2 @lg:flex">
          {getPageNumbers(currentPage, totalPages).map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-1 text-gray-500">
                …
              </span>
            ) : (
              <button
                type="button"
                key={index}
                aria-current={page === currentPage ? "page" : undefined}
                className={page === currentPage ? activeClass : defaultClass}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          className={defaultClass}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next →
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
