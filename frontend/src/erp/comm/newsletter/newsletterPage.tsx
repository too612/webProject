import { useCommNewsletterPage } from './newsletterHook';
import { COMM_NEWSLETTER_COLUMNS, type CommNewsletterRow } from './newsletterModel';

export default function NewsletterPage() {
  const {
    items,
    page,
    totalPages,
    totalElements,
    inputKeyword,
    loading,
    error,
    handleSearch,
    handleInputKeywordChange,
    handlePrevPage,
    handleNextPage,
  } = useCommNewsletterPage();

  const getCellValue = (row: CommNewsletterRow, key: string): string => {
    const value = row[key];
    return value === null || value === undefined ? '-' : String(value);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">뉴스레터 목록</h2>
          <p className="mt-0.5 text-sm text-gray-500">뉴스레터 데이터를 조회하고 관리합니다.</p>
        </div>
      </div>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          type="text"
          value={inputKeyword}
          onChange={(e) => handleInputKeywordChange(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <button
          type="submit"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          검색
        </button>
      </form>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="overflow-x-auto rounded-panel border border-gray-100 shadow-panel">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left font-medium text-gray-500">
              <th className="w-12 px-4 py-3 text-center">번호</th>
              {COMM_NEWSLETTER_COLUMNS.map((col) => (
                <th key={String(col.key)} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={COMM_NEWSLETTER_COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400">
                  불러오는 중...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={COMM_NEWSLETTER_COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400">
                  조회된 내역이 없습니다.
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-gray-400">{page * 10 + idx + 1}</td>
                  {COMM_NEWSLETTER_COLUMNS.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                      {getCellValue(row, String(col.key))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">총 {totalElements}건</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page === 0}
            onClick={handlePrevPage}
          >
            이전
          </button>
          <span className="px-3 text-gray-600">
            {page + 1} / {Math.max(totalPages, 1)}
          </span>
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page >= totalPages - 1}
            onClick={handleNextPage}
          >
            다음
          </button>
        </div>
      </div>
    </section>
  );
}
