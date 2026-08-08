/**
 * File Name   : noticeList
 * Description : 공지사항 목록 (ArticleList Wrapper)
 */

import { ArticleList } from "../../../common/article";

export default function NoticeList() {
  return (
    <ArticleList
      menuKey="PINNABLE"
      templateCode="PINNABLE"
      basePath="/news/notice"
    />
  );
}
