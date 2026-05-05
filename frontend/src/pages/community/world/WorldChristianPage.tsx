import { useState, useEffect } from 'react';
import { communityApi } from '../../../api/communityApi';

interface NewsItem {
  title: string;
  source: string;
  date: string;
  summary: string;
  badge: string;
}

export default function WorldChristianPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const fetchNews = (kw = '') => {
    setLoading(true);
    communityApi.world.getChristian({ keyword: kw })
      .then((res) => setNews((res.items ?? []) as unknown as NewsItem[]))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(); }, []);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-brand-dark">기독교 정보</h2>
          <p className="text-sm text-gray-500">최신 기독교 관련 뉴스를 확인할 수 있습니다.</p>
        </div>
        <button type="button" className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          onClick={() => { setKeyword(''); fetchNews(''); }}>검색 초기화</button>
      </div>
      <div className="flex gap-2">
        <input className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
          placeholder="검색어를 입력하세요" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <button type="button" className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          onClick={() => fetchNews(keyword)}>검색</button>
      </div>
      {loading ? (
        <p className="text-center text-sm text-gray-400 py-8">뉴스를 불러오는 중...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {news.length === 0 ? (
            <p className="col-span-full text-center text-sm text-gray-400 py-8">검색 결과가 없습니다.</p>
          ) : news.map((item, i) => (
            <article className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-hidden" key={i}>
              <div className="bg-brand-primary/10 h-24 flex items-center justify-center px-4">
                <span className="bg-brand-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">{item.badge}</span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{item.source}</span>
                  <span>·</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-semibold text-brand-dark text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
