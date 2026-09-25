/**
 * File Name   : bannerWrite
 * Description : 배너 등록/수정 (관리자용)
 * -----------------------------------------------------------------------------
 * ArticleWrite를 재사용하여 배너를 등록/수정합니다.
 * 팝업/슬라이드 구분은 ArticleWrite 내부의 라디오 버튼으로 처리합니다.
 */
import { useSearchParams } from "react-router-dom";
import { ArticleWrite } from "../../../common/article";
import { FormPageShell } from "../../../common/ui";

export default function BannerWrite() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "POPUP";

  return (
    <FormPageShell titleSuffix="작성">
      <ArticleWrite templateCode={type} basePath="/news/banner" />
    </FormPageShell>
  );
}
