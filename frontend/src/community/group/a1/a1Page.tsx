import { COMMUNITY_GROUP_A1_COLUMNS, type CommunityGroupA1Row } from './a1Model';
import { useCommunityGroupA1Page } from './a1Hook';

export default function GroupA1Page() {
    const { items, totalMembers, loading, error } = useCommunityGroupA1Page();

    const getCellValue = (row: CommunityGroupA1Row, key: string): string => {
        const value = row[key];
        return value === null || value === undefined ? '' : String(value);
    };

    return (
        <section className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-0.5">
                    <h2 className="text-lg font-bold text-brand-dark">A1 구역</h2>
                    <p className="text-sm text-gray-500">A1 구역 구성원과 활동 현황을 확인합니다.</p>
                </div>
                <button
                    type="button"
                    className="bg-brand-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
                >
                    구역원 등록
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-panel shadow-panel border border-gray-100 px-5 py-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">전체인원</p>
                    <strong className="text-2xl font-bold text-brand-dark">{totalMembers}명</strong>
                </div>
                <div className="bg-white rounded-panel shadow-panel border border-gray-100 px-5 py-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">평균 출석률</p>
                    <strong className="text-2xl font-bold text-brand-dark">91%</strong>
                </div>
                <div className="bg-white rounded-panel shadow-panel border border-gray-100 px-5 py-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">이번 달 기도제목</p>
                    <strong className="text-2xl font-bold text-brand-dark">7개</strong>
                </div>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

            <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-x-auto">
                {loading ? (
                    <p className="px-4 py-8 text-center text-gray-400">데이터를 불러오는 중...</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-brand-primary text-white">
                            <tr>
                                {COMMUNITY_GROUP_A1_COLUMNS.map((column) => (
                                    <th key={String(column.key)} className="px-4 py-3 text-left font-medium">{column.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.length === 0 ? (
                                <tr><td colSpan={COMMUNITY_GROUP_A1_COLUMNS.length} className="px-4 py-8 text-center text-gray-400">데이터가 없습니다.</td></tr>
                            ) : items.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {COMMUNITY_GROUP_A1_COLUMNS.map((column) => (
                                        <td key={String(column.key)} className="px-4 py-3 text-gray-700">{getCellValue(row, String(column.key))}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}