import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { GalleryContent } from './galleryModel';

export const galleryApi = {
  async getGalleryContent(): Promise<GalleryContent | null> {
    try {
      const response = await client.get<ApiResponse<GalleryContent>>('/official/news/gallery');
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};