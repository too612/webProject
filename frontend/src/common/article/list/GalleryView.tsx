import React from "react";
import type { ArticleItem } from "../ArticleModel";
import type { ArticleTemplateConfig } from "../config";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryViewProps {
  items: ArticleItem[];
  config: ArticleTemplateConfig;
  loading?: boolean;
  onItemClick: (item: ArticleItem, allItems: ArticleItem[]) => void;
  onEditClick?: (item: ArticleItem) => void;
  onDeleteClick?: (item: ArticleItem) => void;
  onReorder?: (items: ArticleItem[]) => void;
  enableDragDrop?: boolean;
}

interface SortableCardProps {
  item: ArticleItem;
  index: number;
  aspectRatioClass: string;
  onItemClick: (item: ArticleItem, allItems: ArticleItem[]) => void;
  onEditClick?: (item: ArticleItem) => void;
  onDeleteClick?: (item: ArticleItem) => void;
  onReorder?: (items: ArticleItem[]) => void;
  items: ArticleItem[];
  totalItems: number;
  slideCount: number;
  getThumbnailUrl: (item: ArticleItem) => string | null;
  allItems: ArticleItem[];
}

function SortableCard({
  item,
  index,
  aspectRatioClass,
  onItemClick,
  onEditClick,
  onDeleteClick,
  onReorder,
  items,
  totalItems,
  slideCount,
  getThumbnailUrl,
  allItems,
}: Readonly<SortableCardProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.articleId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const isSlide = item.templateCode === "SLIDE";
  const thumbnailUrl = getThumbnailUrl(item);

  const handleMoveUp = () => {
    if (!onReorder || index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    onReorder(newItems);
  };

  const handleMoveDown = () => {
    if (!onReorder || index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    onReorder(newItems);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div
          className={`${aspectRatioClass} relative overflow-hidden bg-slate-100 cursor-grab active:cursor-grabbing`}
          {...listeners}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
              <span className="material-icons text-6xl">image</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
            #{index + 1}
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-medium text-slate-800 truncate flex-1 mr-2 cursor-pointer"
              onClick={() => onItemClick(item, allItems)}
            >
              {item.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              {isSlide && onReorder && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveUp();
                    }}
                    disabled={index === 0}
                    className={`text-slate-400 hover:text-brand-primary transition-colors ${
                      index === 0 ? "opacity-30 cursor-not-allowed" : ""
                    }`}
                    title="위로 이동"
                  >
                    <span className="material-icons text-sm">arrow_upward</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveDown();
                    }}
                    disabled={index === totalItems - 1}
                    className={`text-slate-400 hover:text-brand-primary transition-colors ${
                      index === totalItems - 1
                        ? "opacity-30 cursor-not-allowed"
                        : ""
                    }`}
                    title="아래로 이동"
                  >
                    <span className="material-icons text-sm">
                      arrow_downward
                    </span>
                  </button>
                </>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick?.(item);
                }}
                className="text-slate-400 hover:text-brand-primary"
                title="수정"
              >
                <span className="material-icons text-sm">edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick?.(item);
                }}
                className="text-slate-400 hover:text-red-500"
                title="삭제"
              >
                <span className="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                isSlide
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600"
              }`}
            >
              {isSlide ? "슬라이드" : "팝업"}
            </span>
            {isSlide && onReorder && (
              <span className="text-xs text-slate-400">
                순서: {index + 1}/{slideCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryView({
  items,
  config,
  loading,
  onItemClick,
  onEditClick,
  onDeleteClick,
  onReorder,
  enableDragDrop = false,
}: Readonly<GalleryViewProps>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  if (loading) {
    return <div className="text-center py-8 text-gray-400">불러오는 중...</div>;
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        등록된 게시물이 없습니다.
      </div>
    );
  }

  const cardConfig = config.list.cardConfig || { aspectRatio: "4:3" };
  const aspectRatioClass =
    cardConfig.aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]";

  const getThumbnailUrl = (item: ArticleItem): string | null => {
    if (item.thumbnailFileId)
      return `/api/common/files/${item.thumbnailFileId}/download`;
    if (item.firstFileId)
      return `/api/common/files/${item.firstFileId}/download`;
    if (item.fileList?.length) {
      const firstFile = item.fileList[0];
      const ext =
        (firstFile.orgFileNm || "").split(".").pop()?.toLowerCase() || "";
      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext) &&
        firstFile.fileId
      ) {
        return `/api/common/files/${firstFile.fileId}/download`;
      }
    }
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;

    const oldIndex = items.findIndex((i) => i.articleId === active.id);
    const newIndex = items.findIndex((i) => i.articleId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    onReorder(newItems);
  };

  const slideCount = items.filter((i) => i.templateCode === "SLIDE").length;

  if (enableDragDrop && onReorder) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.articleId)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <SortableCard
                key={item.articleId}
                item={item}
                index={index}
                aspectRatioClass={aspectRatioClass}
                onItemClick={onItemClick}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                onReorder={onReorder}
                items={items}
                totalItems={items.length}
                slideCount={slideCount}
                getThumbnailUrl={getThumbnailUrl}
                allItems={items}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <SortableCard
          key={item.articleId}
          item={item}
          index={index}
          aspectRatioClass={aspectRatioClass}
          onItemClick={onItemClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onReorder={onReorder}
          items={items}
          totalItems={items.length}
          slideCount={slideCount}
          getThumbnailUrl={getThumbnailUrl}
          allItems={items}
        />
      ))}
    </div>
  );
}
