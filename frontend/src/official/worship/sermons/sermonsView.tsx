/**
 * File Name   : sermonsView
 * Description : 설교 상세 (ArticleView Wrapper)
 */
import { Link } from "react-router-dom";
import { ArticleView } from "../../../common/article";
import { Button } from "../../../common/ui";

export default function SermonsView() {
  return (
    <section className="space-y-5">
      <ArticleView
        basePath="/worship/sermons"
        menuKey="DEFAULT"
        templateCode="DEFAULT"
        headerContent={
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
                설교 말씀
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                선택한 설교 말씀의 상세 내용을 확인합니다.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/worship/sermons">목록</Link>
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
