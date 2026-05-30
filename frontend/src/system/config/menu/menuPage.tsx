import { SYSTEM_CONFIG_MENU_COLUMNS, type SystemConfigMenuRow } from './menuModel';
import { useSystemConfigMenuPage } from './menuHook';

export default function ConfigMenuPage() {
  const {
    items,
    page,
    totalPages,
    totalElements,
    loading,
    error,
    handlePrevPage,
    handleNextPage,
  } = useSystemConfigMenuPage();

  const getCellValue = (row: SystemConfigMenuRow, key: string): string => {
    const value = row[key];
    return value === null || value === undefined ? '-' : String(value);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">메뉴 권한 관리</h2>
          <p className="text-sm text-gray-500 mt-0.5">역할별 메뉴 접근 및 권한 정책을 관리합니다.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1 bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#4e5caf] transition-colors">메뉴 추가</button>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-left text-gray-500 font-medium"><th className="px-4 py-3 w-12 text-center">번호</th>{SYSTEM_CONFIG_MENU_COLUMNS.map((col) => (<th key={String(col.key)} className="px-4 py-3">{col.label}</th>))}</tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (<tr><td colSpan={SYSTEM_CONFIG_MENU_COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400">불러오는 중...</td></tr>) : items.length === 0 ? (<tr><td colSpan={SYSTEM_CONFIG_MENU_COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400">데이터가 없습니다.</td></tr>) : (items.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center text-gray-400">{page * 10 + idx + 1}</td>
                {SYSTEM_CONFIG_MENU_COLUMNS.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                    {col.key === 'actions' ? (<button type="button" className="btn btn-sm btn-secondary">권한 설정</button>) : col.key === 'menuId' ? (<code>{getCellValue(row, 'menuId')}</code>) : col.key === 'level' ? (`LV.${getCellValue(row, 'level')}`) : (getCellValue(row, String(col.key)))}
                  </td>
                ))}
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">전체 {totalElements}건</span>
        <div className="flex items-center gap-1">
          <button type="button" className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" disabled={page === 0} onClick={handlePrevPage}>이전</button>
          <span className="px-3 text-gray-600">{page + 1} / {Math.max(totalPages, 1)}</span>
          <button type="button" className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" disabled={page >= totalPages - 1} onClick={handleNextPage}>다음</button>
        </div>
      </div>
    </section>
  );
}
