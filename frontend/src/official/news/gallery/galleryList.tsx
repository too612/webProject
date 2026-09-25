/**
 * File Name   : galleryList
 * Description : 다사랑앨범 (갤러리 목록 - GALLERY 템플릿 전용)
 * -----------------------------------------------------------------------------
 * menuKey='GALLERY', templateCode='GALLERY'로 고정
 * 상단 활동사진/주보 탭 제거
 */
import { ArticleList } from "../../../common/article";
import { Link } from "react-router-dom";
import { Button, ListPageShell } from "../../../common/ui";

export default function GalleryList() {
  return (
    <ListPageShell
      actions={
        <Button asChild>
          <Link to="/news/gallery/write">앨범 등록</Link>
        </Button>
      }
    >
      <ArticleList
        menuKey="GALLERY"
        templateCode="GALLERY"
        basePath="/news/gallery"
        hideDefaultWriteButton
      />
    </ListPageShell>
  );
}
