import { COMMUNITY_GROUP_MANAGER_COLUMNS, type CommunityGroupManagerRow } from './managerModel';
import { useCommunityGroupManagerPage } from './managerHook';

export default function GroupManagerPage() {
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
    } = useCommunityGroupManagerPage();

    const getCellValue = (row: CommunityGroupManagerRow, key: string): string => {
        const value = row[key];
        return value === null || value === undefined ? '-' : String(value);
    };

    return (
        <section className="space-y-4">
            <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-brand-dark">구역 관리자</h2>
                <p className="text-sm text-gray-500">구역 구성 및 담당자 정보를 관리합니다.</p>
            </div>

            <form className="flex gap-2" onSubmit={handleSearch}>
                <input
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                    placeholder="검색어를 입력하세요"
                    value={inputKeyword}
                    onChange={(e) => handleInputKeywordChange(e.target.value)}
                />
                <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">
                    검색
                </button>
            </form>

            {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

            <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-brand-primary text-white">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">No.</th>
                            {COMMUNITY_GROUP_MANAGER_COLUMNS.map((column) => (
                                <th key={String(column.key)} className="px-4 py-3 text-left font-medium">{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={COMMUNITY_GROUP_MANAGER_COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400">불러오는 중...</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan={COMMUNITY_GROUP_MANAGER_COLUMNS.length + 1} className="px-4 py-8 text-center text-gray-400">등록된 항목이 없습니다.</td></tr>
                        ) : items.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-500">{totalElements - (page * 10) - index}</td>
                                {COMMUNITY_GROUP_MANAGER_COLUMNS.map((column) => (
                                    <td key={String(column.key)} className="px-4 py-3 text-gray-700">{getCellValue(row, String(column.key))}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>전체 {totalElements}건</span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={page === 0}
                        onClick={handlePrevPage}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        이전
                    </button>
                    <span>{page + 1} / {Math.max(totalPages, 1)}</span>
                    <button
                        type="button"
                        disabled={page >= totalPages - 1}
                        onClick={handleNextPage}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        다음
                    </button>
                </div>
            </div>
        </section>
    );
}