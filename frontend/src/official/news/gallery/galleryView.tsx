/**
 * File Name   : galleryView
 * Description : 갤러리 상세 (ArticleView Wrapper)
 */
import { Link } from "react-router-dom";
import { ArticleView } from "../../../common/article";
import { Button, DetailPageShell } from "../../../common/ui";

export default function GalleryView() {
  return (
    <DetailPageShell
      titleSuffix="상세"
      actions={
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/news/gallery">목록</Link>
          </Button>
        </div>
      }
    >
      <ArticleView
        basePath="/news/gallery"
        menuKey="GALLERY"
        templateCode="GALLERY"
        hideDefaultHeader
      />
    </DetailPageShell>
  );
}
