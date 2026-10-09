/**
 * File Name   : worshipTimeWrite
 * Description : 예배시간 안내 편집 화면
 * -----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthPermission } from "../../../common/auth/authPermission";
import {
  Button,
  FormPageShell,
  Input,
  Label,
  Textarea,
} from "../../../common/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../common/ui/accordion";
import { useWorshipTimeItems } from "./worshipTimeHook";
import type { WorshipTimeItem } from "./worshipTimeModel";

type EditItem = {
  key: number;
  value: WorshipTimeItem;
};

const EDIT_FIELDS = [
  { key: "title", label: "예배명", placeholder: "예: 주일오전 축제예배" },
  { key: "time", label: "시간", placeholder: "예: 매주 주일 오전 10:00" },
  { key: "location", label: "장소", placeholder: "예: 본당" },
  { key: "category", label: "구분", placeholder: "예: 기도회, 성경공부" },
] as const;

export default function WorshipTimeWrite() {
  const navigate = useNavigate();
  const {
    items,
    loading,
    loaded,
    error,
    loadWorshipTimeItems,
    saveWorshipTimeItems,
    removeWorshipTimeItems,
  } = useWorshipTimeItems();
  const { hasAction } = useAuthPermission("PROGRAM_HOME");
  const canEdit = hasAction("edit");
  const canDelete = hasAction("delete");
  const [editItems, setEditItems] = useState<EditItem[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const nextKey = useRef(0);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (canEdit) {
      void loadWorshipTimeItems();
    }
  }, [canEdit, loadWorshipTimeItems]);

  useEffect(() => {
    setEditItems(items.map((item, key) => ({ key, value: { ...item } })));
    nextKey.current = items.length;
    setExpandedKeys(items.length > 0 ? ["0"] : []);
  }, [items]);

  const updateItem = (key: number, patch: Partial<WorshipTimeItem>) => {
    setEditItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, value: { ...item.value, ...patch } } : item,
      ),
    );
  };

  const addItem = () => {
    const key = nextKey.current++;
    setEditItems((prev) => [
      ...prev,
      {
        key,
        value: { category: "", title: "", time: "", note: "", location: "" },
      },
    ]);
    setExpandedKeys((prev) => [...prev, String(key)]);
  };

  const removeItem = (key: number) => {
    setEditItems((prev) => prev.filter((item) => item.key !== key));
    setExpandedKeys((prev) => prev.filter((value) => value !== String(key)));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setEditItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) {
        return prev;
      }
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    setActionError(null);
    try {
      await saveWorshipTimeItems(
        editItems.map((item, index) => ({
          ...item.value,
          orderNo: index + 1,
        })),
      );
      toast.success("예배시간 정보를 저장했습니다.");
      navigate("/worship/time");
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "저장 중 오류가 발생했습니다.",
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("예배시간 정보를 모두 삭제하시겠습니까?")) {
      return;
    }
    setActionError(null);
    try {
      await removeWorshipTimeItems();
      toast.success("예배시간 정보를 삭제했습니다.");
      navigate("/worship/time");
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "삭제 중 오류가 발생했습니다.",
      );
    }
  };

  if (!canEdit) {
    return <Navigate to="/worship/time" replace />;
  }

  return (
    <FormPageShell titleSuffix="편집">
      {(actionError || error) && (
        <div
          role="alert"
          className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700"
        >
          {actionError ?? error}
          {!loaded && (
            <Button
              variant="outline"
              onClick={() => void loadWorshipTimeItems()}
              disabled={loading}
              className="ml-3"
            >
              다시 시도
            </Button>
          )}
        </div>
      )}
      {!loaded ? (
        loading && (
          <p className="text-sm text-slate-500">
            예배시간 정보를 불러오는 중입니다.
          </p>
        )
      ) : (
        <fieldset disabled={loading} className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-brand-dark">
                예배 시간 {editItems.length}개
              </p>
              <p className="text-xs text-slate-500">
                예배를 펼쳐 내용을 수정하고, 화살표로 순서를 변경하세요.
              </p>
            </div>
            {editItems.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExpandedKeys(editItems.map((item) => String(item.key)))
                  }
                >
                  모두 펼치기
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedKeys([])}
                >
                  모두 접기
                </Button>
              </div>
            )}
          </div>
          {editItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              등록된 예배 시간 정보가 없습니다. 아래에서 추가하세요.
            </div>
          ) : (
            <Accordion
              type="multiple"
              value={expandedKeys}
              onValueChange={setExpandedKeys}
              className="space-y-3"
            >
              {editItems.map(({ key, value: item }, index) => (
                <AccordionItem
                  key={key}
                  value={String(key)}
                  data-worship-item
                  className="rounded-lg border border-slate-200 bg-white"
                >
                  <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <AccordionTrigger className="gap-3 py-1 text-left hover:no-underline">
                        <span className="min-w-0 space-y-2">
                          <span className="flex items-start gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500">
                              {index + 1}
                            </span>
                            <span className="break-words font-semibold text-brand-dark">
                              {item.title?.trim() || "새 예배"}
                            </span>
                          </span>
                          <span className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-normal text-slate-500">
                            <span className="inline-flex min-w-0 items-center gap-1">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span className="break-all">
                                {item.time?.trim() || "시간 미입력"}
                              </span>
                            </span>
                            <span className="inline-flex min-w-0 items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="break-all">
                                {item.location?.trim() || "장소 미입력"}
                              </span>
                            </span>
                          </span>
                        </span>
                      </AccordionTrigger>
                    </div>
                    <div className="flex shrink-0 items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        aria-label="위로"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === editItems.length - 1}
                        aria-label="아래로"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(key)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        삭제
                      </Button>
                    </div>
                  </div>
                  <AccordionContent className="border-t border-slate-100 px-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {EDIT_FIELDS.map((field) => (
                        <div key={field.key} className="min-w-0 space-y-2">
                          <Label htmlFor={`worship-${key}-${field.key}`}>
                            {field.label}
                          </Label>
                          <Input
                            id={`worship-${key}-${field.key}`}
                            value={item[field.key] ?? ""}
                            onChange={(e) =>
                              updateItem(key, { [field.key]: e.target.value })
                            }
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`worship-${key}-note`}>비고</Label>
                        <Textarea
                          id={`worship-${key}-note`}
                          value={item.note ?? ""}
                          onChange={(e) =>
                            updateItem(key, { note: e.target.value })
                          }
                          placeholder="예배 관련 안내나 참고사항을 입력하세요."
                          rows={2}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <Button
            variant="outline"
            onClick={addItem}
            className="w-full border-dashed"
            aria-label="+ 예배 시간 추가"
          >
            <Plus className="mr-2 h-4 w-4" />
            예배 시간 추가
          </Button>
        </fieldset>
      )}
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white py-4">
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={loading || !loaded}>
            저장
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/worship/time")}
            disabled={loading}
          >
            취소
          </Button>
        </div>
        {loaded && (
          <div className="flex items-center gap-2">
            {canDelete && (
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                전체 삭제
              </Button>
            )}
          </div>
        )}
      </div>
    </FormPageShell>
  );
}
