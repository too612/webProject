/**
 * File Name   : noticeView
 * Description : 공지사항 상세 (ArticleView Wrapper)
 * -----------------------------------------------------------------------------
 * 공통 ArticleView를 사용합니다.
 */
import { Link } from "react-router-dom";
import { ArticleView } from "../../../common/article";
import { Button } from "../../../common/ui";

export default function NoticeView() {
  return (
    <section className="space-y-5">
      <ArticleView
        basePath="/news/notice"
        menuKey="PINNABLE"
        templateCode="PINNABLE"
        headerContent={
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
                공지사항
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                선택한 공지사항의 상세 내용을 확인합니다.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/news/notice">목록</Link>
              </Button>
            </div>
          </div>
        }
        hideDefaultHeader
        hideDefaultActions
      />
    </section>
  );
}
