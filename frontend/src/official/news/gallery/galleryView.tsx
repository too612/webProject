/**
 * File Name   : galleryView
 * Description : 갤러리 상세 (ArticleView Wrapper)
 */
import { Link } from "react-router-dom";
import { ArticleView } from "../../../common/article";
import { Button } from "../../../common/ui";

export default function GalleryView() {
  return (
    <section className="space-y-5">
      <ArticleView
        basePath="/news/gallery"
        menuKey="GALLERY"
        templateCode="GALLERY"
        headerContent={
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
                다사랑 앨범
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                선택한 사진 게시물의 상세 내용을 확인합니다.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/news/gallery">목록</Link>
              </Button>
            </div>
          </div>
        }
        hideDefaultHeader
      />
    </section>
  );
}
