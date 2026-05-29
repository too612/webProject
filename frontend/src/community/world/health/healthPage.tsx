import {
    COMMUNITY_WORLD_HEALTH_AGE_GROUPS,
    type CommunityWorldHealthAgeGroup,
    type CommunityWorldHealthDiseaseRow,
} from './healthModel';
import { useCommunityWorldHealthPage } from './healthHook';

function getRiskClassName(risk: string): string {
    if (risk === '높음') return 'bg-red-100 text-red-700';
    if (risk === '중간') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
}

function getCellValue(row: CommunityWorldHealthDiseaseRow, key: string): string {
    const value = row[key];
    return value === null || value === undefined ? '-' : String(value);
}

export default function WorldHealthPage() {
    const { selectedAge, filteredItems, loading, error, handleAgeGroupSelect } = useCommunityWorldHealthPage();

    return (
        <section className="space-y-5">
            <div className="space-y-1">
                <h2 className="text-lg font-bold text-brand-dark">건강 정보</h2>
                <p className="text-sm text-gray-500">연령대별 질환 예방 및 건강 관리 정보를 제공합니다.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {COMMUNITY_WORLD_HEALTH_AGE_GROUPS.map((ageGroup) => (
                    <button
                        key={ageGroup}
                        type="button"
                        onClick={() => handleAgeGroupSelect(ageGroup as CommunityWorldHealthAgeGroup)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedAge === ageGroup ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {ageGroup}
                    </button>
                ))}
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

            {loading ? (
                <p className="text-center text-sm text-gray-400 py-8">데이터를 불러오는 중...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.length === 0 ? (
                        <p className="col-span-full text-center text-sm text-gray-400 py-8">데이터가 없습니다.</p>
                    ) : (
                        filteredItems.map((item, index) => (
                            <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2" key={index}>
                                <h3 className="font-semibold text-brand-dark">{getCellValue(item, 'name')}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{getCellValue(item, 'desc')}</p>
                                <span
                                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskClassName(
                                        getCellValue(item, 'risk')
                                    )}`}
                                >
                                    위험도: {getCellValue(item, 'risk')}
                                </span>
                            </article>
                        ))
                    )}
                </div>
            )}
        </section>
    );
}
