/**
 * File Name   : sermonsWrite
 * Description : 설교 작성/수정 (ArticleWrite Wrapper)
 * -----------------------------------------------------------------------------
 * ArticleWrite가 URL의 rqstNo를 직접 읽으므로, articleId prop은 전달하지 않습니다.
 */

import { ArticleWrite } from "../../../common/article";

export default function SermonsWrite() {
  return <ArticleWrite templateCode="DEFAULT" basePath="/worship/sermons" />;
}
