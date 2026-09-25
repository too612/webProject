/**
 * File Name   : galleryWrite
 * Description : 갤러리 작성 (ArticleWrite Wrapper)
 */
import { useSearchParams } from "react-router-dom";
import { ArticleWrite } from "../../../common/article";
import { FormPageShell } from "../../../common/ui";

export default function GalleryWrite() {
  const [searchParams] = useSearchParams();
  const templateCode =
    searchParams.get("type") === "SINGLE_IMAGE" ? "SINGLE_IMAGE" : "GALLERY";

  return (
    <FormPageShell titleSuffix="작성">
      <ArticleWrite templateCode={templateCode} basePath="/news/gallery" />
    </FormPageShell>
  );
}
