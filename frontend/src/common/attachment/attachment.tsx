﻿﻿/**
 * File Name   : Attachment
 * Description : 공통 파일첨부 컴포넌트
 * -----------------------------------------------------------------------------
 * - 드롭존 영역 (드래그 + 파일 선택 버튼)
 * - 파일 목록 (기존/신규/업로드중) 표시
 * - ★ 파일 업로드 제한 시 인라인 에러 메시지 표시
 */

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { FileWithPath } from "react-dropzone";
import type { AttachmentProps } from "./attachmentModel";
import { attachmentApi } from "./attachmentApi";
import { ErrorMessage } from "../../common/ui";

const formatSize = (bytes?: number): string => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fileIcon = (name?: string): string => {
  const ext = name?.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext))
    return "image";
  if (["mp4", "avi", "mov", "mkv", "webm"].includes(ext)) return "movie";
  if (["mp3", "wav", "ogg", "flac", "m4a"].includes(ext)) return "audiotrack";
  if (ext === "pdf") return "picture_as_pdf";
  if (["doc", "docx", "hwp", "hwpx"].includes(ext)) return "article";
  if (["xls", "xlsx"].includes(ext)) return "table_chart";
  if (["ppt", "pptx"].includes(ext)) return "slideshow";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "folder_zip";
  if (["txt", "md"].includes(ext)) return "text_snippet";
  return "attach_file";
};

type UploadStatus = "uploading" | "success" | "error";
type UploadEntry = {
  uid: string;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
};

let _uidSeq = 0;
const nextUid = () => `upload-${++_uidSeq}`;

const EXT_MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
  txt: "text/plain",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  mp3: "audio/mpeg",
};

function toAcceptObj(accept?: string): Record<string, string[]> | undefined {
  if (!accept) return undefined;
  const result: Record<string, string[]> = {};
  accept
    .split(",")
    .map((s) => s.trim())
    .forEach((item) => {
      if (item.startsWith(".")) {
        const mime =
          EXT_MIME[item.slice(1).toLowerCase()] ?? "application/octet-stream";
        (result[mime] ??= []).push(item);
      } else {
        result[item] ??= [];
      }
    });
  return Object.keys(result).length ? result : undefined;
}

function FileRow({
  icon,
  name,
  size,
  badge,
  badgeColor,
  actions,
  subContent,
}: {
  icon: string;
  name: string;
  size?: string;
  badge: string;
  badgeColor: "gray" | "green" | "blue" | "red";
  actions?: React.ReactNode;
  subContent?: React.ReactNode;
}) {
  const badgeCls: Record<string, string> = {
    gray: "bg-slate-100 text-slate-500",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
  };
  const rowBorderCls: Record<string, string> = {
    gray: "border-slate-200 bg-white",
    green: "border-emerald-200 bg-emerald-50/40",
    blue: "border-blue-200 bg-blue-50/40",
    red: "border-red-200 bg-red-50/40",
  };

  return (
    <li
      className={`flex flex-col gap-1 rounded-md border px-3 py-2.5 ${rowBorderCls[badgeColor]}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`material-icons text-base shrink-0 ${
            badgeColor === "gray"
              ? "text-slate-400"
              : badgeColor === "green"
                ? "text-emerald-500"
                : badgeColor === "blue"
                  ? "text-blue-400"
                  : "text-red-400"
          }`}
        >
          {icon}
        </span>
        <span className="flex-1 truncate text-sm text-slate-700">{name}</span>
        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${badgeCls[badgeColor]}`}
        >
          {badge}
        </span>
        {size && (
          <span className="shrink-0 text-xs text-slate-400">{size}</span>
        )}
        {actions}
      </div>
      {subContent}
    </li>
  );
}

export default function Attachment({
  existingFiles = [],
  newFiles = [],
  deletedFileIds: _deletedFileIds = [],
  onAdd,
  onRemoveExisting,
  onRemoveNew,
  onUploadFile,
  onUploaded,
  onError,
  buildDownloadUrl = attachmentApi.buildDownloadUrl,
  buildZipUrl,
  readOnly = false,
  accept,
  maxFiles,
  maxFileSize,
  compact = false,
}: AttachmentProps & { buildZipUrl?: string }) {
  const [uploading, setUploading] = useState<UploadEntry[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ★ 에러 메시지 상태 (인라인 표시용)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeUploadCount = uploading.filter(
    (u) => u.status !== "error",
  ).length;
  const totalCount = existingFiles.length + newFiles.length + activeUploadCount;
  const canAdd = !readOnly && (maxFiles === undefined || totalCount < maxFiles);

  const helperText = [
    accept ? `형식: ${accept}` : null,
    maxFileSize ? `파일당 ${formatSize(maxFileSize)} 이하` : null,
    maxFiles !== undefined ? `최대 ${maxFiles}개` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  // ★ 에러 초기화 함수
  const clearError = () => setErrorMessage(null);

  const retryUpload = useCallback(
    async (entry: UploadEntry) => {
      if (!onUploadFile) return;
      clearError();
      setUploading((prev) =>
        prev.map((u) =>
          u.uid === entry.uid
            ? { ...u, progress: 0, status: "uploading", error: undefined }
            : u,
        ),
      );
      try {
        const result = await onUploadFile(entry.file, (pct) =>
          setUploading((prev) =>
            prev.map((u) =>
              u.uid === entry.uid ? { ...u, progress: pct } : u,
            ),
          ),
        );
        setUploading((prev) =>
          prev.map((u) =>
            u.uid === entry.uid
              ? { ...u, progress: 100, status: "success" }
              : u,
          ),
        );
        onUploaded?.(result);
        setTimeout(
          () => setUploading((prev) => prev.filter((u) => u.uid !== entry.uid)),
          2000,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "업로드 실패";
        setUploading((prev) =>
          prev.map((u) =>
            u.uid === entry.uid ? { ...u, status: "error", error: msg } : u,
          ),
        );
      }
    },
    [onUploadFile, onUploaded],
  );

  const processFiles = useCallback(
    async (files: FileWithPath[]) => {
      clearError();

      const remaining =
        maxFiles !== undefined ? maxFiles - totalCount : Infinity;
      const candidates = files.slice(0, Math.max(0, remaining));

      // ★ 파일 개수 초과 체크
      if (files.length > remaining) {
        const msg = `첨부 가능한 파일 개수를 초과했습니다. (최대 ${maxFiles}개)`;
        setErrorMessage(msg);
        onError?.(msg);
        return;
      }

      // ★ 파일 크기 초과 체크
      const oversized = candidates.filter(
        (f) => maxFileSize && f.size > maxFileSize,
      );
      if (oversized.length > 0) {
        const names = oversized.map((f) => f.name).join(", ");
        const msg = `파일 크기 초과: ${names} (최대 ${formatSize(maxFileSize)})`;
        setErrorMessage(msg);
        onError?.(msg);
        return;
      }

      const valid = candidates.filter(
        (f) => !maxFileSize || f.size <= maxFileSize,
      );
      if (!valid.length) return;

      if (onUploadFile) {
        const entries: UploadEntry[] = valid.map((f) => ({
          uid: nextUid(),
          file: f,
          progress: 0,
          status: "uploading",
        }));
        setUploading((prev) => [...prev, ...entries]);
        await Promise.allSettled(
          entries.map(async (entry) => {
            try {
              const result = await onUploadFile(entry.file, (pct) =>
                setUploading((prev) =>
                  prev.map((u) =>
                    u.uid === entry.uid ? { ...u, progress: pct } : u,
                  ),
                ),
              );
              setUploading((prev) =>
                prev.map((u) =>
                  u.uid === entry.uid
                    ? { ...u, progress: 100, status: "success" }
                    : u,
                ),
              );
              onUploaded?.(result);
              setTimeout(
                () =>
                  setUploading((prev) =>
                    prev.filter((u) => u.uid !== entry.uid),
                  ),
                2000,
              );
            } catch (err) {
              const msg = err instanceof Error ? err.message : "업로드 실패";
              setUploading((prev) =>
                prev.map((u) =>
                  u.uid === entry.uid
                    ? { ...u, status: "error", error: msg }
                    : u,
                ),
              );
            }
          }),
        );
      } else {
        onAdd?.(valid);
      }
    },
    [
      maxFiles,
      maxFileSize,
      totalCount,
      onAdd,
      onUploadFile,
      onUploaded,
      onError,
    ],
  );

  const acceptObj = toAcceptObj(accept);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
    ...(acceptObj ? { accept: acceptObj } : {}),
    disabled: !canAdd,
    noClick: true,
    noKeyboard: true,
    onDropRejected: (rejections) => {
      // ★ react-dropzone의 rejections 처리
      const errors = rejections
        .map((r) => r.errors.map((e) => e.message).join(", "))
        .join("; ");
      if (errors) {
        setErrorMessage(errors);
        onError?.(errors);
      }
    },
  });

  const hasFiles =
    existingFiles.length > 0 || newFiles.length > 0 || uploading.length > 0;

  return (
    <div {...getRootProps()} className="relative space-y-2">
      <input {...getInputProps()} />

      {/* ★ 에러 메시지 표시 영역 */}
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onRetry={clearError}
          className="mb-2"
        />
      )}

      {canAdd && (
        <div
          className={[
            "flex items-center gap-3 rounded-md border px-4 py-3 transition-colors",
            isDragActive
              ? "border-brand-primary bg-brand-primary/5 border-dashed"
              : "border-slate-200 border-dashed bg-slate-50/60 hover:bg-slate-50",
          ].join(" ")}
        >
          <div
            className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-md ${
              isDragActive
                ? "bg-brand-primary/10 text-brand-primary"
                : "bg-white border border-slate-200 text-slate-400"
            }`}
          >
            <span className="material-icons text-base">upload_file</span>
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${isDragActive ? "text-brand-primary" : "text-slate-600"}`}
            >
              {isDragActive
                ? "여기에 놓으세요"
                : "파일을 드래그하거나 선택해서 첨부하세요"}
            </p>
            {!isDragActive && (
              <p className="text-xs text-slate-400 mt-0.5">
                {helperText || "여러 파일을 한 번에 추가할 수 있습니다"}
              </p>
            )}
          </div>

          {!isDragActive && (
            <button
              type="button"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              <span className="material-icons text-sm">attach_file</span>
              파일 선택
            </button>
          )}
        </div>
      )}

      {/* readOnly 모드 */}
      {readOnly && (
        <>
          {!hasFiles ? (
            <p className="text-xs text-slate-400 px-1">첨부파일이 없습니다.</p>
          ) : (
            <section className="rounded-none border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <span className="material-icons text-sm text-slate-400">
                  attach_file
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  첨부파일
                </span>
                <span className="text-xs text-slate-400">
                  {existingFiles.length}개
                </span>
                {buildZipUrl && existingFiles.length > 1 && (
                  <a
                    href={buildZipUrl}
                    download="download.zip"
                    className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 border border-slate-300 rounded-md px-2.5 py-1 hover:bg-slate-100 transition-colors"
                  >
                    <span className="material-icons text-sm">folder_zip</span>
                    전체 다운로드
                  </a>
                )}
              </div>
              <ul className="divide-y divide-slate-100">
                {existingFiles.map((file, i) => {
                  const fileName = file.orgFileNm ?? String(file.fileId);
                  return (
                    <li key={file.fileId ?? i}>
                      <a
                        href={buildDownloadUrl(file.fileId)}
                        download={fileName}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50/80 transition-colors group"
                      >
                        <span className="material-icons text-base text-slate-400 shrink-0 group-hover:text-brand-primary transition-colors">
                          {fileIcon(fileName)}
                        </span>
                        <span className="flex-1 text-sm text-slate-700 truncate group-hover:text-brand-primary transition-colors">
                          {fileName}
                        </span>
                        {(file.fileSize ?? 0) > 0 && (
                          <span className="hidden sm:block text-xs text-slate-400 shrink-0">
                            {formatSize(file.fileSize ?? 0)}
                          </span>
                        )}
                        <span className="material-icons text-sm text-slate-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          download
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}

      {/* 편집 모드: 파일 목록 */}
      {!readOnly && hasFiles && (
        <ul className={`space-y-1.5 ${compact ? "text-xs" : "text-sm"}`}>
          {existingFiles.map((file) => (
            <FileRow
              key={file.fileId}
              icon={fileIcon(file.orgFileNm)}
              name={file.orgFileNm ?? String(file.fileId)}
              size={formatSize(file.fileSize ?? 0)}
              badge="저장됨"
              badgeColor="gray"
              actions={
                <>
                  <a
                    href={buildDownloadUrl(file.fileId)}
                    download={file.orgFileNm}
                    title="다운로드"
                    className="shrink-0 text-slate-300 hover:text-brand-primary transition-colors ml-1"
                  >
                    <span className="material-icons text-base">download</span>
                  </a>
                  <button
                    type="button"
                    title="삭제"
                    className="shrink-0 text-slate-300 hover:text-red-500 transition-colors"
                    onClick={() => onRemoveExisting?.(file.fileId)}
                  >
                    <span className="material-icons text-base">close</span>
                  </button>
                </>
              }
            />
          ))}

          {newFiles.map((file, index) => (
            <FileRow
              key={`new-${index}`}
              icon={fileIcon(file.name)}
              name={file.name}
              size={formatSize(file.size)}
              badge="대기중"
              badgeColor="green"
              actions={
                <button
                  type="button"
                  title="취소"
                  className="shrink-0 text-slate-300 hover:text-red-500 transition-colors ml-1"
                  onClick={() => onRemoveNew?.(index)}
                >
                  <span className="material-icons text-base">close</span>
                </button>
              }
            />
          ))}

          {uploading.map((u) => (
            <FileRow
              key={u.uid}
              icon={fileIcon(u.file.name)}
              name={u.file.name}
              size={formatSize(u.file.size)}
              badge={
                u.status === "error"
                  ? "실패"
                  : u.status === "success"
                    ? "완료"
                    : "업로드중"
              }
              badgeColor={
                u.status === "error"
                  ? "red"
                  : u.status === "success"
                    ? "green"
                    : "blue"
              }
              actions={
                <>
                  {u.status === "uploading" && (
                    <span className="material-icons animate-spin text-base text-blue-400 shrink-0 ml-1">
                      sync
                    </span>
                  )}
                  {u.status === "error" && (
                    <>
                      <button
                        type="button"
                        title="재시도"
                        className="shrink-0 text-red-400 hover:text-red-600 transition-colors ml-1"
                        onClick={() => retryUpload(u)}
                      >
                        <span className="material-icons text-base">
                          refresh
                        </span>
                      </button>
                      <button
                        type="button"
                        title="제거"
                        className="shrink-0 text-slate-300 hover:text-red-500 transition-colors"
                        onClick={() =>
                          setUploading((prev) =>
                            prev.filter((x) => x.uid !== u.uid),
                          )
                        }
                      >
                        <span className="material-icons text-base">close</span>
                      </button>
                    </>
                  )}
                </>
              }
              subContent={
                <>
                  {u.status === "uploading" && (
                    <div className="ml-6 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                  )}
                  {u.status === "error" && u.error && (
                    <p className="ml-6 text-xs text-red-500">{u.error}</p>
                  )}
                </>
              }
            />
          ))}
        </ul>
      )}

      {!readOnly && hasFiles && (
        <div className="flex items-center justify-between pt-1 text-xs text-slate-400 border-t border-slate-100">
          <span>첨부된 파일</span>
          <span>
            {totalCount}
            {maxFiles !== undefined ? ` / ${maxFiles}` : ""}개
          </span>
        </div>
      )}

      {!canAdd && !readOnly && (
        <p className="text-xs text-slate-400">
          최대 {maxFiles}개까지 첨부 가능합니다.
        </p>
      )}

      {canAdd && (
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={!maxFiles || maxFiles > 1}
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []) as FileWithPath[];
            if (files.length) processFiles(files);
            e.target.value = "";
          }}
        />
      )}
    </div>
  );
}
