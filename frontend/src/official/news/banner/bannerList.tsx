/**
 * File Name   : bannerList
 * Description : 배너 관리 (팝업/슬라이드 통합)
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArticleList } from "../../../common/article";
import { articleApi } from "../../../common/article/ArticleApi";
import type { ArticleItem } from "../../../common/article/ArticleModel";
import { useArticle } from "../../../common/article/ArticleHook";

export default function BannerList() {
  const navigate = useNavigate();
  const { loadList, page, searchType, keyword } = useArticle();
  const [filterType, setFilterType] = useState<"POPUP" | "SLIDE">("SLIDE");

  const handleEditClick = (item: ArticleItem) => {
    navigate(`/news/banner/write?rqstNo=${item.articleId}`);
  };

  const handleDeleteClick = async (item: ArticleItem) => {
    if (!confirm(`"${item.title}" 배너를 삭제하시겠습니까?`)) return;
    try {
      await articleApi.delete(item.articleId);
      alert("삭제되었습니다.");
      loadList({
        page,
        menuKey: "BANNER",
        templateCode: filterType,
        searchType: searchType || undefined,
        keyword: keyword || undefined,
      });
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제에 실패했습니다.");
    }
  };

  // ★ 순서 변경 (위/아래 버튼 방식)
  const handleReorderSlides = async (newItems: ArticleItem[]) => {
    const slideIds = newItems.map((item) => item.articleId);
    try {
      await articleApi.reorderSlides(slideIds);
      alert("순서가 변경되었습니다.");
      loadList({
        page,
        menuKey: "BANNER",
        templateCode: filterType,
        searchType: searchType || undefined,
        keyword: keyword || undefined,
      });
    } catch (e) {
      console.error("순서 변경 실패:", e);
      alert("순서 변경에 실패했습니다.");
    }
  };

  const handleExcelDownload = () => {
    alert("엑셀 다운로드 기능 (백엔드 API 연동 필요)");
  };

  const handleFilterChange = (type: "POPUP" | "SLIDE") => {
    setFilterType(type);
    loadList({
      page: 0,
      menuKey: "BANNER",
      templateCode: type,
      searchType: searchType || undefined,
      keyword: keyword || undefined,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-brand-dark">배너관리</h2>
          <p className="text-sm text-gray-500">
            팝업 및 슬라이드 배너를 통합 관리합니다.
          </p>
        </div>
        <Link
          to="/news/banner/write"
          className="inline-flex items-center bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
        >
          <span className="material-icons text-sm mr-1">add</span>
          배너 등록
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-md px-4 py-2.5">
        <span className="text-sm font-medium text-slate-600">배너유형</span>
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="filterType"
              value="POPUP"
              checked={filterType === "POPUP"}
              onChange={() => handleFilterChange("POPUP")}
            />
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
            팝업
          </label>
          <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="filterType"
              value="SLIDE"
              checked={filterType === "SLIDE"}
              onChange={() => handleFilterChange("SLIDE")}
            />
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            슬라이드
          </label>
        </div>
      </div>

      <ArticleList
        menuKey="BANNER"
        templateCode={filterType}
        basePath="/news/banner"
        onExcelDownload={handleExcelDownload}
        onGalleryEditClick={handleEditClick}
        onGalleryDeleteClick={handleDeleteClick}
        onReorderSlides={handleReorderSlides}
        enableDragDrop={filterType === "SLIDE"}
      />
    </div>
  );
}
