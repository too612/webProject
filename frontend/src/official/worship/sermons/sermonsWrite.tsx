/**
 * File Name   : sermonsWrite
 * Description : 설교 작성/수정 (ArticleWrite Wrapper)
 * -----------------------------------------------------------------------------
 * ArticleWrite가 URL의 rqstNo를 직접 읽으므로, articleId prop은 전달하지 않습니다.
 */

import { ArticleWrite } from "../../../common/article";
import { FormPageShell } from "../../../common/ui";

export default function SermonsWrite() {
  return (
    <FormPageShell titleSuffix="작성">
      <ArticleWrite templateCode="DEFAULT" basePath="/worship/sermons" />
    </FormPageShell>
  );
}
