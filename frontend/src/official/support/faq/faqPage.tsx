import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFaqInfo } from './useFaqInfo';

export default function FaqPage() {
  const { faqItems, loading, error, loadFaqItems } = useFaqInfo();

  useEffect(() => {
    loadFaqItems();
  }, [loadFaqItems]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">FAQ</h2>
        <p className="text-sm text-gray-400 mt-0.5">자주 묻는 질문을 정리했습니다.</p>
      </div>

      {loading && <div className="text-sm text-gray-500">FAQ를 불러오는 중입니다.</div>}
      {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

      <div className="space-y-3">
        {faqItems.map((item) => (
          <article className="bg-gray-50 rounded-lg p-5" key={item.faqId}>
            <h4 className="font-semibold text-brand-dark">Q. {item.question}</h4>
            <p className="text-sm text-gray-600 mt-1">A. {item.answer}</p>
          </article>
        ))}
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link className="text-brand-primary hover:underline text-sm" to="/support/location">오시는 길</Link>
        <Link className="text-brand-primary hover:underline text-sm" to="/support/qna">Q&A</Link>
      </div>
    </section>
  );
}
