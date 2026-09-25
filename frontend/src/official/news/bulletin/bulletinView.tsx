/**
 * File Name   : bulletinView
 * Description : 주보 상세 (ArticleView Wrapper)
 * -----------------------------------------------------------------------------
 * SINGLE_IMAGE 템플릿의 imageOnly 모드를 사용합니다.
 */
import { ArticleView } from "../../../common/article";
import { DetailPageShell } from "../../../common/ui";

export default function BulletinView() {
  return (
    <DetailPageShell titleSuffix="상세">
      <ArticleView
        basePath="/news/bulletin"
        menuKey="SINGLE_IMAGE"
        templateCode="SINGLE_IMAGE"
      />
    </DetailPageShell>
  );
}
