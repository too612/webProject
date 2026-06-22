/**
 * File Name   : galleryView
 * Description : 갤러리 상세 (ArticleView Wrapper)
 */
import { ArticleView } from "../../../common/article";

export default function GalleryView() {
  return (
    <ArticleView
      basePath="/news/gallery"
      menuKey="GALLERY"
      templateCode="GALLERY"
    />
  );
}
