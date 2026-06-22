/**
 * File Name   : galleryWrite
 * Description : 갤러리 작성 (ArticleWrite Wrapper)
 */
import { useSearchParams } from "react-router-dom";
import { ArticleWrite } from "../../../common/article";

export default function GalleryWrite() {
  const [searchParams] = useSearchParams();
  const templateCode =
    searchParams.get("type") === "SINGLE_IMAGE" ? "SINGLE_IMAGE" : "GALLERY";

  return <ArticleWrite templateCode={templateCode} basePath="/news/gallery" />;
}
