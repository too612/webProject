import { useEffect, useState } from 'react';
import { erpApi } from '../../../api/erpApi';

type AttendanceRow = {
  date: string;
  total: number;
  present: number;
  absent: number;
  rate: number;
};

export default function StatsAttendancePage() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    erpApi.stats.getAttendance()
      .then(res => setRows(res as AttendanceRow[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">출석 통계</h2>
        <p className="text-sm text-gray-500 mt-0.5">기간별 출석 현황을 분석합니다.</p>
      </div>
      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead><tr className="bg-brand-primary text-white text-left">
            <th className="px-4 py-3 font-medium">날짜</th>
            <th className="px-4 py-3 font-medium">전체</th>
            <th className="px-4 py-3 font-medium">출석</th>
            <th className="px-4 py-3 font-medium">결석</th>
            <th className="px-4 py-3 font-medium">출석률(%)</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">데이터를 불러오는 중…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">출석 통계 데이터가 없습니다.</td></tr>
            ) : rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{r.date}</td>
                <td className="px-4 py-3 text-gray-700">{r.total}</td>
                <td className="px-4 py-3 text-gray-700">{r.present}</td>
                <td className="px-4 py-3 text-gray-700">{r.absent}</td>
                <td className="px-4 py-3 text-gray-700">{r.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
