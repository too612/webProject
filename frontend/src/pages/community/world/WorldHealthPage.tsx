import { useState, useEffect } from 'react';
import { communityApi } from '../../../api/communityApi';

const AGE_GROUPS = ['전체', '20대', '30대', '40대', '50대', '60대+'];

interface DiseaseItem {
  name: string;
  desc: string;
  risk: string;
}

export default function WorldHealthPage() {
  const [selectedAge, setSelectedAge] = useState('전체');
  const [allDiseases, setAllDiseases] = useState<DiseaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    communityApi.world.getHealth({})
      .then((res) => setAllDiseases((res.items ?? []) as unknown as DiseaseItem[]))
      .catch(() => setAllDiseases([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedAge === '전체'
    ? allDiseases
    : allDiseases.filter((d) => (d as unknown as Record<string, unknown>).ageGroup === selectedAge);

  const riskColor = (risk: string) =>
    risk === '높음' ? 'bg-red-100 text-red-700' :
    risk === '중간' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">건강 정보</h2>
        <p className="text-sm text-gray-500">연령대별 질환 예방 및 건강 관리 정보를 제공합니다.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {AGE_GROUPS.map((ag) => (
          <button key={ag} type="button"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedAge === ag ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setSelectedAge(ag)}>
            {ag}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-center text-sm text-gray-400 py-8">데이터를 불러오는 중...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center text-sm text-gray-400 py-8">데이터가 없습니다.</p>
          ) : filtered.map((d, i) => (
            <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2" key={i}>
              <h3 className="font-semibold text-brand-dark">{d.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{d.desc}</p>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${riskColor(d.risk)}`}>
                위험도: {d.risk}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
