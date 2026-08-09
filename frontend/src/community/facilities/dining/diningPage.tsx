import { useCommunityFacilitiesDiningPage } from "./diningHook";
import {
  COMMUNITY_FACILITIES_DINING_COLUMNS,
  type CommunityFacilitiesDiningRow,
} from "./diningModel";
import { ActionButton, Button } from "../../../common/ui";

export default function FacilitiesDiningPage() {
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
  } = useCommunityFacilitiesDiningPage();

  const getCellValue = (
    row: CommunityFacilitiesDiningRow,
    key: string,
  ): string => {
    const value = row[key];
    if (value === null || value === undefined) return "-";

    if (typeof value !== "string" && typeof value !== "number") return "-";

    return String(value);
  };

  return (
    <section className="space-y-4">
      <div className="space-y-0.5">
        <h2 className="text-lg font-bold text-brand-dark">식당 현황</h2>
        <p className="text-sm text-gray-500">
          식당 봉사 일정과 담당자 편성 정보를 공유합니다.
        </p>
      </div>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          placeholder="검색어를 입력하세요"
          value={inputKeyword}
          onChange={(e) => handleInputKeywordChange(e.target.value)}
        />
        <ActionButton action="search" type="submit" className="min-w-0" />
      </form>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">번호</th>
              {COMMUNITY_FACILITIES_DINING_COLUMNS.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left font-medium"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td
                  colSpan={COMMUNITY_FACILITIES_DINING_COLUMNS.length + 1}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={COMMUNITY_FACILITIES_DINING_COLUMNS.length + 1}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  등록된 항목이 없습니다.
                </td>
              </tr>
            )}
            {!loading && items.length !== 0 && (
              items.map((row, index) => (
                <tr key={`${page}-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">
                    {totalElements - page * 10 - index}
                  </td>
                  {COMMUNITY_FACILITIES_DINING_COLUMNS.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-4 py-3 text-gray-700"
                    >
                      {getCellValue(row, String(column.key))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>전체 {totalElements}건</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={handlePrevPage}
          >
            이전
          </Button>
          <span>
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
