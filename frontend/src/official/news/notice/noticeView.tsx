/**
 * File Name   : noticeView
 * Description : 공지사항 상세 (ArticleView Wrapper)
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
