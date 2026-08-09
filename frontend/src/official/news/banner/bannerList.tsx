/**
 * File Name   : bannerList
 * Description : 배너 관리 (팝업/슬라이드 통합)
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArticleList } from "../../../common/article";
import { articleApi } from "../../../common/article/ArticleApi";
import type { ArticleItem } from "../../../common/article/ArticleModel";
import { useArticle } from "../../../common/article/ArticleHook";
import { Button, PageTitle } from "../../../common/ui";

export default function BannerList() {
  const [refreshKey, setRefreshKey] = useState(0);
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
      toast.success("삭제되었습니다.");
      loadList({
        page,
        menuKey: "BANNER",
        templateCode: filterType,
        searchType: searchType || undefined,
        keyword: keyword || undefined,
      });
    } catch (e) {
      console.error("삭제 실패:", e);
      toast.error("삭제에 실패했습니다.");
    }
  };

  // ★ 순서 변경 (위/아래 버튼 방식)
  const handleReorderSlides = async (newItems: ArticleItem[]) => {
    const slideIds = newItems.map((item) => item.articleId);
    try {
      await articleApi.reorderSlides(slideIds);
      setRefreshKey((k) => k + 1);
      toast.success("순서가 변경되었습니다.");
      loadList({
        page,
        menuKey: "BANNER",
        templateCode: filterType,
        searchType: searchType || undefined,
        keyword: keyword || undefined,
      });
    } catch (e) {
      console.error("순서 변경 실패:", e);
      toast.error("순서 변경에 실패했습니다.");
    }
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
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <PageTitle
            title="배너 관리"
            description="메인 화면에 노출되는 배너를 관리합니다."
          />
          <Button asChild>
            <Link to={`/news/banner/write?type=${filterType}`}>배너등록</Link>
          </Button>
        </div>
        <div className="[&>section]:space-y-0 [&>section>div]:border-0 [&>section>div]:bg-transparent [&>section>div]:shadow-none [&>section>div]:p-0 [&>section>div]:space-y-4 [&>section>div>div:first-child]:hidden">
          <ArticleList
            menuKey="BANNER"
            templateCode={filterType}
            basePath="/news/banner"
            onGalleryEditClick={handleEditClick}
            onGalleryDeleteClick={handleDeleteClick}
            onReorderSlides={handleReorderSlides}
            enableDragDrop={filterType === "SLIDE"}
            refreshKey={refreshKey}
            hideDefaultWriteButton
            headerExtra={
              <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-md px-4 py-2.5">
                <span className="text-sm font-medium text-slate-600">
                  배너유형
                </span>
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
                    <span>팝업</span>
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
                    <span>슬라이드</span>
                  </label>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
