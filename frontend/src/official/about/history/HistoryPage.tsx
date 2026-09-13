import { useEffect, useMemo, useRef, useState } from "react";
import { useHistoryContent } from "./historyHook";
import { DEFAULT_HISTORY_CONTENT } from "./historyModel";
import type {
  HistoryContent,
  HistoryEventRequest,
  HistoryRequest,
  HistoryYearRequest,
} from "./historyModel";
import { Button, PageTitle } from "../../../common/ui";
import { useAuthPermission } from "../../../common/auth/authPermission";
import { useMenu } from "../../../common/menu/menuHook";
import { getCurrentMenuPageContent } from "../../../common/menu/menuModel";
import { attachmentApi } from "../../../common/attachment";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../common/ui/accordion";
import { Input } from "../../../common/ui/input";

type HistoryRange = {
  key: string;
  label: string;
  matchYear: (year: number) => boolean;
};

const toYearNumber = (value: string): number | null => {
  const yearText = value.replace(/\D/g, "").slice(0, 4);
  const year = Number(yearText);
  return Number.isFinite(year) && year > 0 ? year : null;
};

const RANGE_TABS: HistoryRange[] = [
  { key: "all", label: "전체", matchYear: () => true },
  {
    key: "2020-current",
    label: "2020~현재",
    matchYear: (year) => year >= 2020,
  },
  {
    key: "2010-2019",
    label: "2010~2019",
    matchYear: (year) => year >= 2010 && year <= 2019,
  },
  {
    key: "2000-2009",
    label: "2000~2009",
    matchYear: (year) => year >= 2000 && year <= 2009,
  },
  {
    key: "1990-1999",
    label: "1990~1999",
    matchYear: (year) => year >= 1990 && year <= 1999,
  },
  {
    key: "1987-1989",
    label: "1987~1989",
    matchYear: (year) => year >= 1987 && year <= 1989,
  },
];

type HistoryEditState = {
  timeline: HistoryYearRequest[];
  deletedFileIds: (string | number)[];
};

// pastorPage 패턴과 동일하게 제목/요약은 하드코딩 표시용 상수로 고정
const resolveImageSrc = (value: string): string =>
  /^\d+$/.test(value) ? "/api/common/files/" + value + "/download" : value;

const toEditState = (content: HistoryContent | null): HistoryEditState => {
  if (!content) {
    return { timeline: [], deletedFileIds: [] };
  }
  return {
    timeline: (content.timeline ?? []).map((item) => ({
      year: item.year,
      events: (item.events ?? []).map((event) => ({
        date: event.date,
        description: event.description,
        images:
          event.imageIds && event.imageIds.length > 0
            ? event.imageIds.map(String)
            : (event.images ?? []),
      })),
    })),
    deletedFileIds: [],
  };
};

function EventImageManager({
  images,
  onImagesChange,
  onDeleteFile,
}: Readonly<{
  images: string[];
  onImagesChange: (next: string[]) => void;
  onDeleteFile: (fileId: string | number) => void;
}>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const meta = await attachmentApi.upload(
          file,
          "history",
          "history-temp",
          "attachment",
        );
        uploaded.push(String(meta.fileId));
      }
      onImagesChange([...images, ...uploaded]);
    } catch {
      // 업로드 실패는 저장 시 오류 메시지로 확인
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((src, index) => (
          <div key={`${src}-${index}`} className="relative">
            <img
              src={resolveImageSrc(src)}
              alt={`연혁 이미지 ${index + 1}`}
              className="h-20 w-28 border border-slate-200 bg-slate-100 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                onImagesChange(images.filter((_, i) => i !== index));
                if (/^\d+$/.test(src)) {
                  onDeleteFile(Number(src));
                }
              }}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
              aria-label="이미지 삭제"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="rounded-none border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {uploading ? "업로드 중..." : "+ 이미지 추가"}
      </button>
    </div>
  );
}

function HistoryEventEditor({
  event,
  index,
  onEventChange,
  onRemove,
  onDeleteFile,
}: Readonly<{
  event: HistoryEventRequest;
  index: number;
  onEventChange: (next: HistoryEventRequest) => void;
  onRemove: () => void;
  onDeleteFile: (fileId: string | number) => void;
}>) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">
          이벤트 {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold text-red-600 hover:underline"
        >
          이벤트 삭제
        </button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-[140px_minmax(0,1fr)]">
        <input
          type="text"
          value={event.date}
          onChange={(e) => onEventChange({ ...event, date: e.target.value })}
          placeholder="날짜 (예: 03.10)"
          className="border border-slate-300 px-2 py-1.5 text-sm"
        />
        <input
          type="text"
          value={event.description}
          onChange={(e) =>
            onEventChange({ ...event, description: e.target.value })
          }
          placeholder="이벤트 내용"
          className="border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div className="mt-3">
        <EventImageManager
          images={event.images ?? []}
          onImagesChange={(next) => onEventChange({ ...event, images: next })}
          onDeleteFile={onDeleteFile}
        />
      </div>
    </div>
  );
}

function HistoryYearEditor({
  year,
  index,
  onYearChange,
  onRemove,
  onDeleteFile,
}: Readonly<{
  year: HistoryYearRequest;
  index: number;
  onYearChange: (next: HistoryYearRequest) => void;
  onRemove: () => void;
  onDeleteFile: (fileId: string | number) => void;
}>) {
  return (
    <div className="space-y-3 border border-slate-200 bg-slate-50/50 p-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`year-${index}`}>
          <AccordionTrigger className="w-full py-1 text-left">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
                <span className="text-sm font-bold text-brand-primary">
                  연도 {index + 1}
                </span>
                <Input
                  value={year.year}
                  onChange={(e) =>
                    onYearChange({ ...year, year: e.target.value })
                  }
                  placeholder="연도 (예: 2026년)"
                  className="w-full max-w-xs border border-slate-300 px-2 py-1.5 text-sm md:w-52"
                />
              </div>
              <button
                type="button"
                onClick={onRemove}
                className="text-xs font-semibold text-red-600 hover:underline shrink-0 ml-2"
              >
                연도 삭제
              </button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-2">
              {year.events.map((event, eventIndex) => (
                <HistoryEventEditor
                  key={eventIndex}
                  event={event}
                  index={eventIndex}
                  onEventChange={(next) =>
                    onYearChange({
                      ...year,
                      events: year.events.map((e, i) =>
                        i === eventIndex ? next : e,
                      ),
                    })
                  }
                  onRemove={() =>
                    onYearChange({
                      ...year,
                      events: year.events.filter((_, i) => i !== eventIndex),
                    })
                  }
                  onDeleteFile={onDeleteFile}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  onYearChange({
                    ...year,
                    events: [
                      ...year.events,
                      { date: "", description: "", images: [] },
                    ],
                  })
                }
                className="rounded-none border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white"
              >
                + 이벤트 추가
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default function HistoryPage() {
  const { currentMenu, loading: menuLoading } = useMenu();
  const {
    historyContent,
    loading,
    error,
    loadHistoryContent,
    saveHistoryContent,
    removeHistoryContent,
  } = useHistoryContent();
  const { hasAction } = useAuthPermission("PROGRAM_HOME");
  const pageContent = getCurrentMenuPageContent(currentMenu, menuLoading);
  const canEdit = hasAction("edit");
  const canDelete = hasAction("delete");

  const [activeRangeKey, setActiveRangeKey] = useState("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editState, setEditState] = useState<HistoryEditState>({
    timeline: [],
    deletedFileIds: [],
  });
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHistoryContent();
  }, [loadHistoryContent]);

  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const content = historyContent ?? DEFAULT_HISTORY_CONTENT;
  const activeRange =
    RANGE_TABS.find((range) => range.key === activeRangeKey) ?? RANGE_TABS[0];

  const filteredTimeline = useMemo(
    () =>
      content.timeline.filter((item) => {
        const year = toYearNumber(item.year);
        return year === null
          ? activeRange.key === "all"
          : activeRange.matchYear(year);
      }),
    [content.timeline, activeRange],
  );

  const enterEditMode = () => {
    setEditState(toEditState(historyContent));
    setActionMessage(null);
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    setEditState({ timeline: [], deletedFileIds: [] });
    setActionMessage(null);
    setIsEditMode(false);
  };

  const buildRequest = (): HistoryRequest => ({
    timeline: editState.timeline,
    deletedFileIds: editState.deletedFileIds,
  });

  const handleSave = async () => {
    try {
      await saveHistoryContent(buildRequest());
      setActionMessage("연혁 정보를 저장했습니다.");
      setIsEditMode(false);
    } catch {
      // 오류 메시지는 훅의 error로 표시
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("연혁 정보를 모두 삭제하시겠습니까?")) {
      return;
    }
    try {
      await removeHistoryContent();
      setActionMessage("연혁 정보를 삭제했습니다.");
      setIsEditMode(false);
    } catch {
      // 오류 메시지는 훅의 error로 표시
    }
  };

  const updateYear = (index: number, next: HistoryYearRequest) => {
    setEditState((prev) => ({
      ...prev,
      timeline: prev.timeline.map((y, i) => (i === index ? next : y)),
    }));
  };

  const removeYear = (index: number) => {
    setEditState((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const addYear = () => {
    setEditState((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { year: "", events: [] }],
    }));
  };

  const handleDeleteFile = (fileId: string | number) => {
    setEditState((prev) => ({
      ...prev,
      deletedFileIds: [...prev.deletedFileIds, fileId],
    }));
  };

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <PageTitle
            title={pageContent.headline}
            description={pageContent.summary}
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

        {(loading || error) && (
          <div
            className={`px-3 py-2 text-sm border ${error ? "bg-red-50 text-red-700 border-red-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}
          >
            {error ?? "연혁 정보를 불러오는 중입니다."}
          </div>
        )}

        {actionMessage && (
          <div className="px-3 py-2 text-sm border bg-green-50 text-green-700 border-green-100">
            {actionMessage}
          </div>
        )}

        {isEditMode ? (
          <div className="space-y-4">
            <DndContext
              sensors={dndSensors}
              collisionDetection={closestCorners}
              onDragEnd={(event: DragEndEvent) => {
                const { active, over } = event;
                if (over && active.id !== over.id) {
                  setEditState((prev) => ({
                    ...prev,
                    timeline: arrayMove(
                      prev.timeline,
                      Number(active.id),
                      Number(over.id),
                    ),
                  }));
                }
              }}
            >
              <SortableContext
                items={editState.timeline.map((_, i) => String(i))}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {editState.timeline.map((year, index) => (
                    <HistoryYearEditor
                      key={index}
                      year={year}
                      index={index}
                      onYearChange={(next) => updateYear(index, next)}
                      onRemove={() => removeYear(index)}
                      onDeleteFile={handleDeleteFile}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addYear}
                    className="rounded-none border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    + 연도 추가
                  </button>
                </div>
              </SortableContext>
            </DndContext>

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
        ) : (
          <div className="space-y-4">
            <div>
              <ul className="grid grid-cols-2 md:grid-cols-6 w-full">
                {RANGE_TABS.map((range) => {
                  const isActive = range.key === activeRange.key;
                  return (
                    <li key={range.key} className="w-full">
                      <button
                        type="button"
                        onClick={() => setActiveRangeKey(range.key)}
                        className={`w-full px-2 py-3 text-sm border border-slate-200 transition-colors ${
                          isActive
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {range.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-3">
              {filteredTimeline.map((item) => (
                <div
                  key={item.year}
                  className="border border-slate-200 bg-white p-4 md:p-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)] gap-3 md:gap-5">
                    <div className="font-bold text-brand-primary text-lg md:text-xl leading-none">
                      {item.year}
                    </div>
                    <div className="space-y-2">
                      {item.events.map((event, eventIndex) => (
                        <div
                          key={`${item.year}-${event.date}-${eventIndex}`}
                          className="space-y-2 border-t border-slate-100 pt-2 first:border-t-0 first:pt-0"
                        >
                          <p className="text-sm text-gray-700 leading-relaxed">
                            <strong className="font-bold text-slate-900 mr-2">
                              {event.date}
                            </strong>
                            <span>{event.description}</span>
                          </p>
                          {event.images && event.images.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {event.images.map((imagePath) => (
                                <img
                                  key={imagePath}
                                  src={imagePath}
                                  alt={`${item.year} ${event.date} 연혁 사진`}
                                  className="w-full h-40 object-cover border border-slate-200 bg-slate-100"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {filteredTimeline.length === 0 && (
                <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  선택한 기간에 표시할 연혁 데이터가 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
