/**
 * File Name   : noticeView
 * Description : 공지사항 상세 (ArticleView Wrapper)
 * -----------------------------------------------------------------------------
 * 공통 ArticleView를 사용합니다.
 */
import { Link } from "react-router-dom";
import { ArticleView } from "../../../common/article";
import { Button, DetailPageShell } from "../../../common/ui";

export default function NoticeView() {
  return (
    <DetailPageShell
      titleSuffix="상세"
      actions={
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/news/notice">목록</Link>
          </Button>
        </div>
      }
    >
      <ArticleView
        basePath="/news/notice"
        menuKey="PINNABLE"
        templateCode="PINNABLE"
        hideDefaultHeader
      />
    </DetailPageShell>
  );
}
