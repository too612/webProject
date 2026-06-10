/**
 * File Name   : worshipTimePage
 * Description : 예배시간 안내 조회 화면
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo } from 'react';
import { useWorshipTimeItems } from './worshipTimeHook';

/****************************************************************************************************
 * config/constant method (상수, 타입가드, 값 보정 유틸)
 ****************************************************************************************************/

const PAGE_DESCRIPTION = '하나님께 드리는 거룩한 예배와 모임의 시간을 안내드립니다.';

/****************************************************************************************************
 * component method (state, hook 초기화)
 ****************************************************************************************************/

export default function WorshipTimePage() {
  const { items, loading, error, loadWorshipTimeItems } = useWorshipTimeItems();

  /****************************************************************************************************
   * initial/lifecycle method (onload 및 데이터 동기화)
   ****************************************************************************************************/

  useEffect(() => {
    loadWorshipTimeItems();
  }, [loadWorshipTimeItems]);

  /****************************************************************************************************
   * logic method (업무 검증 및 값 계산)
   ****************************************************************************************************/

  const schedules = useMemo(
    () => [...items].sort((left, right) => (left.orderNo ?? 999) - (right.orderNo ?? 999)),
    [items]
  );

  /****************************************************************************************************
   * render method (조회 모드 UI 렌더링)
   ****************************************************************************************************/

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-8">
        {/* 헤더 섹션: pastorPage 스타일 적용 */}
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">예배시간</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
        </div>

        {error && (
          <div className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* 현대적인 리스트 디자인 */}
        <div className="divide-y divide-slate-100 border-t border-slate-200">
          {!loading && schedules.length === 0 && (
            <div className="py-20 text-center text-slate-400 text-sm">
              등록된 예배 시간 정보가 없습니다.
            </div>
          )}
          {schedules.map((item) => (
            <div 
              key={`schedule-${item.orderNo ?? 0}-${item.title ?? ''}`}
              className="group grid grid-cols-1 md:grid-cols-[160px_1fr] items-center py-5 md:py-6 px-2 hover:bg-slate-50/50 transition-colors"
            >
              <div className="text-brand-primary font-bold text-lg mb-1 md:mb-0">
                {item.time ?? '-'}
              </div>
              <div className="md:pl-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
                <div className="space-y-1 text-left">
                  <h3 className="text-base font-semibold text-slate-800">{item.title ?? item.category ?? '예배'}</h3>
                  <p className="text-sm text-slate-500">{item.note ?? ''}</p>
                </div>
                {item.location && (
                  <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                    <span className="material-icons text-sm">place</span>
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span className="material-icons text-sm">info</span>
            예배 시간은 교회 일정에 따라 변경될 수 있습니다. 변경 시 공지사항을 확인해 주세요.
          </p>
        </div>
      </div>
    </section>
  );
}
