/**
 * File Name   : galleryList
 * Description : 다사랑앨범 (갤러리 목록 - GALLERY 템플릿 전용)
 * -----------------------------------------------------------------------------
 * menuKey='GALLERY', templateCode='GALLERY'로 고정
 * 상단 활동사진/주보 탭 제거
 */
import { ArticleList } from "../../../common/article";
import { Link } from "react-router-dom";
import { Button, PageTitle } from "../../../common/ui";

export default function GalleryList() {
  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <PageTitle
            title="다사랑 앨범"
            description="교회 활동과 모임의 사진을 한눈에 볼 수 있습니다."
          />
          <Button asChild>
            <Link to="/news/gallery/write">앨범 등록</Link>
          </Button>
        </div>
        <div className="[&>section]:space-y-0 [&>section>div]:border-0 [&>section>div]:bg-transparent [&>section>div]:shadow-none [&>section>div]:p-0 [&>section>div]:space-y-4 [&>section>div>div:first-child]:hidden">
          <ArticleList
            menuKey="GALLERY"
            templateCode="GALLERY"
            basePath="/news/gallery"
            hideDefaultWriteButton
          />
        </div>
      </div>
    </section>
  );
}
