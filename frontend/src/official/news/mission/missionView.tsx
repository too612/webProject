import { ArticleView } from "../../../common/article";
import { DetailPageShell } from "../../../common/ui";

export default function MissionView() {
  return (
    <DetailPageShell titleSuffix="상세">
      <ArticleView
        basePath="/news/mission"
        menuKey="MISSION_GALLERY"
        templateCode="MISSION_GALLERY"
      />
    </DetailPageShell>
  );
}
