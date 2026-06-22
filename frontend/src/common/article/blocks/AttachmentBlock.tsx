import React from "react";
import { Attachment } from "../../../common/attachment";
import type { AttachmentFile } from "../ArticleModel";

interface AttachmentBlockProps {
  existingFiles: AttachmentFile[];
  newFiles: File[];
  onAdd: (files: File[]) => void;
  onRemoveExisting: (fileId: string | number) => void;
  onRemoveNew: (index: number) => void;
  maxFiles?: number;
  maxFileSize?: number;
  compact?: boolean;
  label?: string;
  singleImage?: boolean;
  onError?: (message: string) => void;
}

export function AttachmentBlock({
  existingFiles,
  newFiles,
  onAdd,
  onRemoveExisting,
  onRemoveNew,
  maxFiles,
  maxFileSize,
  compact = false,
  label = "첨부파일",
  singleImage = false,
  onError,
}: Readonly<AttachmentBlockProps>) {
  // ★ 에러 메시지 전달용 핸들러
  const handleError = (message: string) => {
    console.warn("[AttachmentBlock] 파일 업로드 제한:", message);
    onError?.(message);
  };

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {singleImage && (
          <span className="text-blue-500 ml-2">(이미지 1개만)</span>
        )}
      </span>

      <Attachment
        existingFiles={existingFiles}
        newFiles={newFiles}
        onAdd={onAdd}
        onRemoveExisting={onRemoveExisting}
        onRemoveNew={onRemoveNew}
        maxFiles={singleImage ? 1 : maxFiles}
        maxFileSize={maxFileSize}
        compact={compact}
        onError={handleError}
      />
    </div>
  );
}
