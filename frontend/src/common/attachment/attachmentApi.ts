import type { AttachmentFile } from './attachmentModel';

export const attachmentApi = {
  /** 단일 파일 업로드 — 서버 엔드포인트 확정 후 구현 */
  async upload(_file: File): Promise<AttachmentFile> {
    throw new Error('attachmentApi.upload: 미구현');
  },

  /** 파일 삭제 — 서버 엔드포인트 확정 후 구현 */
  async remove(_fileId: string | number): Promise<void> {
    throw new Error('attachmentApi.remove: 미구현');
  },

  /** 다운로드 URL 기본 생성기 */
  buildDownloadUrl(fileId: string | number): string {
    return `/api/common/files/${fileId}/download`;
  },
};
