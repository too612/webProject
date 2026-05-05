type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex items-center gap-1" aria-label="페이지네이션">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        이전
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            page === currentPage
              ? 'bg-brand-primary text-white border-brand-primary'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        다음
      </button>
    </nav>
  );
}
