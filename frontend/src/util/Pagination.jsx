import { useSearchParams, useNavigate } from "react-router-dom";

function Pagination({ currentPage, totalPages }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page);
    navigate({ search: newParams.toString() });
  };

  const pages = [];
  const maxPagesToShow = 5;
  const half = Math.floor(maxPagesToShow / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (currentPage <= half) {
    end = Math.min(totalPages, maxPagesToShow);
  }

  if (currentPage + half > totalPages) {
    start = Math.max(1, totalPages - maxPagesToShow + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-6 pb-20">
      <div className="flex gap-2">
        <button
          className="px-3 py-1 rounded-md bg-white text-black hover:text-white hover:bg-black  border boder-black disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-md transition-colors duration-200
          ${
            currentPage === page
              ? "bg-black text-white"
              : "bg-white hover:text-white hover:bg-black border border-black"
          }
          }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-white text-black hover:text-white hover:bg-black border border-black disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Pagination;
