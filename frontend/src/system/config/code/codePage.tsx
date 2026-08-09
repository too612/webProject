import {
  SYSTEM_CONFIG_CODE_COLUMNS,
  type SystemConfigCodeRow,
} from "./codeModel";
import { useSystemConfigCodePage } from "./codeHook";
import { ActionButton, Button } from "../../../common/ui";

export default function ConfigCodePage() {
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
  } = useSystemConfigCodePage();

  const getCellValue = (row: SystemConfigCodeRow, key: string): string => {
    const value = row[key];
    if (value === null || value === undefined) return "-";

    if (typeof value !== "string" && typeof value !== "number") return "-";

    return String(value);
  };

  const renderCell = (
    row: SystemConfigCodeRow,
    col: (typeof SYSTEM_CONFIG_CODE_COLUMNS)[number],
  ) => {
    if (col.key === "actions") {
      return (
        <>
          <Button variant="outline" size="sm">
            수정
          </Button>
          <Button variant="destructive" size="sm">
            삭제
          </Button>
        </>
      );
    }

    if (col.key === "groupCode" || col.key === "codeValue") {
      return <code>{getCellValue(row, String(col.key))}</code>;
    }

    return getCellValue(row, String(col.key));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">공통 코드 관리</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            시스템 전반에서 사용하는 코드 체계를 일관되게 관리합니다.
          </p>
        </div>
        <Button>코드 추가</Button>
      </div>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="그룹코드 또는 코드명 검색"
          value={inputKeyword}
          onChange={(event) => handleInputKeywordChange(event.target.value)}
        />
        <ActionButton action="search" type="submit" className="min-w-0" />
      </form>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 font-medium">
              <th className="px-4 py-3 w-12 text-center">번호</th>
              {SYSTEM_CONFIG_CODE_COLUMNS.map((col) => (
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
                  colSpan={SYSTEM_CONFIG_CODE_COLUMNS.length + 1}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={SYSTEM_CONFIG_CODE_COLUMNS.length + 1}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  데이터가 없습니다.
                </td>
              </tr>
            )}
            {!loading && items.length !== 0 && (
              items.map((row, idx) => (
                <tr key={`${page}-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center text-gray-400">
                    {page * 10 + idx + 1}
                  </td>
                  {SYSTEM_CONFIG_CODE_COLUMNS.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-gray-700"
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">전체 {totalElements}건</span>
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
