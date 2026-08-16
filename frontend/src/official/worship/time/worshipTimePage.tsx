/**
 * File Name   : worshipTimePage
 * Description : 예배시간 안내 조회 화면
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo } from "react";
import {
  BookOpen,
  Church,
  HandHeart,
  Info,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { useWorshipTimeItems } from "./worshipTimeHook";
import {
  WORSHIP_TIME_PAGE_DESCRIPTION,
  WORSHIP_TIME_PAGE_TITLE,
  WORSHIP_TIME_SECTIONS,
  type WorshipTimeItem,
  type WorshipTimeSectionKey,
} from "./worshipTimeModel";
import {
  PageTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../common/ui";

/****************************************************************************************************
 * config/constant method (상수, 타입가드, 값 보정 유틸)
 ****************************************************************************************************/

const SECTION_ICONS: Record<WorshipTimeSectionKey, LucideIcon> = {
  sunday: BookOpen,
  nextgen: Church,
  weekday: HandHeart,
};

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

  const sections = useMemo(() => {
    const sorted = [...items].sort(
      (left, right) => (left.orderNo ?? 999) - (right.orderNo ?? 999),
    );
    const assigned = new Set<WorshipTimeItem>();
    return WORSHIP_TIME_SECTIONS.map((section) => {
      const sectionItems = sorted.filter((item) => {
        if (assigned.has(item)) return false;
        if (!section.includes(item)) return false;
        assigned.add(item);
        return true;
      });
      return { ...section, items: sectionItems };
    });
  }, [items]);

  /****************************************************************************************************
   * render method (조회 모드 UI 렌더링)
   ****************************************************************************************************/

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-8">
        {/* 헤더 섹션: pastorPage 스타일 적용 */}
        <PageTitle
          title={WORSHIP_TIME_PAGE_TITLE}
          description={WORSHIP_TIME_PAGE_DESCRIPTION}
        />

        {error && (
          <div className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          !loading && (
            <div className="py-20 text-center text-slate-400 text-sm">
              등록된 예배 시간 정보가 없습니다.
            </div>
          )
        ) : (
          <div className="space-y-10">
            {sections.map((section) => {
              const SectionIcon = SECTION_ICONS[section.key];
              return (
                <div key={section.key} className="space-y-4">
                  {/* 섹션 제목 (아이콘 상단 중앙 + 제목 하단 중앙) */}
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <SectionIcon className="h-10 w-10 text-brand-primary" />
                    <h3 className="text-lg md:text-xl font-bold text-brand-dark">
                      {section.title}
                    </h3>
                  </div>

                  {/* 예배 시간 테이블 */}
                  <div className="overflow-hidden border border-slate-200 rounded-lg">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-200 hover:bg-transparent">
                          {section.headers.map((header) => (
                            <TableHead
                              key={header}
                              className="text-center text-[13px] font-semibold text-brand-dark whitespace-nowrap"
                            >
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {section.items.length === 0 ? (
                          <TableRow className="border-slate-200 hover:bg-transparent">
                            <TableCell
                              colSpan={section.headers.length}
                              className="h-20 text-center text-sm text-slate-400"
                            >
                              등록된 예배 시간 정보가 없습니다.
                            </TableCell>
                          </TableRow>
                        ) : (
                          section.items.map((item) => (
                            <TableRow
                              key={`${section.key}-${item.orderNo ?? 0}-${item.title ?? ""}`}
                              className="border-slate-200"
                            >
                              {section.key === "weekday" && (
                                <TableCell className="text-center text-sm font-medium text-brand-muted whitespace-nowrap">
                                  {item.category ?? "-"}
                                </TableCell>
                              )}
                              <TableCell className="text-center font-medium text-slate-800">
                                {item.title ?? item.category ?? "예배"}
                              </TableCell>
                              <TableCell className="text-center text-sm font-semibold text-brand-dark whitespace-nowrap">
                                {item.time ?? "-"}
                              </TableCell>
                              <TableCell className="text-center text-sm text-slate-600 whitespace-nowrap">
                                {item.location ? (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                    {item.location}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Info className="h-4 w-4" />
            예배 시간은 교회 일정에 따라 변경될 수 있습니다. 변경 시 공지사항을
            확인해 주세요.
          </p>
        </div>
      </div>
    </section>
  );
}
