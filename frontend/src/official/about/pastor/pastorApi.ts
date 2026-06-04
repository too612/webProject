/**
 * File Name   : pastorApi
 * Description : 목회자소개 API 통신 모듈
 */

import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import type { Pastor, PastorRequest } from './pastorModel';
import { getApiErrorMessage } from '../../../common/api/apiError';

/****************************************************************************************************
 * api method (조회, 등록, 수정, 삭제)
 ****************************************************************************************************/

export const pastorApi = {
  async getInfo(): Promise<Pastor | null> {
    try {
      const response = await client.get<ApiResponse<Pastor>>('/official/about/pastor/getInfo');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async setCreate(request: PastorRequest, files: File[]): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      files.forEach((file) => formData.append('files', file));

      await client.post<ApiResponse<void>>('/official/about/pastor/setCreate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async setUpdate(corpId: number, request: PastorRequest, files: File[]): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      files.forEach((file) => formData.append('files', file));

      await client.put<ApiResponse<void>>(`/official/about/pastor/setUpdate/${corpId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async delRemove(corpId: number, updatedBy = 'system'): Promise<void> {
    try {
      await client.delete<ApiResponse<void>>(`/official/about/pastor/delRemove/${corpId}`, {
        params: { updatedBy },
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};


