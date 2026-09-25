import { ArticleView } from "../../../common/article";
import { DetailPageShell } from "../../../common/ui";

export default function YouthView() {
  return (
    <DetailPageShell titleSuffix="상세">
      <ArticleView
        basePath="/nextgen/youth"
        menuKey="YOUTH_GALLERY"
        templateCode="YOUTH_GALLERY"
      />
    </DetailPageShell>
  );
}
