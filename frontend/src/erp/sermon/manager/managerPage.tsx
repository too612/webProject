import { useSermonManagerPage } from "./managerHook";
import { SERMON_MANAGER_COLUMNS, type SermonManagerRow } from "./managerModel";
import { ActionButton, Button, Input } from "../../../common/ui";

export default function SermonManagerPage() {
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
  } = useSermonManagerPage();

  const getCellValue = (row: SermonManagerRow, key: string): string => {
    const value = row[key];
    if (value === null || value === undefined) return "-";

    if (typeof value !== "string" && typeof value !== "number") return "-";

    return String(value);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">설교 관리 목록</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            설교 관리 데이터를 조회하고 관리합니다.
          </p>
        </div>
      </div>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <Input
          value={inputKeyword}
          onChange={(e) => handleInputKeywordChange(e.target.value)}
          placeholder="검색어를 입력해주세요"
          className="flex-1"
        />
        <ActionButton
          action="search"
          type="submit"
          loading={loading}
          className="min-w-0"
        />
      </form>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-panel border border-gray-100 shadow-panel">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left font-medium text-gray-500">
              <th className="w-12 px-4 py-3 text-center">번호</th>
              {SERMON_MANAGER_COLUMNS.map((col) => (
                <th key={String(col.key)} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td
                  colSpan={SERMON_MANAGER_COLUMNS.length + 1}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={SERMON_MANAGER_COLUMNS.length + 1}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  조회된 내역이 없습니다.
                </td>
              </tr>
            )}
            {!loading && items.length !== 0 && (
              items.map((row, idx) => (
                <tr key={`${page}-${idx}`} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-gray-400">
                    {page * 10 + idx + 1}
                  </td>
                  {SERMON_MANAGER_COLUMNS.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-gray-700"
                    >
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
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={handlePrevPage}
          >
            이전
          </Button>
          <span className="px-3 text-gray-600">
            {page + 1} / {Math.max(totalPages, 1)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={handleNextPage}
          >
            다음
          </Button>
        </div>
      </div>
    </section>
  );
}
