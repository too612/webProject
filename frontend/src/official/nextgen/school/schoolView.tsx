import { ArticleView } from "../../../common/article";
import { DetailPageShell } from "../../../common/ui";

export default function SchoolView() {
  return (
    <DetailPageShell titleSuffix="상세">
      <ArticleView
        basePath="/nextgen/school"
        menuKey="SCHOOL_GALLERY"
        templateCode="SCHOOL_GALLERY"
      />
    </DetailPageShell>
  );
}
