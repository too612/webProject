import { ArticleWrite } from "../../../common/article";
import { FormPageShell } from "../../../common/ui";
import {
  MEMBER_NEWS_BASE_PATH,
  MEMBER_NEWS_TEMPLATE_CODE,
} from "./memberModel";

export default function MemberWrite() {
  return (
    <FormPageShell titleSuffix="작성">
      <ArticleWrite
        templateCode={MEMBER_NEWS_TEMPLATE_CODE}
        basePath={MEMBER_NEWS_BASE_PATH}
      />
    </FormPageShell>
  );
}
