import client from '../api/api.client';
import type { ApiResponse } from '../api/api.types';
import type { AttachmentFile } from './attachmentModel';

const BASE_URL = '/common/files';

export const attachmentApi = {
  /**
   * 단일 파일 업로드
   * POST /api/common/files/upload
   * - pgmId, refId 는 호출 시점에 주입 (upload 함수 시그니처 확장)
   * - Attachment 컴포넌트의 onUploadFile prop 에 맞게 래핑해서 사용
   */
  async upload(
    file: File,
    pgmId: string,
    refId: string,
    onProgress?: (pct: number) => void
  ): Promise<AttachmentFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pgmId', pgmId);
    formData.append('refId', refId);

    const response = await client.post<ApiResponse<AttachmentFile>>(
      `${BASE_URL}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      }
    );

    const data = response.data.data;
    if (!data) throw new Error('업로드 응답 데이터가 없습니다.');
    return data;
  },

  /**
   * 파일 단건 소프트 삭제
   * DELETE /api/common/files/{fileId}
   */
  async remove(fileId: string | number): Promise<void> {
    await client.delete(`${BASE_URL}/${fileId}`);
  },

  /**
   * 다운로드 URL 생성기
   * GET /api/common/files/{fileId}/download
   */
  buildDownloadUrl(fileId: string | number): string {
    return `/api${BASE_URL}/${fileId}/download`;
  },
};
