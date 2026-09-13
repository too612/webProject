import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, PageTitle } from "../../../common/ui";
import { useAuthPermission } from "../../../common/auth/authPermission";
import { useMenu } from "../../../common/menu/menuHook";
import { getCurrentMenuPageContent } from "../../../common/menu/menuModel";
import { attachmentApi } from "../../../common/attachment";
import { useHistoryContent } from "./historyHook";
import type {
  HistoryContent,
  HistoryRequest,
  HistoryYearRequest,
} from "./historyModel";
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

type HistoryEditState = {
  timeline: HistoryYearRequest[];
  deletedFileIds: (string | number)[];
};

const resolveImageSrc = (value: string): string =>
  /^\d+$/.test(value) ? `/api/common/files/${value}/download` : value;

const toEditState = (content: HistoryContent | null): HistoryEditState => ({
  timeline: (content?.timeline ?? []).map((item) => ({
    year: item.year,
    historyId: undefined,
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
});

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
    if (!files || files.length === 0) return;
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
      if (fileInputRef.current) fileInputRef.current.value = "";
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
                if (/^\d+$/.test(src)) onDeleteFile(Number(src));
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
                <GripVertical className="h-4 w-4 cursor-grab text-slate-400" />
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
                className="ml-2 shrink-0 text-xs font-semibold text-red-600 hover:underline"
              >
                연도 삭제
              </button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-2">
              {year.events.map((event, eventIndex) => (
                <div
                  key={`${event.date}-${event.description}-${(event.images ?? []).join(",")}`}
                  className="rounded-md border border-slate-200 bg-white p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      이벤트 {eventIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onYearChange({
                          ...year,
                          events: year.events.filter(
                            (_, i) => i !== eventIndex,
                          ),
                        })
                      }
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      이벤트 삭제
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-[140px_minmax(0,1fr)]">
                    <input
                      type="text"
                      value={event.date}
                      onChange={(e) =>
                        onYearChange({
                          ...year,
                          events: year.events.map((item, i) =>
                            i === eventIndex
                              ? { ...item, date: e.target.value }
                              : item,
                          ),
                        })
                      }
                      placeholder="날짜 (예: 03.10)"
                      className="border border-slate-300 px-2 py-1.5 text-sm"
                    />
                    <input
                      type="text"
                      value={event.description}
                      onChange={(e) =>
                        onYearChange({
                          ...year,
                          events: year.events.map((item, i) =>
                            i === eventIndex
                              ? { ...item, description: e.target.value }
                              : item,
                          ),
                        })
                      }
                      placeholder="이벤트 내용"
                      className="border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="mt-3">
                    <EventImageManager
                      images={event.images ?? []}
                      onImagesChange={(images) =>
                        onYearChange({
                          ...year,
                          events: year.events.map((item, i) =>
                            i === eventIndex ? { ...item, images } : item,
                          ),
                        })
                      }
                      onDeleteFile={onDeleteFile}
                    />
                  </div>
                </div>
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

export default function HistoryPageWrite() {
  const navigate = useNavigate();
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
  const [editState, setEditState] = useState<HistoryEditState>({
    timeline: [],
    deletedFileIds: [],
  });
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHistoryContent();
  }, [loadHistoryContent]);

  useEffect(() => {
    if (!loading) setEditState(toEditState(historyContent));
  }, [historyContent, loading]);

  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const updateYear = (index: number, next: HistoryYearRequest) => {
    setEditState((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item, i) => (i === index ? next : item)),
    }));
  };

  const buildRequest = (): HistoryRequest => ({
    timeline: editState.timeline,
    deletedFileIds: editState.deletedFileIds,
  });

  const handleSave = async () => {
    try {
      await saveHistoryContent(buildRequest());
      setActionMessage("연혁 정보를 저장했습니다.");
      navigate("/about/history");
    } catch {
      // 오류 메시지는 훅의 error로 표시
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("연혁 정보를 모두 삭제하시겠습니까?")) return;
    try {
      await removeHistoryContent();
      setActionMessage("연혁 정보를 삭제했습니다.");
      navigate("/about/history");
    } catch {
      // 오류 메시지는 훅의 error로 표시
    }
  };

  return (
    <section className="space-y-5">
      <div className="space-y-5 rounded-none border border-slate-200 bg-white p-6 shadow-panel md:p-7">
        <div className="flex items-start justify-between gap-3">
          <PageTitle
            title={pageContent.headline}
            description={pageContent.summary}
          />
          <Button variant="outline" onClick={() => navigate("/about/history")}>
            목록
          </Button>
        </div>
        {(loading || error) && (
          <div
            className={`border px-3 py-2 text-sm ${error ? "border-red-100 bg-red-50 text-red-700" : "border-blue-100 bg-blue-50 text-blue-700"}`}
          >
            {error ?? "연혁 정보를 불러오는 중입니다."}
          </div>
        )}
        {actionMessage && (
          <div className="border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-700">
            {actionMessage}
          </div>
        )}
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
            items={editState.timeline.map((_, index) => String(index))}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {editState.timeline.map((year, index) => (
                <HistoryYearEditor
                  key={`${year.historyId ?? "new"}-${year.year}`}
                  year={year}
                  index={index}
                  onYearChange={(next) => updateYear(index, next)}
                  onRemove={() =>
                    setEditState((prev) => ({
                      ...prev,
                      timeline: prev.timeline.filter((_, i) => i !== index),
                    }))
                  }
                  onDeleteFile={(fileId) =>
                    setEditState((prev) => ({
                      ...prev,
                      deletedFileIds: [...prev.deletedFileIds, fileId],
                    }))
                  }
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setEditState((prev) => ({
                    ...prev,
                    timeline: [...prev.timeline, { year: "", events: [] }],
                  }))
                }
                className="rounded-none border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                + 연도 추가
              </button>
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex items-center gap-2 border-t border-slate-200 pt-4">
          <Button onClick={handleSave} disabled={loading || !hasAction("edit")}>
            저장
          </Button>
          <Button variant="outline" onClick={() => navigate("/about/history")}>
            취소
          </Button>
          {hasAction("delete") && (
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
    </section>
  );
}
