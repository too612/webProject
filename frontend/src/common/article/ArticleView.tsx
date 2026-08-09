import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Calendar, Eye, List, User } from "lucide-react";
import { useArticle } from "./ArticleHook";
import { getArticleTemplateConfig, type ViewConfig } from "./config";
import { EditorViewer } from "../../common/editor";
import { Attachment } from "../../common/attachment";
import { CommentSection } from "../../common/comment";
import {
  ActionButton,
  Button,
  ConfirmModal,
  Dialog,
  DialogContent,
  DialogTitle,
  ErrorMessage,
  Input,
  LoadingSpinner,
} from "../../common/ui";

interface ArticleViewProps {
  basePath: string;
  menuKey?: string;
  templateCode?: string;
  headerContent?: ReactNode;
  actionContent?: ReactNode;
  hideDefaultHeader?: boolean;
  hideDefaultActions?: boolean;
}

function normalizeDate(value: unknown): string {
  if (!value) return "-";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" || typeof value === "number") {
    return String(value).slice(0, 10);
  }
  return "-";
}

function StatusBadge({ commentCount }: Readonly<{ commentCount: number }>) {
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
}: Readonly<{
  label: string;
  value: string;
  wide?: boolean;
}>) {
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

const CONTENT_IMG_SRC_REGEX = /<img[^>]+src=["']([^"']+)["']/;

function PasswordConfirmDialog({
  open,
  password,
  onPasswordChange,
  onConfirm,
  onCancel,
}: Readonly<{
  open: boolean;
  password: string;
  onPasswordChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}>) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogTitle>비밀번호 확인</DialogTitle>
        <Input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirm();
          }}
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <Button onClick={onConfirm}>확인</Button>
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function renderHeader({
  shouldRenderDefaultHeader,
  headerContent,
  resolvedTitle,
  resolvedAuthor,
  resolvedDateTime,
  resolvedViews,
  showStatusBadge,
  commentCount,
}: Readonly<{
  shouldRenderDefaultHeader: boolean;
  headerContent?: ReactNode;
  resolvedTitle: string;
  resolvedAuthor: string;
  resolvedDateTime: string;
  resolvedViews: number;
  showStatusBadge: boolean;
  commentCount: number;
}>): ReactNode {
  if (shouldRenderDefaultHeader) {
    return (
      <header className="pb-5 mb-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-brand-dark">{resolvedTitle}</h2>
        <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <User className="h-4 w-4" />
              {resolvedAuthor}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {resolvedDateTime}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              {resolvedViews}회
            </div>
          </div>
          {showStatusBadge && <StatusBadge commentCount={commentCount} />}
        </div>
      </header>
    );
  }

  if (headerContent) {
    return (
      <div className="pb-5 mb-5 border-b border-gray-100">{headerContent}</div>
    );
  }

  return null;
}

function renderActions({
  shouldRenderDefaultActions,
  actionContent,
  btn,
  basePath,
  postId,
  onNavigate,
  onOpenPasswordModal,
}: Readonly<{
  shouldRenderDefaultActions: boolean;
  actionContent?: ReactNode;
  btn: ViewConfig["buttons"];
  basePath: string;
  postId: string;
  onNavigate: (to: string) => void;
  onOpenPasswordModal: (action: "edit" | "delete") => void;
}>): ReactNode {
  if (shouldRenderDefaultActions) {
    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        {btn?.list?.visible !== false && (
          <Button asChild>
            <Link id={btn?.list?.id || "btn_list"} to={basePath}>
              {btn?.list?.label || "목록"}
            </Link>
          </Button>
        )}
        {postId && btn?.reply?.visible !== false && (
          <Button
            variant="secondary"
            id={btn?.reply?.id || "btn_reply"}
            onClick={() => onNavigate(`${basePath}/write?parentNo=${postId}`)}
          >
            {btn?.reply?.label || "답글 작성"}
          </Button>
        )}
        {btn?.edit?.visible !== false && (
          <Button
            variant="outline"
            id={btn?.edit?.id || "btn_edit"}
            onClick={() => onOpenPasswordModal("edit")}
          >
            {btn?.edit?.label || "수정"}
          </Button>
        )}
        {btn?.delete?.visible !== false && (
          <ActionButton
            action="delete"
            id={btn?.delete?.id || "btn_delete"}
            label={btn?.delete?.label}
            onClick={() => onOpenPasswordModal("delete")}
          />
        )}
      </div>
    );
  }

  if (actionContent) {
    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        {actionContent}
      </div>
    );
  }

  return null;
}

export function ArticleView({
  basePath,
  menuKey,
  templateCode,
  headerContent,
  actionContent,
  hideDefaultHeader = false,
  hideDefaultActions = false,
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
        toast.error("비밀번호가 올바르지 않습니다.");
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
      toast.success("게시글이 삭제되었습니다.");
      navigate(basePath);
    } catch {
      toast.error("삭제 중 오류가 발생했습니다.");
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
      : CONTENT_IMG_SRC_REGEX.exec(article.contentHtml ?? "")?.[1] || null;

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
            <ActionButton
              action="delete"
              size="sm"
              id="btn_delete"
              onClick={() => openPasswordModal("delete")}
            />
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
        <PasswordConfirmDialog
          open={showPasswordModal}
          password={password}
          onPasswordChange={setPassword}
          onConfirm={onPasswordConfirm}
          onCancel={() => setShowPasswordModal(false)}
        />
      </section>
    );
  }

  // ★ 일반 게시판 모드 (설교, 공지사항, 활동사진)
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
  const shouldRenderDefaultHeader = !hideDefaultHeader && !headerContent;
  const shouldRenderDefaultActions = !hideDefaultActions && !actionContent;

  return (
    <section className="space-y-5">
      <article className="bg-white rounded-none shadow-panel border border-gray-100 p-6 md:p-7">
        {renderHeader({
          shouldRenderDefaultHeader,
          headerContent,
          resolvedTitle,
          resolvedAuthor,
          resolvedDateTime,
          resolvedViews,
          showStatusBadge: viewConfig?.showStatusBadge !== false,
          commentCount,
        })}

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
                  type="button"
                  onClick={goToPrev}
                  className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
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
                <List className="h-4 w-4" /> 목록
              </Link>
            </div>
            <div className="flex-1 text-right">
              {prevNext.nextId && (
                <button
                  type="button"
                  onClick={goToNext}
                  className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline"
                >
                  <span className="truncate max-w-[150px]">
                    {prevNext.nextTitle || "다음 글"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {renderActions({
          shouldRenderDefaultActions,
          actionContent,
          btn: config.view.buttons,
          basePath,
          postId,
          onNavigate: navigate,
          onOpenPasswordModal: openPasswordModal,
        })}
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

      <PasswordConfirmDialog
        open={showPasswordModal}
        password={password}
        onPasswordChange={setPassword}
        onConfirm={onPasswordConfirm}
        onCancel={() => setShowPasswordModal(false)}
      />
    </section>
  );
}
