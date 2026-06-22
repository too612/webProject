/**
 * File Name   : sermonsView
 * Description : 설교 상세 (ArticleView Wrapper)
 */
import { ArticleView } from "../../../common/article";

export default function SermonsView() {
  return (
    <ArticleView
      basePath="/worship/sermons"
      menuKey="DEFAULT"
      templateCode="DEFAULT"
    />
  );
}
