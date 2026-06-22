/**
 * File Name   : bulletinList
 * Description : 주보 목록 (ArticleList Wrapper)
 * -----------------------------------------------------------------------------
 * SINGLE_IMAGE 템플릿을 사용하여 갤러리형 목록으로 표시합니다.
 * ★ 관리 모드 활성화 (수정/삭제 버튼 표시)
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArticleList } from "../../../common/article";
import { ImageLightbox } from "../../../common/article/ImageLightbox";
import type { ArticleItem } from "../../../common/article/ArticleModel";
import { articleApi } from "../../../common/article/ArticleApi";

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
      alert("삭제되었습니다.");
      window.location.reload();
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <>
      <ArticleList
        menuKey="SINGLE_IMAGE"
        templateCode="SINGLE_IMAGE"
        basePath="/news/bulletin"
        onGalleryItemClick={handleGalleryItemClick}
        onGalleryEditClick={handleEditClick}
        onGalleryDeleteClick={handleDeleteClick}
      />

      {/* 레이어 팝업 */}
      <ImageLightbox
        items={lightboxState.items}
        initialIndex={lightboxState.initialIndex}
        isOpen={lightboxState.isOpen}
        onClose={() =>
          setLightboxState({ isOpen: false, items: [], initialIndex: 0 })
        }
      />
    </>
  );
}
