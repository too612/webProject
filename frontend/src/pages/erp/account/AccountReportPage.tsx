import { useEffect, useState } from 'react';
import { erpApi } from '../../../api/erpApi';

const CURRENT_YEAR = String(new Date().getFullYear());
const CURRENT_MONTH = String(new Date().getMonth() + 1).padStart(2, '0');

type ReportData = { income: number; expense: number; balance: number; items: Record<string, unknown>[] };

export default function AccountReportPage() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [data, setData] = useState<ReportData>({ income: 0, expense: 0, balance: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    erpApi.account.getReport(year, month)
      .then((result) => { if (mounted) setData(result as ReportData); })
      .catch(() => { if (mounted) setError('데이터를 불러오지 못했습니다.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [year, month]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">재정 보고</h2>
        <p className="text-sm text-gray-500 mt-0.5">월별 수입·지출 현황 보고서를 조회합니다.</p>
      </div>

      <div className="flex gap-2">
        <select value={year} onChange={(e) => setYear(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
          {[0, 1, 2].map((offset) => {
            const y = String(Number(CURRENT_YEAR) - offset);
            return <option key={y} value={y}>{y}년</option>;
          })}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
            <option key={m} value={m}>{Number(m)}월</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400 text-sm">불러오는 중...</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-panel shadow-panel border border-l-4 border-l-emerald-500 px-5 py-4">
              <p className="text-sm text-gray-500 mb-1">총 수입</p>
              <p className="text-xl font-bold text-emerald-600">{data.income.toLocaleString()}원</p>
            </div>
            <div className="bg-white rounded-panel shadow-panel border border-l-4 border-l-red-500 px-5 py-4">
              <p className="text-sm text-gray-500 mb-1">총 지출</p>
              <p className="text-xl font-bold text-red-600">{data.expense.toLocaleString()}원</p>
            </div>
            <div className="bg-white rounded-panel shadow-panel border border-l-4 border-l-indigo-500 px-5 py-4">
              <p className="text-sm text-gray-500 mb-1">잔액</p>
              <p className="text-xl font-bold text-indigo-600">{data.balance.toLocaleString()}원</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
            <table className="w-full text-sm">
              <thead><tr className="bg-brand-primary text-white text-left">
                <th className="px-4 py-3 font-medium">항목</th>
                <th className="px-4 py-3 font-medium">유형</th>
                <th className="px-4 py-3 font-medium">금액</th>
                <th className="px-4 py-3 font-medium">날짜</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">데이터가 없습니다.</td></tr>
                ) : (
                  data.items.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{String(row.category ?? '-')}</td>
                      <td className="px-4 py-3 text-gray-700">{String(row.transType ?? '-')}</td>
                      <td className="px-4 py-3 text-gray-700">{Number(row.amount ?? 0).toLocaleString()}원</td>
                      <td className="px-4 py-3 text-gray-700">{String(row.transDate ?? '-')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
