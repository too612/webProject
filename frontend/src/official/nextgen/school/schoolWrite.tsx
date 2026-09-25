import { ArticleWrite } from "../../../common/article";
import { FormPageShell } from "../../../common/ui";

export default function SchoolWrite() {
  return (
    <FormPageShell titleSuffix="작성">
      <ArticleWrite templateCode="SCHOOL_GALLERY" basePath="/nextgen/school" />
    </FormPageShell>
  );
}
