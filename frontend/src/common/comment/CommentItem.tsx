import { FormEvent, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Lock,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import { Input, Textarea } from "../../common/ui";
import { commentApi } from "./CommentApi";
import type {
  CommentItem as CommentDto,
  CommentFormState,
} from "./CommentModel";

interface CommentItemProps {
  comment: CommentDto;
  depth: number;
  onVote: (commentId: number | string, action: "like" | "dislike") => void;
  onSubmitReply: (
    parentCommentId: number | undefined,
    form: CommentFormState,
  ) => Promise<void>;
  commentLoading: boolean;
  voteMap: Record<string, string | undefined>;
}

const MAX_COMMENT_DEPTH = 3;

/* ──────────────────────────────────────────────
 * 단일 댓글 본문
 * ────────────────────────────────────────────── */
const DEPTH_STYLES = [
  { size: "w-8 h-8 text-[18px]", boxWidth: "w-8", axis: "16px", padding: "44px" },
  { size: "w-7 h-7 text-[15px]", boxWidth: "w-7", axis: "14px", padding: "40px" },
  { size: "w-6 h-6 text-[13px]", boxWidth: "w-6", axis: "12px", padding: "36px" },
];

function CommentBody({
  comment,
  depth,
  onVote,
  onSubmitReply,
  commentLoading,
  voteMap,
  showReplyForm,
  setShowReplyForm,
}: Readonly<{
  comment: CommentDto;
  depth: number;
  onVote: (id: number | string, action: "like" | "dislike") => void;
  onSubmitReply: (
    parentId: number | undefined,
    form: CommentFormState,
  ) => Promise<void>;
  commentLoading: boolean;
  voteMap: Record<string, string | undefined>;
  showReplyForm: boolean;
  setShowReplyForm: (v: boolean) => void;
}>) {
  const [spoilerVisible, setSpoilerVisible] = useState(false);
  const [showSecretForm, setShowSecretForm] = useState(false);
  const [secretPassword, setSecretPassword] = useState("");
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [secretError, setSecretError] = useState("");
  const [secretChecking, setSecretChecking] = useState(false);
  const [replyForm, setReplyForm] = useState<CommentFormState>({
    writer: "",
    content: "",
    secret: false,
    spoiler: false,
    password: "",
    parentCommentId:
      typeof comment.commentId === "number"
        ? comment.commentId
        : Number(comment.commentId),
  });

  const isSecret = comment.secret === "Y";
  const isSpoiler = comment.spoiler === "Y";
  const currentVote = voteMap[String(comment.commentId)];
  const canReply = depth < MAX_COMMENT_DEPTH;

  const handleSecretCheck = async (e: FormEvent) => {
    e.preventDefault();
    if (!secretPassword.trim()) {
      setSecretError("비밀번호를 입력하세요.");
      return;
    }
    setSecretChecking(true);
    setSecretError("");
    try {
      const valid = await commentApi.checkPassword(
        comment.commentId,
        secretPassword,
      );
      if (valid) {
        setSecretUnlocked(true);
        setShowSecretForm(false);
        setSecretPassword("");
      } else setSecretError("비밀번호가 올바르지 않습니다.");
    } catch {
      setSecretError("확인 중 오류가 발생했습니다.");
    } finally {
      setSecretChecking(false);
    }
  };

  const handleReplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmitReply(replyForm.parentCommentId, replyForm);
    setShowReplyForm(false);
    setReplyForm((prev) => ({
      ...prev,
      writer: "",
      content: "",
      password: "",
    }));
  };

  const renderContent = () => {
    if (isSecret && !secretUnlocked) {
      return (
        <div>
          <p className="text-[13px] text-slate-400 italic mb-1.5">
            비밀댓글입니다.<button
              type="button"
              className="ml-2 text-[12px] text-brand-primary underline bg-transparent border-0 cursor-pointer"
              onClick={() => {
                setShowSecretForm((v) => !v);
                setSecretError("");
              }}
            >
              {showSecretForm ? "취소" : "비밀번호 확인"}
            </button>
          </p>
          {showSecretForm && (
            <form
              onSubmit={handleSecretCheck}
              className="flex items-center gap-2 mb-2"
            >
              <input
                type="password"
                className="border border-slate-200 rounded-md px-3 py-1.5 text-sm w-[140px] focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="비밀번호"
                value={secretPassword}
                onChange={(e) => setSecretPassword(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="bg-brand-primary text-white rounded-md px-3 py-1.5 text-xs font-medium disabled:opacity-40"
                disabled={secretChecking}
              >
                {secretChecking ? "확인 중..." : "확인"}
              </button>
              {secretError && (
                <span className="text-xs text-red-500">{secretError}</span>
              )}
            </form>
          )}
        </div>
      );
    }

    if (isSpoiler && !spoilerVisible) {
      return (
        <button
          type="button"
          className="block w-full text-left text-[13px] text-slate-700 blur-[5px] select-none cursor-pointer mb-1.5 border-0 bg-transparent p-0"
          onClick={() => setSpoilerVisible(true)}
          aria-expanded={!spoilerVisible}
          title="클릭하면 내용을 볼 수 있습니다"
        >
          {comment.content ?? ""}
        </button>
      );
    }

    return (
      <p className="text-[13px] text-slate-700 leading-relaxed mb-1.5 whitespace-pre-wrap">
        {" "}
        {comment.content ?? ""}
      </p>
    );
  };

  return (
    // [보정] 본문 전체를 하얀색 레이어로 감싸 위로 튀는 선을 가림
    <div className="relative z-10 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[13px] font-semibold text-slate-800">
          {comment.writer ?? "익명"}
        </span>
        <span className="text-[12px] text-slate-400">
          {comment.insDt
            ? String(comment.insDt).replace("T", " ").slice(0, 16)
            : ""}
        </span>
        {isSecret && <Lock className="h-[14px] w-[14px] text-slate-400" />}
        {isSpoiler && !spoilerVisible && (
          <span className="text-[11px] text-amber-500 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
            스포일러
          </span>
        )}
      </div>

      {renderContent()}

      <div className="flex items-center gap-3 mt-1">
        <button
          type="button"
          onClick={() => onVote(comment.commentId, "like")}
          className={`inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[12px] transition-colors ${
            currentVote === "like"
              ? "text-slate-900"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <ThumbsUp className="h-[18px] w-[18px]" />
          {(comment.likes ?? 0) > 0 && <span>{comment.likes}</span>}
        </button>

        <button
          type="button"
          onClick={() => onVote(comment.commentId, "dislike")}
          className={`inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[12px] transition-colors ${
            currentVote === "dislike"
              ? "text-slate-900"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <ThumbsDown className="h-[18px] w-[18px]" />
        </button>

        {isSpoiler && spoilerVisible && (
          <button
            type="button"
            onClick={() => setSpoilerVisible(false)}
            className="text-[12px] text-amber-500 border-0 bg-transparent cursor-pointer"
          >
            숨기기
          </button>
        )}

        {canReply && (
          <button
            type="button"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-[12px] font-semibold text-slate-500 hover:text-slate-800 border-0 bg-transparent transition-colors"
          >
            답글
          </button>
        )}
      </div>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-3 bg-white">
          <Textarea
            className="w-full border-b border-slate-200 bg-transparent px-0 py-1.5 text-sm focus:outline-none focus:border-slate-500 resize-none min-h-[48px] rounded-none shadow-none"
            placeholder="답글 추가..."
            value={replyForm.content}
            onChange={(e) =>
              setReplyForm((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={2}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <Input
              className="w-[90px] h-7 text-xs px-2"
              type="text"
              placeholder="작성자"
              value={replyForm.writer}
              onChange={(e) =>
                setReplyForm((prev) => ({ ...prev, writer: e.target.value }))
              }
            />
            <Input
              className="w-[90px] h-7 text-xs px-2"
              type="password"
              placeholder="비밀번호"
              value={replyForm.password}
              onChange={(e) =>
                setReplyForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-3 py-1.5 text-xs text-slate-500 rounded-full hover:bg-slate-100 border-0 bg-transparent transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={commentLoading}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-primary rounded-full hover:bg-[#4e5caf] disabled:opacity-40 transition-colors border-0"
              >
                저장
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
 * CommentItem — 최상위 및 대댓글 공용 컴포넌트
 * ────────────────────────────────────────────── */
export default function CommentItem({
  comment,
  depth,
  onVote,
  onSubmitReply,
  commentLoading,
  voteMap,
}: Readonly<CommentItemProps>) {
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;

  const ds = DEPTH_STYLES[Math.min(depth, DEPTH_STYLES.length - 1)];
  const avatarSize = ds.size;
  const avatarBoxWidth = ds.boxWidth;
  const axisLeftStyle = ds.axis;
  const paddingLeftStyle = ds.padding;

  return (
    <div className="relative flex flex-col w-full">
      {/* 부모 댓글 */}
      <div className="flex gap-3 w-full relative">
        <div
          className={`relative flex flex-col items-center shrink-0 ${avatarBoxWidth}`}
        >
          <div
            className={`${avatarSize} rounded-full bg-slate-200 flex items-center justify-center shrink-0 z-10`}
          >
            <User className="h-5 w-5 text-slate-400" />
          </div>
          {/* 부모 아바타 하단 세로선 */}
          {hasReplies && (
            <div className="absolute top-8 bottom-0 w-px bg-slate-200 left-1/2 -translate-x-1/2 z-0" />
          )}
        </div>

        <div className="flex-1 min-w-0 pb-2">
          <CommentBody
            comment={comment}
            depth={depth}
            onVote={onVote}
            onSubmitReply={onSubmitReply}
            commentLoading={commentLoading}
            voteMap={voteMap}
            showReplyForm={showReplyForm}
            setShowReplyForm={setShowReplyForm}
          />
        </div>
      </div>

      {/* 대댓글 영역 전체 컨테이너 */}
      {hasReplies && (
        <div className="relative w-full">
          {/* [접힘 상태] L자 곡선과 버튼 */}
          {!repliesOpen && (
            <div
              className="relative flex items-center h-9"
              style={{ paddingLeft: paddingLeftStyle }}
            >
              <div
                className="absolute border-l border-b border-slate-200 rounded-bl-[14px]"
                style={{
                  left: axisLeftStyle,
                  right: `calc(100% - ${paddingLeftStyle} + 4px)`,
                  top: "0px",
                  height: "18px",
                }}
              />
              <button
                type="button"
                onClick={() => setRepliesOpen(true)}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-primary hover:bg-slate-100 border-0 bg-transparent rounded-full py-1 px-2 -ml-2 transition-colors z-10"
              >
                <span>{`답글 ${replies.length}개`}</span>
                <ChevronDown className="h-[18px] w-[18px]" />
              </button>
            </div>
          )}

          {/* [펼침 상태] 유튜브 메커니즘 컨테이너 */}
          {repliesOpen && (
            // [보정] overflow-hidden을 걸어 하단으로 새어나가는 미세 픽셀선을 물리적으로 강제 차단합니다.
            <div
              className="relative w-full overflow-hidden"
              style={{ paddingLeft: paddingLeftStyle }}
            >
              {/* 통세로선 */}
              <div
                className="absolute top-0 w-px bg-slate-200 z-0"
                style={{ left: axisLeftStyle, bottom: "24px" }} // 숨기기 버튼 전까지만 정확히 떨어짐
              />

              {/* 대댓글 리스트 */}
              <div className="space-y-4 pt-2 relative z-10">
                {replies.map((reply, i) => (
                  <div
                    key={`${reply.commentId}-${i}`}
                    className="relative w-full z-10"
                  >
                    {/* 자식 진입 ㄴ자 곡선 */}
                    <div
                      className="absolute border-b border-slate-200 rounded-bl-[14px]"
                      style={{
                        left: `calc(${axisLeftStyle} - ${paddingLeftStyle})`,
                        width: `calc(${paddingLeftStyle} - ${axisLeftStyle} - 12px)`,
                        top: "0px",
                        height: "16px",
                        borderLeft: "1px solid #e2e8f0",
                      }}
                    />

                    <CommentItem
                      comment={reply}
                      depth={depth + 1}
                      onVote={onVote}
                      onSubmitReply={onSubmitReply}
                      commentLoading={commentLoading}
                      voteMap={voteMap}
                    />
                  </div>
                ))}
              </div>

              {/* 하단 답글 숨기기 버튼 */}
              <div className="relative flex items-center h-8 w-full mt-4 z-10">
                <div
                  className="absolute border-l border-b border-slate-200 rounded-bl-[14px]"
                  style={{
                    left: `calc(${axisLeftStyle} - ${paddingLeftStyle})`,
                    width: `calc(${paddingLeftStyle} - ${axisLeftStyle} - 12px)`,
                    top: "0px",
                    height: "14px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setRepliesOpen(false)}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-primary hover:bg-slate-100 border-0 bg-transparent rounded-full py-1 px-2 -ml-2 transition-colors z-10 bg-white"
                >
                  <span>답글 숨기기</span>
                  <ChevronUp className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
