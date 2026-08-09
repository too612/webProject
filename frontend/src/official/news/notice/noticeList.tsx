/**
 * File Name   : noticeList
 * Description : 공지사항 목록 (ArticleList Wrapper)
 */

import { ArticleList } from "../../../common/article";
import { Link } from "react-router-dom";
import { Button, PageTitle } from "../../../common/ui";

export default function NoticeList() {
  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <PageTitle
            title="공지사항"
            description="교회의 중요한 안내와 공지 내용을 확인할 수 있습니다."
          />
          <Button asChild>
            <Link to="/news/notice/write">글쓰기</Link>
          </Button>
        </div>

        <div className="[&>section]:space-y-0 [&>section>div]:border-0 [&>section>div]:bg-transparent [&>section>div]:shadow-none [&>section>div]:p-0 [&>section>div]:space-y-4 [&>section>div>div:first-child]:hidden">
          <ArticleList
            menuKey="PINNABLE"
            templateCode="PINNABLE"
            basePath="/news/notice"
            hideDefaultWriteButton
          />
        </div>
      </div>
    </section>
  );
}
