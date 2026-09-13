import { ArticleWrite } from "../../../common/article";
import {
  MEMBER_NEWS_BASE_PATH,
  MEMBER_NEWS_TEMPLATE_CODE,
} from "./memberModel";

export default function MemberWrite() {
  return (
    <ArticleWrite
      templateCode={MEMBER_NEWS_TEMPLATE_CODE}
      basePath={MEMBER_NEWS_BASE_PATH}
    />
  );
}
