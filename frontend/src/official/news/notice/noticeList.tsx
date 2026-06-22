// frontend/src/official/news/notice/noticeList.tsx
import { ArticleList } from "../../../common/article";

export default function NoticeList() {
  // ★ 엑셀 다운로드 핸들러 (API 호출 등)
  const handleExcelDownload = () => {
    // 실제 구현: API 호출하여 엑셀 파일 다운로드
    alert("엑셀 다운로드 기능 (API 연동 필요)");
  };

  return (
    <ArticleList
      menuKey="PINNABLE"
      templateCode="PINNABLE"
      basePath="/news/notice"
      onExcelDownload={handleExcelDownload}
    />
  );
}
