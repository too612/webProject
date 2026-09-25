import { Link } from "react-router-dom";
import { ArticleView } from "../../../common/article";
import { Button, DetailPageShell } from "../../../common/ui";
import {
  MEMBER_NEWS_BASE_PATH,
  MEMBER_NEWS_MENU_KEY,
  MEMBER_NEWS_TEMPLATE_CODE,
} from "./memberModel";

export default function MemberView() {
  return (
    <DetailPageShell
      titleSuffix="상세"
      actions={
        <Button asChild variant="outline">
          <Link to={MEMBER_NEWS_BASE_PATH}>목록</Link>
        </Button>
      }
    >
      <ArticleView
        basePath={MEMBER_NEWS_BASE_PATH}
        menuKey={MEMBER_NEWS_MENU_KEY}
        templateCode={MEMBER_NEWS_TEMPLATE_CODE}
        hideDefaultHeader
      />
    </DetailPageShell>
  );
}
