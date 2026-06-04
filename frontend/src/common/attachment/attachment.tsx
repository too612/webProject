import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileWithPath } from 'react-dropzone';
import type { AttachmentProps } from './attachmentModel';
import { attachmentApi } from './attachmentApi';

// ── 파일 크기 포맷 ──────────────────────────────────────────
const formatSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ── 확장자 → Material Icon 이름 ─────────────────────────────
const fileIcon = (name?: string): string => {
  const ext = name?.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image';
  if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) return 'movie';
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return 'audiotrack';
  if (ext === 'pdf') return 'picture_as_pdf';
  if (['doc', 'docx'].includes(ext)) return 'article';
  if (['xls', 'xlsx'].includes(ext)) return 'table_chart';
  if (['ppt', 'pptx'].includes(ext)) return 'slideshow';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'folder_zip';
  if (['txt', 'md'].includes(ext)) return 'text_snippet';
  return 'attach_file';
};

// ── 업로드 중 파일 내부 상태 ─────────────────────────────────
type UploadStatus = 'uploading' | 'success' | 'error';
type UploadEntry = {
  uid: string;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
};

let _uidSeq = 0;
const nextUid = () => `upload-${++_uidSeq}`;

// ── accept 문자열 → react-dropzone Accept 객체 변환 ──────────
const EXT_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  zip: 'application/zip',
  txt: 'text/plain',
  jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
  mp4: 'video/mp4', mp3: 'audio/mpeg',
};

function toAcceptObj(accept?: string): Record<string, string[]> | undefined {
  if (!accept) return undefined;
  const result: Record<string, string[]> = {};
  accept.split(',').map((s) => s.trim()).forEach((item) => {
    if (item.startsWith('.')) {
      const mime = EXT_MIME[item.slice(1).toLowerCase()] ?? 'application/octet-stream';
      (result[mime] ??= []).push(item);
    } else {
      result[item] ??= [];
    }
  });
  return Object.keys(result).length ? result : undefined;
}

// ── 컴포넌트 ─────────────────────────────────────────────────
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
  readOnly = false,
  accept,
  maxFiles,
  maxFileSize,
}: AttachmentProps) {
  const [uploading, setUploading] = useState<UploadEntry[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeUploadCount = uploading.filter((u) => u.status !== 'error').length;
  const totalCount = existingFiles.length + newFiles.length + activeUploadCount;
  const canAdd = !readOnly && (maxFiles === undefined || totalCount < maxFiles);

  // ── 업로드 재시도 ─────────────────────────────────────────
  const retryUpload = useCallback(
    async (entry: UploadEntry) => {
      if (!onUploadFile) return;
      setUploading((prev) =>
        prev.map((u) =>
          u.uid === entry.uid ? { ...u, progress: 0, status: 'uploading', error: undefined } : u
        )
      );
      try {
        const result = await onUploadFile(entry.file, (pct) =>
          setUploading((prev) =>
            prev.map((u) => (u.uid === entry.uid ? { ...u, progress: pct } : u))
          )
        );
        setUploading((prev) =>
          prev.map((u) => (u.uid === entry.uid ? { ...u, progress: 100, status: 'success' } : u))
        );
        onUploaded?.(result);
        setTimeout(() => setUploading((prev) => prev.filter((u) => u.uid !== entry.uid)), 2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : '업로드 실패';
        setUploading((prev) =>
          prev.map((u) => (u.uid === entry.uid ? { ...u, status: 'error', error: msg } : u))
        );
      }
    },
    [onUploadFile, onUploaded]
  );

  // ── 파일 처리 공통 ────────────────────────────────────────
  const processFiles = useCallback(
    async (files: FileWithPath[]) => {
      const remaining = maxFiles !== undefined ? maxFiles - totalCount : Infinity;
      const candidates = files.slice(0, Math.max(0, remaining));

      const oversized = candidates.filter((f) => maxFileSize && f.size > maxFileSize);
      if (oversized.length > 0) {
        onError?.(
          `파일 크기 초과: ${oversized.map((f) => f.name).join(', ')} (최대 ${formatSize(maxFileSize)})`
        );
      }
      const valid = candidates.filter((f) => !maxFileSize || f.size <= maxFileSize);
      if (!valid.length) return;

      if (onUploadFile) {
        // 즉시 업로드 모드
        const entries: UploadEntry[] = valid.map((f) => ({
          uid: nextUid(),
          file: f,
          progress: 0,
          status: 'uploading',
        }));
        setUploading((prev) => [...prev, ...entries]);
        await Promise.allSettled(
          entries.map(async (entry) => {
            try {
              const result = await onUploadFile(entry.file, (pct) =>
                setUploading((prev) =>
                  prev.map((u) => (u.uid === entry.uid ? { ...u, progress: pct } : u))
                )
              );
              setUploading((prev) =>
                prev.map((u) =>
                  u.uid === entry.uid ? { ...u, progress: 100, status: 'success' } : u
                )
              );
              onUploaded?.(result);
              setTimeout(
                () => setUploading((prev) => prev.filter((u) => u.uid !== entry.uid)),
                2000
              );
            } catch (err) {
              const msg = err instanceof Error ? err.message : '업로드 실패';
              setUploading((prev) =>
                prev.map((u) =>
                  u.uid === entry.uid ? { ...u, status: 'error', error: msg } : u
                )
              );
            }
          })
        );
      } else {
        // 큐 모드 — 폼 제출 시 일괄 업로드
        onAdd?.(valid);
      }
    },
    [maxFiles, maxFileSize, totalCount, onAdd, onUploadFile, onUploaded, onError]
  );

  const acceptObj = toAcceptObj(accept);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
    ...(acceptObj ? { accept: acceptObj } : {}),
    disabled: !canAdd,
    noClick: true,
    noKeyboard: true,
  });

  const hasFiles = existingFiles.length > 0 || newFiles.length > 0 || uploading.length > 0;
  const helperText = [
    accept ? `형식: ${accept}` : null,
    maxFileSize ? `파일당 ${formatSize(maxFileSize)} 이하` : null,
    maxFiles !== undefined ? `최대 ${maxFiles}개` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      {...getRootProps()}
      className={[
        'relative rounded-xl border p-3 text-sm transition-colors',
        isDragActive ? 'border-blue-400 bg-blue-50/60' : 'border-slate-200 bg-slate-50/40',
      ].join(' ')}
    >
      {/* hidden dropzone input (드롭 전용) */}
      <input {...getInputProps()} />

      {/* 드래그 오버레이 */}
      {isDragActive && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-blue-50/85">
          <div className="flex flex-col items-center gap-1 text-blue-500">
            <span className="material-icons text-4xl">cloud_upload</span>
            <span className="text-xs font-medium">여기에 놓으세요</span>
          </div>
        </div>
      )}

      <div
        className={[
          'rounded-lg border border-dashed px-4 py-5 transition-colors',
          canAdd ? 'cursor-pointer' : 'cursor-default',
          isDragActive ? 'border-blue-400 bg-blue-50/70' : 'border-slate-300 bg-white',
        ].join(' ')}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <span className="material-icons text-[20px]">upload_file</span>
          </div>
          <p className="text-sm font-medium text-slate-700">
            {canAdd ? '파일을 드래그하거나 선택해서 업로드하세요' : '첨부 가능한 파일 수에 도달했습니다'}
          </p>
          <p className="text-xs text-slate-400">
            {helperText || '여러 파일을 한 번에 추가할 수 있습니다'}
          </p>
          {canAdd && (
            <button
              type="button"
              className="mt-1 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => inputRef.current?.click()}
            >
              <span className="material-icons text-sm">attach_file</span>
              파일 선택
            </button>
          )}
        </div>
      </div>

      {/* 파일 목록 */}
      {hasFiles ? (
        <ul className="mt-3 space-y-2">
          {/* 기존 파일 (서버 저장 완료) */}
          {existingFiles.map((file) => (
            <li
              key={file.fileId}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <span className="material-icons text-base text-slate-400 shrink-0">
                {fileIcon(file.orgFileNm)}
              </span>
              <a
                href={buildDownloadUrl(file.fileId)}
                download={file.orgFileNm}
                className="flex-1 truncate text-slate-700 hover:text-blue-600 hover:underline"
              >
                {file.orgFileNm ?? String(file.fileId)}
              </a>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">저장됨</span>
              <span className="shrink-0 text-xs text-slate-400">{formatSize(file.fileSize)}</span>
              {!readOnly && (
                <button
                  type="button"
                  title="삭제"
                  className="shrink-0 text-slate-300 hover:text-red-500 transition-colors"
                  onClick={() => onRemoveExisting?.(file.fileId)}
                >
                  <span className="material-icons text-base">close</span>
                </button>
              )}
            </li>
          ))}

          {/* 큐 파일 (저장 전) */}
          {newFiles.map((file, index) => (
            <li
              key={`new-${index}`}
              className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-2"
            >
              <span className="material-icons text-base text-emerald-500 shrink-0">
                {fileIcon(file.name)}
              </span>
              <span className="flex-1 truncate text-slate-700">{file.name}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-700">대기중</span>
              <span className="shrink-0 text-xs text-slate-400">{formatSize(file.size)}</span>
              <button
                type="button"
                title="취소"
                className="shrink-0 text-slate-300 hover:text-red-500 transition-colors"
                onClick={() => onRemoveNew?.(index)}
              >
                <span className="material-icons text-base">close</span>
              </button>
            </li>
          ))}

          {/* 업로드 중 */}
          {uploading.map((u) => (
            <li
              key={u.uid}
              className={[
                'flex flex-col gap-1 rounded-lg border px-3 py-2',
                u.status === 'error'
                  ? 'border-red-200 bg-red-50/60'
                  : u.status === 'success'
                    ? 'border-green-200 bg-green-50/60'
                    : 'border-blue-200 bg-blue-50/50',
              ].join(' ')}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`material-icons text-base shrink-0 ${
                    u.status === 'error'
                      ? 'text-red-400'
                      : u.status === 'success'
                        ? 'text-green-500'
                        : 'text-blue-400'
                  }`}
                >
                  {fileIcon(u.file.name)}
                </span>
                <span className="flex-1 truncate text-slate-700">{u.file.name}</span>
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-[11px]',
                    u.status === 'error'
                      ? 'bg-red-100 text-red-700'
                      : u.status === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700',
                  ].join(' ')}
                >
                  {u.status === 'error' ? '실패' : u.status === 'success' ? '완료' : '업로드중'}
                </span>
                <span className="shrink-0 text-xs text-slate-400">{formatSize(u.file.size)}</span>
                {u.status === 'uploading' && (
                  <span className="material-icons animate-spin text-base text-blue-400 shrink-0">
                    sync
                  </span>
                )}
                {u.status === 'error' && (
                  <>
                    <button
                      type="button"
                      title="재시도"
                      className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
                      onClick={() => retryUpload(u)}
                    >
                      <span className="material-icons text-base">refresh</span>
                    </button>
                    <button
                      type="button"
                      title="제거"
                      className="shrink-0 text-slate-300 hover:text-red-500 transition-colors"
                      onClick={() => setUploading((prev) => prev.filter((x) => x.uid !== u.uid))}
                    >
                      <span className="material-icons text-base">close</span>
                    </button>
                  </>
                )}
              </div>
              {u.status === 'uploading' && (
                <div className="ml-6 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-200"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
              )}
              {u.status === 'error' && u.error && (
                <p className="ml-6 text-xs text-red-500">{u.error}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        readOnly && <p className="mt-3 px-1 text-xs text-slate-400">첨부파일이 없습니다.</p>
      )}

      {/* 파일 선택 input (클릭용) */}
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
            e.target.value = '';
          }}
        />
      )}

      {!readOnly && hasFiles && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2 text-xs text-slate-500">
          <span>첨부된 파일</span>
          <span>
            {totalCount}
            {maxFiles !== undefined ? ` / ${maxFiles}` : ''}개
          </span>
        </div>
      )}
      {!canAdd && !readOnly && (
        <p className="mt-2 text-xs text-slate-400">최대 {maxFiles}개까지 첨부 가능합니다.</p>
      )}
    </div>
  );
}
