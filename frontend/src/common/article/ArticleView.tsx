import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useArticle } from "./ArticleHook";
import { getArticleTemplateConfig } from "./config";
import { EditorViewer } from "../../common/editor";
import { Attachment } from "../../common/attachment";
import { CommentSection } from "../../common/comment";
import { LoadingSpinner, ErrorMessage, ConfirmModal } from "../../common/ui";

interface ArticleViewProps {
  basePath: string;
  menuKey?: string;
  templateCode?: string;
}

function normalizeDate(value: unknown): string {
  if (!value) return "-";
  return String(value).slice(0, 10);
}

function StatusBadge({ commentCount }: { commentCount: number }) {
  const answered = commentCount > 0;
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-sm text-[10px] font-semibold leading-none ${answered ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
    >
      {answered ? "완료" : "미답변"}
    </span>
  );
}

function MetaField({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}
    >
      <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
        {label}
      </dt>
      <dd className="text-[15px] font-semibold text-slate-800 leading-snug break-words">
        {value || "-"}
      </dd>
    </div>
  );
}

export function ArticleView({
  basePath,
  menuKey,
  templateCode,
}: Readonly<ArticleViewProps>) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("rqstNo") ?? "";
  const passwordParam = searchParams.get("password") ?? "";

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [action, setAction] = useState<"edit" | "delete" | null>(null);
  const [password, setPassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    articleId: string | null;
  }>({
    isOpen: false,
    articleId: null,
  });

  const {
    article,
    viewLoading,
    viewError,
    loadView,
    deleteArticle,
    verifyPassword,
    prevNext,
  } = useArticle();

  const effectiveMenuKey = menuKey || "DEFAULT";
  const effectiveTemplateCode = templateCode || "DEFAULT";

  useEffect(() => {
    if (!postId) return;
    loadView(
      Number(postId),
      passwordParam || undefined,
      effectiveMenuKey,
      effectiveTemplateCode,
    );
  }, [postId, passwordParam]);

  const config = getArticleTemplateConfig(article?.templateCode || "DEFAULT");

  const getMeta = (): Record<string, any> => {
    if (!article?.metadata) return {};
    try {
      return typeof article.metadata === "string"
        ? JSON.parse(article.metadata)
        : article.metadata || {};
    } catch {
      return {};
    }
  };

  const meta = getMeta();

  const renderMetaFields = () => {
    if (!config?.write?.extraFields || config.write.extraFields.length === 0)
      return null;
    const layoutClass =
      config.view.metaLayout === "inline"
        ? "flex flex-wrap gap-4"
        : "grid grid-cols-1 sm:grid-cols-2 gap-3";
    return (
      <section className="mt-4">
        <dl className={layoutClass}>
          {config.write.extraFields.map((field) => {
            let value = meta[field.key] ?? "-";
            if (field.type === "select" && field.options) {
              const option = field.options.find((opt) => opt.value === value);
              if (option) value = option.label;
            }
            if (field.type === "date" && value !== "-") {
              value = normalizeDate(value);
            }
            return (
              <MetaField
                key={field.key}
                label={field.label}
                value={String(value)}
                wide={field.layout === "full"}
              />
            );
          })}
        </dl>
      </section>
    );
  };

  const openPasswordModal = (nextAction: "edit" | "delete") => {
    setAction(nextAction);
    setPassword("");
    setShowPasswordModal(true);
  };

  const onPasswordConfirm = async () => {
    if (!action || !postId) {
      setShowPasswordModal(false);
      return;
    }
    if (article?.isSecret) {
      const isValid = await verifyPassword(Number(postId), password);
      if (!isValid) {
        alert("비밀번호가 올바르지 않습니다.");
        return;
      }
    }
    setShowPasswordModal(false);
    if (action === "edit") {
      navigate(`${basePath}/write?rqstNo=${postId}`);
      return;
    }
    if (action === "delete") {
      setDeleteConfirm({ isOpen: true, articleId: postId });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.articleId) return;
    try {
      await deleteArticle(Number(deleteConfirm.articleId));
      alert("게시글이 삭제되었습니다.");
      navigate(basePath);
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleteConfirm({ isOpen: false, articleId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, articleId: null });
  };

  const goToPrev = () => {
    if (prevNext.prevId) navigate(`${basePath}/view?rqstNo=${prevNext.prevId}`);
  };

  const goToNext = () => {
    if (prevNext.nextId) navigate(`${basePath}/view?rqstNo=${prevNext.nextId}`);
  };

  // ★ 이미지 전용 모드 (주보)
  const isImageOnlyMode = config.view.imageOnly?.enabled || false;
  const imageOnlyTitle = config.view.imageOnly?.showTitle !== false;

  if (viewLoading) return <LoadingSpinner text="게시글을 불러오는 중..." />;
  if (viewError)
    return (
      <ErrorMessage
        message={viewError}
        onRetry={() => loadView(Number(postId))}
        className="m-4"
      />
    );
  if (!article) {
    return (
      <div className="text-center py-8 text-gray-500">
        게시글이 존재하지 않거나 삭제되었습니다.
        <br />
        <Link
          to={basePath}
          className="text-brand-primary hover:underline mt-2 inline-block"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // ★ 이미지 전용 모드 렌더링 (주보)
  if (isImageOnlyMode) {
    const imageUrl = article.thumbnailFileId
      ? `/api/common/files/${article.thumbnailFileId}/download`
      : article.contentHtml?.match(/<img[^>]+src=["']([^"']+)["']/)?.[1] ||
        null;

    return (
      <section className="space-y-5">
        <article className="bg-white rounded-none shadow-panel border border-gray-100 p-6 md:p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-brand-dark">
              {article.title}
            </h2>
            <Link
              to={basePath}
              id="btn_list"
              className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-medium hover:bg-[#4e5caf] transition-colors"
            >
              목록
            </Link>
          </div>
          <div className="flex justify-center py-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={article.title}
                className="max-w-full max-h-[70vh] object-contain border border-slate-200 rounded-lg"
              />
            ) : (
              <div className="text-center py-8 text-gray-400">
                이미지가 없습니다.
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              id="btn_delete"
              className="inline-flex items-center bg-red-50 text-red-600 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-red-100 transition-colors"
              onClick={() => openPasswordModal("delete")}
            >
              삭제
            </button>
          </div>
        </article>
        <ConfirmModal
          isOpen={deleteConfirm.isOpen}
          title="게시글 삭제"
          message="정말로 이 게시글을 삭제하시겠습니까?"
          confirmText="삭제"
          cancelText="취소"
          confirmColor="red"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm">
              <h4 className="text-base font-bold text-brand-dark mb-4">
                비밀번호 확인
              </h4>
              <input
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white mb-4"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                onKeyDown={(e) => {
                  if (e.key === "Enter") onPasswordConfirm();
                }}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm font-medium"
                  onClick={onPasswordConfirm}
                >
                  확인
                </button>
                <button
                  type="button"
                  className="bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium"
                  onClick={() => setShowPasswordModal(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  // ★ 일반 게시판 모드 (설교, 공지사항, 활동사진)
  const btn = config.view.buttons || {};
  const viewConfig = config.view;
  const resolvedTitle = article.title ?? "게시글";
  const resolvedAuthor = article.authorId ?? "-";
  const resolvedDateTime = article.createdAt
    ? String(article.createdAt).replace("T", " ").slice(0, 16)
    : "-";
  const resolvedViews = article.viewCount ?? 0;
  const resolvedContent = article.contentHtml ?? "";
  const commentCount = article.commentCount ?? 0;
  const fileList = article.fileList ?? [];
  const showPrevNext = viewConfig?.showPrevNext ?? false;

  return (
    <section className="space-y-5">
      <article className="bg-white rounded-none shadow-panel border border-gray-100 p-6 md:p-7">
        <header className="pb-5 mb-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{resolvedTitle}</h2>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-icons text-base">person</span>
                {resolvedAuthor}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-icons text-base">calendar_today</span>
                {resolvedDateTime}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-icons text-base">visibility</span>
                {resolvedViews}회
              </div>
            </div>
            <StatusBadge commentCount={commentCount} />
          </div>
        </header>

        {viewConfig?.showMetaFields !== false && renderMetaFields()}

        <section className="py-4 text-gray-700">
          <EditorViewer
            value={resolvedContent}
            emptyText="등록된 내용이 없습니다."
          />
        </section>

        <Attachment
          readOnly
          existingFiles={fileList.map((f: any) => ({
            fileId: f.fileId,
            orgFileNm: f.orgFileNm ?? f.storedFileNm,
            fileSize: f.fileSize ?? 0,
          }))}
          buildDownloadUrl={(fileId) => `/api/common/files/${fileId}/download`}
          buildZipUrl={
            fileList.length > 1
              ? `/api/common/files/downloadZip?pgmId=post&refId=${postId}`
              : undefined
          }
        />

        {viewConfig?.showComment !== false && (
          <CommentSection pgmId="post" refId={postId} />
        )}

        {showPrevNext && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div className="flex-1 text-left">
              {prevNext.prevId && (
                <button
                  onClick={goToPrev}
                  className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline"
                >
                  <span className="material-icons text-sm">arrow_back</span>
                  <span className="truncate max-w-[150px]">
                    {prevNext.prevTitle || "이전 글"}
                  </span>
                </button>
              )}
            </div>
            <div className="flex-1 text-center">
              <Link
                to={basePath}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-primary"
              >
                <span className="material-icons text-sm">list</span> 목록
              </Link>
            </div>
            <div className="flex-1 text-right">
              {prevNext.nextId && (
                <button
                  onClick={goToNext}
                  className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline"
                >
                  <span className="truncate max-w-[150px]">
                    {prevNext.nextTitle || "다음 글"}
                  </span>
                  <span className="material-icons text-sm">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {btn.list?.visible !== false && (
            <Link
              id={btn.list?.id || "btn_list"}
              className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-medium hover:bg-[#4e5caf] transition-colors"
              to={basePath}
            >
              {btn.list?.label || "목록"}
            </Link>
          )}
          {postId && btn.reply?.visible !== false && (
            <button
              type="button"
              id={btn.reply?.id || "btn_reply"}
              className="inline-flex items-center bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
              onClick={() => navigate(`${basePath}/write?parentNo=${postId}`)}
            >
              {btn.reply?.label || "답글 작성"}
            </button>
          )}
          {btn.edit?.visible !== false && (
            <button
              type="button"
              id={btn.edit?.id || "btn_edit"}
              className="inline-flex items-center bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
              onClick={() => openPasswordModal("edit")}
            >
              {btn.edit?.label || "수정"}
            </button>
          )}
          {btn.delete?.visible !== false && (
            <button
              type="button"
              id={btn.delete?.id || "btn_delete"}
              className="inline-flex items-center bg-red-50 text-red-600 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-red-100 transition-colors"
              onClick={() => openPasswordModal("delete")}
            >
              {btn.delete?.label || "삭제"}
            </button>
          )}
        </div>
      </article>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="게시글 삭제"
        message="정말로 이 게시글을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        confirmColor="red"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-brand-dark mb-4">
              비밀번호 확인
            </h4>
            <input
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white mb-4"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              onKeyDown={(e) => {
                if (e.key === "Enter") onPasswordConfirm();
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm font-medium"
                onClick={onPasswordConfirm}
              >
                확인
              </button>
              <button
                type="button"
                className="bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium"
                onClick={() => setShowPasswordModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
