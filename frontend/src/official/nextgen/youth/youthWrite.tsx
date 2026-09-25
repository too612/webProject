import { ArticleWrite } from "../../../common/article";
import { FormPageShell } from "../../../common/ui";

export default function YouthWrite() {
  return (
    <FormPageShell titleSuffix="작성">
      <ArticleWrite templateCode="YOUTH_GALLERY" basePath="/nextgen/youth" />
    </FormPageShell>
  );
}
