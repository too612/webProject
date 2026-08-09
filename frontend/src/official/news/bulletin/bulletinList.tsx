/**
 * File Name   : bulletinList
 * Description : 주보 목록 (ArticleList Wrapper)
 * -----------------------------------------------------------------------------
 * SINGLE_IMAGE 템플릿을 사용하여 갤러리형 목록으로 표시합니다.
 * ★ 관리 모드 활성화 (수정/삭제 버튼 표시)
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArticleList } from "../../../common/article";
import { ImageLightbox } from "../../../common/article/ImageLightbox";
import type { ArticleItem } from "../../../common/article/ArticleModel";
import { articleApi } from "../../../common/article/ArticleApi";
import { Button, PageTitle } from "../../../common/ui";

export default function BulletinList() {
  const navigate = useNavigate();

  // 레이어 팝업 상태
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    items: ArticleItem[];
    initialIndex: number;
  }>({
    isOpen: false,
    items: [],
    initialIndex: 0,
  });

  // 갤러리 아이템 클릭 (레이어 팝업 열기)
  const handleGalleryItemClick = (
    item: ArticleItem,
    allItems: ArticleItem[],
  ) => {
    const index = allItems.findIndex((i) => i.articleId === item.articleId);
    setLightboxState({
      isOpen: true,
      items: allItems,
      initialIndex: index >= 0 ? index : 0,
    });
  };

  // 수정 버튼 클릭
  const handleEditClick = (item: ArticleItem) => {
    navigate(`/news/bulletin/write?rqstNo=${item.articleId}`);
  };

  // 삭제 버튼 클릭
  const handleDeleteClick = async (item: ArticleItem) => {
    if (!window.confirm(`"${item.title}" 게시글을 삭제하시겠습니까?`)) return;
    try {
      await articleApi.delete(item.articleId);
      toast.success("삭제되었습니다.");
      window.location.reload();
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <PageTitle
            title="주보"
            description="주간 예배 안내와 주보 내용을 한눈에 확인합니다."
          />
          <Button asChild>
            <Link to="/news/bulletin/write">주보 등록</Link>
          </Button>
        </div>
        <div className="[&>section]:space-y-0 [&>section>div]:border-0 [&>section>div]:bg-transparent [&>section>div]:shadow-none [&>section>div]:p-0 [&>section>div]:space-y-4 [&>section>div>div:first-child]:hidden">
          <ArticleList
            menuKey="SINGLE_IMAGE"
            templateCode="SINGLE_IMAGE"
            basePath="/news/bulletin"
            onGalleryItemClick={handleGalleryItemClick}
            onGalleryEditClick={handleEditClick}
            onGalleryDeleteClick={handleDeleteClick}
            hideDefaultWriteButton
          />
        </div>
      </div>

      {/* 레이어 팝업 */}
      <ImageLightbox
        items={lightboxState.items}
        initialIndex={lightboxState.initialIndex}
        isOpen={lightboxState.isOpen}
        onClose={() =>
          setLightboxState({ isOpen: false, items: [], initialIndex: 0 })
        }
      />
    </section>
  );
}
