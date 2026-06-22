/**
 * File Name   : bannerWrite
 * Description : 배너 등록/수정 (팝업/슬라이드 공통)
 * -----------------------------------------------------------------------------
 * 팝업 또는 슬라이드 배너를 등록/수정합니다.
 */
import { useSearchParams } from "react-router-dom";
import { ArticleWrite } from "../ArticleWrite";

export default function BannerWrite() {
  const [searchParams] = useSearchParams();
  const templateCode = searchParams.get("type") === "SLIDE" ? "SLIDE" : "POPUP";

  return <ArticleWrite templateCode={templateCode} basePath="/banner" />;
}
