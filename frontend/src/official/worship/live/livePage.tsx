/**
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
  const [tab, setTab] = useState<LiveTab>('videos');
  
  // 사용되지 않던 loading 변수를 구조 분해 할당에서 제외하여 제거했습니다.
  const { error, loadLiveItems } = useLiveItems();

  /****************************************************************************************************
   * initial/lifecycle method (onload 및 데이터 동기화)
   ****************************************************************************************************/

  useEffect(() => {
    loadLiveItems();
  }, [loadLiveItems]);

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
            채널 바로가기
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
            <button className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === 'videos' ? 'border-b-2 border-brand-primary text-brand-primary -mb-px' : 'text-slate-500 hover:text-slate-800'}`} type="button" onClick={() => setTab('videos')}>동영상</button>
            <button className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === 'shorts' ? 'border-b-2 border-brand-primary text-brand-primary -mb-px' : 'text-slate-500 hover:text-slate-800'}`} type="button" onClick={() => setTab('shorts')}>쇼츠</button>
            <button className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === 'live' ? 'border-b-2 border-brand-primary text-brand-primary -mb-px' : 'text-slate-500 hover:text-slate-800'}`} type="button" onClick={() => setTab('live')}>실시간</button>
          </div>

          {/* 1. 동영상 탭 (교회 채널 전체 업로드 리스트 자동 매핑) */}
          {tab === 'videos' && (
            <div className="space-y-4">
              <div className="w-full aspect-video rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                <iframe
                  className="w-full h-full"
                  title="다사랑교회 TV 예배 동영상"
                  src="https://www.youtube.com/embed/videoseries?list=UUkGtpE-xZYg4X6HWTEnH89w"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="material-icons text-sm">info</span>
                새로 업로드된 주일설교 및 교회 동영상이 자동으로 업데이트되어 표시됩니다.
              </p>
            </div>
          )}

          {/* 2. 쇼츠 탭 (안정적인 카드뷰 이동 방식으로 일원화) */}
          {tab === 'shorts' && (
            <div className="space-y-4 py-2">
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-lg p-6 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-icons text-red-600 text-2xl">play_circle_filled</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm">은혜의 말씀 Shorts 모아보기</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    다사랑교회 TV 채널에서 제공하는 다양한 숏폼 영상을<br />
                    유튜브 공식 채널에서 에러 없이 바로 시청해 보세요!
                  </p>
                </div>
                <a 
                  href="https://www.youtube.com/@dsr87450/shorts" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors w-full"
                >
                  Shorts 보러가기
                </a>
              </div>
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