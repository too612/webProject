/**
 * File Name   : galleryList
 * Description : 다사랑앨범 (갤러리 목록 - GALLERY 템플릿 전용)
 * -----------------------------------------------------------------------------
 * menuKey='GALLERY', templateCode='GALLERY'로 고정
 * 상단 활동사진/주보 탭 제거
 */
import { ArticleList } from "../../../common/article";

export default function GalleryList() {
  return (
    <ArticleList
      menuKey="GALLERY"
      templateCode="GALLERY"
      basePath="/news/gallery"
    />
  );
}
