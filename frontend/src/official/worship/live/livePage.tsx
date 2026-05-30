import { useEffect, useMemo, useState } from 'react';
import { useLiveItems } from './liveHook';
import type { LiveTab } from './liveModel';

export default function LivePage() {
  const [tab, setTab] = useState<LiveTab>('videos');
  const { items, loading, error, loadLiveItems } = useLiveItems();

  useEffect(() => {
    loadLiveItems();
  }, [loadLiveItems]);

  const channelHighlights = useMemo(
    () => [...items].sort((left, right) => (left.orderNo ?? 999) - (right.orderNo ?? 999)),
    [items]
  );

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-brand-dark">온라인 예배</h2>
        <p className="text-sm text-gray-500">유튜브 채널에서 예배 영상과 실시간 예배를 시청하실 수 있습니다.</p>
        {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</div>}
        <div className="flex flex-wrap gap-2 pt-1">
          <a href="https://www.youtube.com/@dsr87450" target="_blank" rel="noreferrer" className="text-sm bg-brand-primary text-white px-4 py-1.5 rounded-full hover:bg-brand-dark transition-colors">채널 바로가기</a>
          <a href="https://www.youtube.com/@dsr87450/videos" target="_blank" rel="noreferrer" className="text-sm border border-brand-primary text-brand-primary px-4 py-1.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors">영상 보기</a>
          <a href="https://www.youtube.com/@dsr87450/shorts" target="_blank" rel="noreferrer" className="text-sm border border-brand-primary text-brand-primary px-4 py-1.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors">Shorts 보기</a>
          <a href="https://www.youtube.com/@dsr87450/live" target="_blank" rel="noreferrer" className="text-sm border border-brand-primary text-brand-primary px-4 py-1.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors">실시간 보기</a>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200" role="tablist">
        <button className={`px-4 py-2 text-sm font-medium transition-colors ${tab === 'videos' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-dark'}`} type="button" onClick={() => setTab('videos')}>동영상</button>
        <button className={`px-4 py-2 text-sm font-medium transition-colors ${tab === 'shorts' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-dark'}`} type="button" onClick={() => setTab('shorts')}>쇼츠</button>
        <button className={`px-4 py-2 text-sm font-medium transition-colors ${tab === 'live' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-dark'}`} type="button" onClick={() => setTab('live')}>실시간</button>
      </div>

      {tab === 'videos' && (
        <div className="space-y-3">
          <div className="w-full aspect-video rounded-panel overflow-hidden bg-gray-100">
            <iframe
              className="w-full h-full"
              title="교회 유튜브 동영상"
              src="https://www.youtube.com/embed/videoseries?list=UU2nG7Wv46Ot9w8pwYdE4ajQ"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <p className="text-xs text-gray-400">최신 업로드 영상은 채널 영상 탭에서 확인할 수 있습니다.</p>
        </div>
      )}

      {tab === 'shorts' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!loading && channelHighlights.filter((item) => (item.tabType ?? '').toLowerCase() === 'shorts').length === 0 && (
              <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 text-sm text-gray-500">
                등록된 Shorts 안내가 없습니다.
              </article>
            )}
            {channelHighlights
              .filter((item) => (item.tabType ?? '').toLowerCase() === 'shorts')
              .map((item) => (
                <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2" key={`${item.tabType}-${item.orderNo ?? 0}-${item.title ?? 'shorts'}`}>
                  <h3 className="font-semibold text-brand-dark">{item.title ?? 'Shorts 안내'}</h3>
                  <p className="text-sm text-gray-600">{item.description ?? ''}</p>
                  <a href={item.linkUrl ?? '#'} target="_blank" rel="noreferrer" className="text-sm text-brand-primary hover:underline">{item.cta ?? '바로가기'}</a>
                </article>
              ))}
          </div>
          <p className="text-xs text-gray-400">Shorts는 유튜브 정책상 직접 임베드보다 채널 이동 방식이 더 안정적입니다.</p>
        </div>
      )}

      {tab === 'live' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!loading && channelHighlights.filter((item) => (item.tabType ?? '').toLowerCase() === 'live').length === 0 && (
              <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 text-sm text-gray-500">
                등록된 라이브 안내가 없습니다.
              </article>
            )}
            {channelHighlights
              .filter((item) => (item.tabType ?? '').toLowerCase() === 'live')
              .map((item) => (
                <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2" key={`${item.tabType}-${item.orderNo ?? 0}-${item.title ?? 'live'}`}>
                  <h3 className="font-semibold text-brand-dark">{item.title ?? '실시간 안내'}</h3>
                  <p className="text-sm text-gray-600">{item.description ?? ''}</p>
                  <a href={item.linkUrl ?? '#'} target="_blank" rel="noreferrer" className="text-sm text-brand-primary hover:underline">{item.cta ?? '바로가기'}</a>
                </article>
              ))}
          </div>
          <p className="text-xs text-gray-400">실시간 방송이 시작되면 유튜브 채널의 예약 링크로 즉시 연결됩니다.</p>
        </div>
      )}
    </section>
  );
}
