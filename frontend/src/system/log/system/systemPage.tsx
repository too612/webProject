import {
  SYSTEM_LOG_SYSTEM_COLUMNS,
  type SystemLogSystemRow,
} from "./systemModel";
import { useSystemLogSystemPage } from "./systemHook";
import { ActionButton, Badge, Button, Input } from "../../../common/ui";

export default function LogSystemPage() {
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
  } = useSystemLogSystemPage();

  const getCellValue = (row: SystemLogSystemRow, key: string): string => {
    const value = row[key];
    return value === null || value === undefined ? "-" : String(value);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">
            시스템 로그 조회
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            시스템 각 모듈에서 발생한 이벤트 로그를 확인하고 이상을 분석합니다.
          </p>
        </div>
        <ActionButton action="excel" label="로그 내보내기" />
      </div>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <Input
          className="flex-1"
          placeholder="메시지 검색"
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
              {SYSTEM_LOG_SYSTEM_COLUMNS.map((col) => (
                <th key={String(col.key)} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={SYSTEM_LOG_SYSTEM_COLUMNS.length + 1}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={SYSTEM_LOG_SYSTEM_COLUMNS.length + 1}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center text-gray-400">
                    {page * 10 + idx + 1}
                  </td>
                  {SYSTEM_LOG_SYSTEM_COLUMNS.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-gray-700"
                    >
                      {col.key === "level" ? (
                        <Badge
                          variant={
                            (
                              {
                                INFO: "info",
                                WARN: "warning",
                                ERROR: "destructive",
                              } as Record<
                                string,
                                "info" | "warning" | "destructive"
                              >
                            )[getCellValue(row, "level")] ?? "secondary"
                          }
                        >
                          {getCellValue(row, "level")}
                        </Badge>
                      ) : (
                        getCellValue(row, String(col.key))
                      )}
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
