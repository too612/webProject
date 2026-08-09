import { SYSTEM_LOG_AUDIT_COLUMNS, type SystemLogAuditRow } from "./auditModel";
import { useSystemLogAuditPage } from "./auditHook";
import { ActionButton, Badge, Button, Input } from "../../../common/ui";

export default function LogAuditPage() {
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
  } = useSystemLogAuditPage();

  const getCellValue = (row: SystemLogAuditRow, key: string): string => {
    const value = row[key];
    if (value === null || value === undefined) return "-";

    if (typeof value !== "string" && typeof value !== "number") return "-";

    return String(value);
  };

  const renderCell = (
    row: SystemLogAuditRow,
    col: (typeof SYSTEM_LOG_AUDIT_COLUMNS)[number],
  ) => {
    if (col.key === "userId") {
      return <code>{getCellValue(row, "userId")}</code>;
    }

    if (col.key === "result") {
      return (
        <Badge
          variant={
            getCellValue(row, "result") === "성공" ? "success" : "destructive"
          }
        >
          {getCellValue(row, "result")}
        </Badge>
      );
    }

    return getCellValue(row, String(col.key));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">감사 추적 관리</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            주요 사용자의 접속 및 변경 이력을 감사 목적으로 관리합니다.
          </p>
        </div>
        <ActionButton action="excel" label="감사내역 다운로드" />
      </div>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <Input
          className="flex-1"
          placeholder="사용자 ID 또는 액션 검색"
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
              {SYSTEM_LOG_AUDIT_COLUMNS.map((col) => (
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
                  colSpan={SYSTEM_LOG_AUDIT_COLUMNS.length + 1}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={SYSTEM_LOG_AUDIT_COLUMNS.length + 1}
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
                  {SYSTEM_LOG_AUDIT_COLUMNS.map((col) => (
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
