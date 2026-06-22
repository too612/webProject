/**
 * File Name   : bannerList
 * Description : 배너 관리 (팝업/슬라이드 통합)
 * -----------------------------------------------------------------------------
 * common/article 엔진의 확장으로, 배너(팝업/슬라이드)를 관리합니다.
 */
import { useState } from "react";
import { ArticleList } from "../ArticleList";

export default function BannerList() {
  const [activeTab, setActiveTab] = useState<"POPUP" | "SLIDE">("POPUP");

  const handleExcelDownload = async () => {
    alert("엑셀 다운로드 기능 (백엔드 API 연동 필요)");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          type="button"
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "POPUP"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("POPUP")}
        >
          팝업 관리
        </button>
        <button
          type="button"
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "SLIDE"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("SLIDE")}
        >
          슬라이드 관리
        </button>
      </div>

      <ArticleList
        menuKey="BANNER"
        templateCode={activeTab}
        basePath="/banner"
        onExcelDownload={handleExcelDownload}
      />
    </div>
  );
}
