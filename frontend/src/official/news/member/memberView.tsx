import { Link } from "react-router-dom";
import { ArticleView } from "../../../common/article";
import { Button } from "../../../common/ui";
import {
  MEMBER_NEWS_BASE_PATH,
  MEMBER_NEWS_MENU_KEY,
  MEMBER_NEWS_TEMPLATE_CODE,
} from "./memberModel";

export default function MemberView() {
  return (
    <section className="space-y-5">
      <ArticleView
        basePath={MEMBER_NEWS_BASE_PATH}
        menuKey={MEMBER_NEWS_MENU_KEY}
        templateCode={MEMBER_NEWS_TEMPLATE_CODE}
        headerContent={
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
                성도소식
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                성도들의 기쁜 소식과 위로의 소식을 확인합니다.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to={MEMBER_NEWS_BASE_PATH}>목록</Link>
            </Button>
          </div>
        }
        hideDefaultHeader
      />
    </section>
  );
}
