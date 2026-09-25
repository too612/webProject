/**
 * File Name   : sermonsView
 * Description : 설교 상세 (ArticleView Wrapper)
 */
import { Link } from "react-router-dom";
import { ArticleView } from "../../../common/article";
import { Button, DetailPageShell } from "../../../common/ui";

export default function SermonsView() {
  return (
    <DetailPageShell
      titleSuffix="상세"
      actions={
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/worship/sermons">목록</Link>
          </Button>
        </div>
      }
    >
      <ArticleView
        basePath="/worship/sermons"
        menuKey="DEFAULT"
        templateCode="DEFAULT"
        hideDefaultHeader
      />
    </DetailPageShell>
  );
}
