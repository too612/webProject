/**
 * File Name   : bulletinWrite
 * Description : 주보 작성/수정 (ArticleWrite Wrapper)
 * -----------------------------------------------------------------------------
 * SINGLE_IMAGE 템플릿을 사용합니다 (에디터 없음, 이미지 1개만).
 */
import { ArticleWrite } from "../../../common/article";
import { FormPageShell } from "../../../common/ui";

export default function BulletinWrite() {
  return (
    <FormPageShell titleSuffix="작성">
      <ArticleWrite templateCode="SINGLE_IMAGE" basePath="/news/bulletin" />
    </FormPageShell>
  );
}
