/**
 * File Name   : noticeWrite
 * Description : 공지사항 작성/수정 (ArticleWrite Wrapper)
 * -----------------------------------------------------------------------------
 * ArticleWrite가 URL의 rqstNo를 직접 읽으므로, articleId prop은 전달하지 않습니다.
 */

import { ArticleWrite } from "../../../common/article";

export default function NoticeWrite() {
  return <ArticleWrite templateCode="PINNABLE" basePath="/news/notice" />;
}
