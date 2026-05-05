import { Link } from 'react-router-dom';

type ErpPageShellProps = {
  title: string;
  summary: string;
  checklist: string[];
  path: string;
};

export default function ErpPageShell({ title, summary, checklist, path }: ErpPageShellProps) {
  return (
    <section className="space-y-5">
      <div className="bg-white rounded-panel shadow-panel border border-gray-100 px-6 py-5">
        <h1 className="text-xl font-bold text-brand-dark">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{summary}</p>
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-brand-dark">기본 정보</h2>
        </div>
        <div className="px-6 py-4 space-y-2 text-sm text-gray-600">
          <p>경로: <strong className="text-brand-dark">{path}</strong></p>
          {checklist.map((item) => (
            <p key={item}>• {item}</p>
          ))}
          <p className="pt-2">
            <Link
              className="inline-flex items-center gap-1 bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
              to="/erp"
            >
              ERP 홈으로 이동
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
