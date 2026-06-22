/**
 * File Name   : bannerView
 * Description : 배너 상세 미리보기 (메인 페이지 스타일)
 */
import { useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useArticle } from "../../../common/article";
import { LoadingSpinner, ErrorMessage } from "../../../common/ui";

export default function BannerView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("rqstNo") ?? "";

  const { article, viewLoading, viewError, loadView, deleteArticle } =
    useArticle();

  useEffect(() => {
    if (postId) loadView(Number(postId));
  }, [postId]);

  const handleDelete = async () => {
    if (!confirm("이 배너를 삭제하시겠습니까?")) return;
    try {
      await deleteArticle(Number(postId));
      alert("삭제되었습니다.");
      navigate("/news/banner");
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (viewLoading) return <LoadingSpinner text="배너 정보를 불러오는 중..." />;
  if (viewError) return <ErrorMessage message={viewError} />;
  if (!article)
    return (
      <div className="text-center py-8 text-gray-500">
        배너가 존재하지 않습니다.
      </div>
    );

  // 메타데이터 파싱
  const getMeta = (): Record<string, any> => {
    if (!article.metadata) return {};
    try {
      return typeof article.metadata === "string"
        ? JSON.parse(article.metadata)
        : article.metadata || {};
    } catch {
      return {};
    }
  };
  const meta = getMeta();

  // 이미지 URL
  const imageUrl = article.thumbnailFileId
    ? `/api/common/files/${article.thumbnailFileId}/download`
    : article.firstFileId
      ? `/api/common/files/${article.firstFileId}/download`
      : null;

  const isPopup = article.templateCode === "POPUP";
  const isSlide = article.templateCode === "SLIDE";

  // 팝업 dismiss 옵션 표시
  const dismissOptionMap: Record<string, string> = {
    NONE: "항상 노출",
    HOURS_4: "4시간",
    DAY: "하루",
    WEEK: "일주일",
  };
  const dismissLabel =
    dismissOptionMap[article.popupDismissOption || "DAY"] || "하루";

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-brand-dark">배너 미리보기</h2>
        <div className="flex gap-2">
          <Link
            to="/news/banner"
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            목록
          </Link>
          <Link
            to={`/news/banner/write?rqstNo=${article.articleId}`}
            className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-[#4e5caf]"
          >
            수정
          </Link>
          <button
            type="button"
            className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </div>

      {/* 미리보기 영역 */}
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <h3 className="text-sm font-semibold text-slate-500">
          실제 메인 페이지 노출 형태
        </h3>
        <div className="border border-slate-200 rounded-lg bg-slate-50 p-8 flex items-center justify-center min-h-[200px]">
          {isPopup && (
            <div className="relative w-full max-w-sm mx-auto bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={article.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-slate-100 text-slate-400">
                  <span className="material-icons text-6xl">image</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                팝업
              </div>
            </div>
          )}
          {isSlide && (
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
              <div className="aspect-video relative bg-slate-100">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <span className="material-icons text-6xl">image</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h4 className="text-white font-medium text-lg">
                    {article.title}
                  </h4>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                슬라이드
              </div>
            </div>
          )}
          {!isPopup && !isSlide && (
            <div className="text-center text-slate-400">
              <span className="material-icons text-4xl">help_outline</span>
              <p className="mt-2">알 수 없는 배너 유형입니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 배너 정보 */}
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <h3 className="text-sm font-semibold text-slate-500">배너 정보</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
              유형
            </dt>
            <dd className="text-[15px] font-semibold text-slate-800">
              {isPopup ? "팝업" : isSlide ? "슬라이드" : "-"}
            </dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
              상태
            </dt>
            <dd className="text-[15px] font-semibold text-slate-800">
              {article.isPopup && article.popupStartDt && article.popupEndDt
                ? "노출중"
                : "대기중"}
            </dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
              순서
            </dt>
            <dd className="text-[15px] font-semibold text-slate-800">
              {article.orderNo ?? 0}
            </dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
              안보기 옵션
            </dt>
            <dd className="text-[15px] font-semibold text-slate-800">
              {dismissLabel}
            </dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
              시작일시
            </dt>
            <dd className="text-[15px] font-semibold text-slate-800">
              {article.popupStartDt
                ? String(article.popupStartDt).replace("T", " ").slice(0, 16)
                : "-"}
            </dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
              종료일시
            </dt>
            <dd className="text-[15px] font-semibold text-slate-800">
              {article.popupEndDt
                ? String(article.popupEndDt).replace("T", " ").slice(0, 16)
                : "-"}
            </dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1 sm:col-span-2">
            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
              링크
            </dt>
            <dd className="text-[15px] font-semibold text-slate-800 truncate">
              {meta?.popupLink || meta?.slideLink || (
                <span className="text-slate-400">(없음)</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
