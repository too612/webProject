import { useState, useEffect } from 'react';
import { communityApi } from '../../../api/communityApi';

interface EconomicData {
  indices?: { name: string; value: string; diff: string }[];
  rows?: { sector: string; keyword: string; trend: string; memo: string }[];
}

export default function WorldEconomicPage() {
  const [data, setData] = useState<EconomicData>({});
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    communityApi.world.getEconomic({})
      .then((res) => {
        const first = res.items[0] as EconomicData | undefined;
        if (first) setData(first);
      })
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const indices = data.indices ?? [];
  const rows = data.rows ?? [];

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-brand-dark">경제 정보</h2>
          <p className="text-sm text-gray-500">가정경제에 도움이 되는 실용 정보를 제공합니다.</p>
        </div>
        <button type="button" className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          onClick={loadData}>지표 업데이트</button>
      </div>
      {loading ? (
        <p className="text-center text-sm text-gray-400 py-8">데이터를 불러오는 중...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {indices.map((item) => (
              <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-4 text-center space-y-1" key={item.name}>
                <span className="text-xs text-gray-500">{item.name}</span>
                <strong className="block text-brand-dark font-bold">{item.value}</strong>
                <span className="text-xs text-brand-primary">{item.diff}</span>
              </article>
            ))}
          </div>
          <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">분야</th>
                  <th className="px-4 py-3 text-left font-medium">핵심 키워드</th>
                  <th className="px-4 py-3 text-left font-medium">추세</th>
                  <th className="px-4 py-3 text-left font-medium">가이드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">데이터가 없습니다.</td></tr>
                ) : rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{row.sector}</td>
                    <td className="px-4 py-3 text-gray-700">{row.keyword}</td>
                    <td className="px-4 py-3 text-gray-700">{row.trend}</td>
                    <td className="px-4 py-3 text-gray-500">{row.memo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
