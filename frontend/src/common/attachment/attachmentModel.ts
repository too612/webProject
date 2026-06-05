/** 서버에서 내려오는 첨부파일 메타데이터 (board.types.ts FileItem 대응) */
export type AttachmentFile = {
  fileId: string | number;
  orgFileNm?: string;
  storedFileNm?: string;
  fileSize?: number;
  insDt?: string;
};

/** 컴포넌트 Props */
export type AttachmentProps = {
  /** 서버에 이미 저장된 파일 목록 */
  existingFiles?: AttachmentFile[];
  /** 추가 예정인 로컬 파일 목록 (큐 모드 전용) */
  newFiles?: File[];
  /** 기존 파일 중 삭제 예정인 ID 목록 */
  deletedFileIds?: (string | number)[];
  /** 파일 추가 콜백 (큐 모드: onUploadFile 미제공 시 동작) */
  onAdd?: (files: File[]) => void;
  /** 기존 파일 삭제 콜백 */
  onRemoveExisting?: (fileId: string | number) => void;
  /** 추가 예정 파일 삭제 콜백 (큐 모드 전용) */
  onRemoveNew?: (index: number) => void;
  /**
   * 즉시 업로드 모드 — 제공 시 파일 선택 직후 서버 업로드를 진행하며 진행률 바를 표시한다.
   * @param file 업로드할 파일
   * @param onProgress 진행률 콜백 (0–100)
   * @returns 서버에서 반환된 AttachmentFile 메타데이터
   */
  onUploadFile?: (file: File, onProgress: (pct: number) => void) => Promise<AttachmentFile>;
  /** 즉시 업로드 완료 콜백 (onUploadFile 모드 전용) */
  onUploaded?: (file: AttachmentFile) => void;
  /** 오류 메시지 콜백 (크기 초과·타입 불일치 등) */
  onError?: (message: string) => void;
  /** 다운로드 URL 생성기 — fileId를 받아 URL 반환 */
  buildDownloadUrl?: (fileId: string | number) => string;
  /** 읽기 전용 (업로드·삭제 버튼 숨김) */
  readOnly?: boolean;
  /** 허용 확장자/MIME (예: "image/*", "image/*,.pdf") */
  accept?: string;
  /** 최대 파일 개수 (기본: 무제한) */
  maxFiles?: number;
  /** 파일당 최대 크기(바이트, 기본: 무제한) */
  maxFileSize?: number;
  /** 컴팩트 모드 (높이를 줄인 레이아웃) */
  compact?: boolean;
};

/** useAttachment 훅 반환값 */
export type AttachmentState = {
  existingFiles: AttachmentFile[];
  newFiles: File[];
  deletedFileIds: (string | number)[];
  addFiles: (files: File[]) => void;
  removeExisting: (fileId: string | number) => void;
  removeNew: (index: number) => void;
  /** 제출 시 FormData에 파일 목록을 append하는 헬퍼 */
  appendToFormData: (formData: FormData, fieldName?: string) => void;
  reset: (nextExisting?: AttachmentFile[]) => void;
};
