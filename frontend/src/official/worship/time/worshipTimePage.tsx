/**
 * File Name   : worshipTimePage
 * Description : 예배시간 안내 조회 화면
 * -----------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";
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
  WORSHIP_TIME_SECTIONS,
  type WorshipTimeItem,
  type WorshipTimeSectionKey,
} from "./worshipTimeModel";
import {
  Button,
  PageTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../common/ui";
import { useAuthPermission } from "../../../common/auth/authPermission";
import { useMenu } from "../../../common/menu/menuHook";
import { getCurrentMenuPageContent } from "../../../common/menu/menuModel";

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
  const { currentMenu, loading: menuLoading } = useMenu();
  const {
    items,
    loading,
    error,
    loadWorshipTimeItems,
    saveWorshipTimeItems,
    removeWorshipTimeItems,
  } = useWorshipTimeItems();
  const { hasAction } = useAuthPermission("PROGRAM_HOME");
  const canEdit = hasAction("edit");
  const canDelete = hasAction("delete");

  const [isEditMode, setIsEditMode] = useState(false);
  const [editItems, setEditItems] = useState<WorshipTimeItem[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

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
   * logic method (편집 모드 핸들러)
   ****************************************************************************************************/

  const enterEditMode = () => {
    setEditItems(items.map((item) => ({ ...item })));
    setActionMessage(null);
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    setEditItems([]);
    setActionMessage(null);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    try {
      const payload = editItems.map((item, index) => ({
        ...item,
        orderNo: index + 1,
      }));
      await saveWorshipTimeItems(payload);
      setActionMessage("예배시간 정보를 저장했습니다.");
      setIsEditMode(false);
    } catch {
      // 오류 메시지는 훅의 error로 표시
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("예배시간 정보를 모두 삭제하시겠습니까?")) {
      return;
    }
    try {
      await removeWorshipTimeItems();
      setActionMessage("예배시간 정보를 삭제했습니다.");
      setIsEditMode(false);
    } catch {
      // 오류 메시지는 훅의 error로 표시
    }
  };

  const updateItem = (index: number, patch: Partial<WorshipTimeItem>) => {
    setEditItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => {
    setEditItems((prev) => [
      ...prev,
      { category: "", title: "", time: "", note: "", location: "" },
    ]);
  };

  const removeItem = (index: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setEditItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) {
        return prev;
      }
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  /****************************************************************************************************
   * render method (조회/편집 모드 UI 렌더링)
   ****************************************************************************************************/

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-8">
        {/* 헤더 섹션: pastorPage 스타일 적용 */}
        <div className="flex items-start justify-between gap-3">
          <PageTitle
            title={getCurrentMenuPageContent(currentMenu, menuLoading).headline}
            description={
              getCurrentMenuPageContent(currentMenu, menuLoading).summary
            }
          />
          {!isEditMode && canEdit && (
            <Button
              variant="outline"
              onClick={enterEditMode}
              className="shrink-0"
            >
              편집
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="rounded-none bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
            {actionMessage}
          </div>
        )}

        {isEditMode ? (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="text-center text-[13px] font-semibold text-brand-dark whitespace-nowrap">
                      구분
                    </TableHead>
                    <TableHead className="text-center text-[13px] font-semibold text-brand-dark whitespace-nowrap">
                      예배명
                    </TableHead>
                    <TableHead className="text-center text-[13px] font-semibold text-brand-dark whitespace-nowrap">
                      시간
                    </TableHead>
                    <TableHead className="text-center text-[13px] font-semibold text-brand-dark whitespace-nowrap">
                      비고
                    </TableHead>
                    <TableHead className="text-center text-[13px] font-semibold text-brand-dark whitespace-nowrap">
                      장소
                    </TableHead>
                    <TableHead className="text-center text-[13px] font-semibold text-brand-dark whitespace-nowrap w-28">
                      정렬
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editItems.length === 0 ? (
                    <TableRow className="border-slate-200 hover:bg-transparent">
                      <TableCell
                        colSpan={6}
                        className="h-20 text-center text-sm text-slate-400"
                      >
                        등록된 예배 시간 정보가 없습니다. 아래에서 추가하세요.
                      </TableCell>
                    </TableRow>
                  ) : (
                    editItems.map((item, index) => (
                      <TableRow key={index} className="border-slate-200">
                        <TableCell>
                          <input
                            type="text"
                            value={item.category ?? ""}
                            onChange={(e) =>
                              updateItem(index, { category: e.target.value })
                            }
                            placeholder="구분"
                            className="w-24 border border-slate-300 px-2 py-1 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            value={item.title ?? ""}
                            onChange={(e) =>
                              updateItem(index, { title: e.target.value })
                            }
                            placeholder="예배명"
                            className="w-40 border border-slate-300 px-2 py-1 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            value={item.time ?? ""}
                            onChange={(e) =>
                              updateItem(index, { time: e.target.value })
                            }
                            placeholder="시간"
                            className="w-32 border border-slate-300 px-2 py-1 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            value={item.note ?? ""}
                            onChange={(e) =>
                              updateItem(index, { note: e.target.value })
                            }
                            placeholder="비고"
                            className="w-40 border border-slate-300 px-2 py-1 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            value={item.location ?? ""}
                            onChange={(e) =>
                              updateItem(index, { location: e.target.value })
                            }
                            placeholder="장소"
                            className="w-24 border border-slate-300 px-2 py-1 text-sm"
                          />
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => moveItem(index, -1)}
                            className="px-1.5 py-0.5 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            aria-label="위로"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(index, 1)}
                            className="px-1.5 py-0.5 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            aria-label="아래로"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="ml-1 px-1.5 py-0.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            삭제
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="rounded-none border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              + 예배 시간 추가
            </button>

            <div className="flex items-center gap-2 border-t border-slate-200 pt-4">
              <Button onClick={handleSave} disabled={loading}>
                저장
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                취소
              </Button>
              {canDelete && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  전체 삭제
                </Button>
              )}
            </div>
          </div>
        ) : items.length === 0 ? (
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
