/**
 * File Name   : noticeList
 * Description : 공지사항 목록 (ArticleList Wrapper)
 */

import { ArticleList } from "../../../common/article";
import { Link } from "react-router-dom";
import { Button, ListPageShell } from "../../../common/ui";

export default function NoticeList() {
  return (
    <ListPageShell
      actions={
        <Button asChild>
          <Link to="/news/notice/write">글쓰기</Link>
        </Button>
      }
    >
      <ArticleList
        menuKey="PINNABLE"
        templateCode="PINNABLE"
        basePath="/news/notice"
        hideDefaultWriteButton
      />
    </ListPageShell>
  );
}
