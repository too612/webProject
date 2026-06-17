/**
 * File Name   : attachmentApi
 * Description : 첨부파일 API 통신 모듈 (fileUsage 지원)
 */

import client from '../api/api.client';
import type { ApiResponse } from '../api/api.types';
import type { AttachmentFile } from './attachmentModel';

const BASE_URL = '/common/files';

export const attachmentApi = {
  /**
   * 단일 파일 업로드
   * POST /api/common/files/upload
   * @param file 업로드할 파일
   * @param pgmId 프로그램 ID (예: 'sermon', 'pastor')
   * @param refId 참조 ID (예: 게시글 번호)
   * @param usage 파일 용도 ('editor' 또는 'attachment', 기본 'attachment')
   * @param onProgress 진행률 콜백
   */
  async upload(
    file: File,
    pgmId: string,
    refId: string,
    usage: 'editor' | 'attachment' = 'attachment', // ★ usage 추가
    onProgress?: (pct: number) => void
  ): Promise<AttachmentFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pgmId', pgmId);
    formData.append('refId', refId);
    formData.append('fileUsage', usage); // ★ 서버로 전송

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