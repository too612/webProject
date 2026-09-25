import { ArticleWrite } from "../../../common/article";
import { FormPageShell } from "../../../common/ui";

export default function MissionWrite() {
  return (
    <FormPageShell titleSuffix="작성">
      <ArticleWrite templateCode="MISSION_GALLERY" basePath="/news/mission" />
    </FormPageShell>
  );
}
