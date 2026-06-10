﻿/**
 * File Name   : livePage
 * Description : 오산 다사랑교회 TV 온라인 예배 안내 화면 (미사용 변수 제거 및 최적화 버전)
 * -----------------------------------------------------------------------------
 */

import { useEffect, useCallback, useState } from 'react';
import { useLiveItems } from './liveHook';
import type { LiveTab } from './liveModel';

/****************************************************************************************************
 * config/constant method (상수, 타입가드, 값 보정 유틸)
 ****************************************************************************************************/

const PAGE_DESCRIPTION = '유튜브 채널에서 예배 영상과 실시간 예배를 시청하실 수 있습니다.';

/****************************************************************************************************
 * component method (state, hook 초기화)
 ****************************************************************************************************/

export default function LivePage() {
  const [tab, setTab] = useState<LiveTab>('sunday_day');
  
  // 영상 목록(items)과 로딩 상태를 추가로 가져옵니다.
  const { items, loading, error, loadLiveItems } = useLiveItems();

  /****************************************************************************************************
   * initial/lifecycle method (onload 및 데이터 동기화)
   ****************************************************************************************************/

  useEffect(() => {
    if (tab !== 'live') {
      loadLiveItems(tab);
    }
  }, [tab, loadLiveItems]);

  /****************************************************************************************************
   * logic method (업무 검증 및 값 계산)
   ****************************************************************************************************/

  // 렌더링 성능 최적화를 위해 useCallback을 적용한 유튜브 채널 이동 핸들러
  const handleMoveToChannel = useCallback(() => {
    window.open('https://www.youtube.com/@dsr87450', '_blank', 'noreferrer');
  }, []);

  /****************************************************************************************************
   * render method (조회 모드 UI 렌더링)
   ****************************************************************************************************/

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        
        {/* 헤더 섹션: 정돈된 레이아웃 및 우측 디자인 통일 버튼 배치 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-l-4 border-brand-primary pl-4 md:pl-5 gap-4">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">온라인 예배</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
          </div>
          
          {/* 요청하신 편집 버튼 디자인 체계와 일치하는 채널 바로가기 버튼 */}
          <button
            type="button"
            className="px-4 py-2.5 text-sm rounded-md bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors inline-flex items-center justify-center gap-1 self-start sm:self-auto"
            onClick={handleMoveToChannel}
          >
            유튜브 채널 바로가기
          </button>
        </div>
        
        {/* 에러 피드백 영역 */}
        {error && (
          <div className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* 메인 비디오 영역 및 통일된 탭 구조 */}
        <div className="space-y-5 pt-2">
          {/* 탭 네비게이션 */}
          <div className="flex gap-0 border-b border-slate-200" role="tablist">
            <button className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === 'sunday_day' ? 'border-b-2 border-brand-primary text-brand-primary -mb-px' : 'text-slate-500 hover:text-slate-800'}`} type="button" onClick={() => setTab('sunday_day')}>주일낮예배</button>
            <button className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === 'sunday_evening' ? 'border-b-2 border-brand-primary text-brand-primary -mb-px' : 'text-slate-500 hover:text-slate-800'}`} type="button" onClick={() => setTab('sunday_evening')}>주일저녁예배</button>
            <button className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === 'friday' ? 'border-b-2 border-brand-primary text-brand-primary -mb-px' : 'text-slate-500 hover:text-slate-800'}`} type="button" onClick={() => setTab('friday')}>금요심야기도회</button>
            <button className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === 'live' ? 'border-b-2 border-brand-primary text-brand-primary -mb-px' : 'text-slate-500 hover:text-slate-800'}`} type="button" onClick={() => setTab('live')}>실시간</button>
          </div>

          {/* 1. 영상 목록 탭 (주일낮/저녁/금요 공통 그리드 사용) */}
          {tab !== 'live' && (
            <div className="space-y-6 min-h-[400px]">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="aspect-video bg-slate-100 rounded-md" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  {items && items.length > 0 ? (
                    items.map((item, index) => (
                    <a 
                      key={index} 
                      href={item.linkUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group block space-y-3"
                    >
                      <div className="relative aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-brand-primary transition-colors">{item.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                    </a>
                    ))
                  ) : (
                    <div className="col-span-2 py-10 text-center bg-slate-50 rounded-md border border-dashed border-slate-200">
                      <p className="text-sm text-slate-500">불러올 수 있는 영상이 없습니다.</p>
                      <p className="text-xs text-slate-400 mt-1">유튜브 채널에서 직접 확인해 주세요.</p>
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="material-icons text-sm">info</span>
                해당 재생목록의 최신 영상이 자동으로 업데이트되어 표시됩니다.
              </p>
            </div>
          )}

          {/* 3. 실시간 탭 (실시간 라이브 송출 전용) */}
          {tab === 'live' && (
            <div className="space-y-4">
              <div className="w-full aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                <iframe
                  className="w-full h-full"
                  title="다사랑교회 TV 실시간 예배"
                  src="https://www.youtube.com/embed/live_stream?channel=UCkGtpE-xZYg4X6HWTEnH89w"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="material-icons text-sm">info</span>
                  실시간 스트리밍 시간에 맞춰 방송이 시작됩니다. (그 외 시간엔 플레이어 에러가 발생할 수 있습니다.)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}