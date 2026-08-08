/**
 * File Name   : noticeView
 * Description : 공지사항 상세 (ArticleView Wrapper)
 * -----------------------------------------------------------------------------
 * 공통 ArticleView를 사용합니다.
 */
import { ArticleView } from "../../../common/article";

export default function NoticeView() {
  return (
    <ArticleView
      basePath="/news/notice"
      menuKey="PINNABLE"
      templateCode="PINNABLE"
    />
  );
}
