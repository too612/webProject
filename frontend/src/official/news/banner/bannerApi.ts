/**
 * File Name   : bannerApi
 * Description : 배너 관리 API
 */
import { BANNER_API_BASE_PATH } from './bannerModel';
import type { BannerDto, BannerRequest } from './bannerModel';

export const bannerApi = {
  getList: async (boardType: string): Promise<BannerDto[]> => {
    const res = await fetch(`/api${BANNER_API_BASE_PATH}?boardType=${boardType}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  getDetail: async (rqstNo: string): Promise<BannerDto> => {
    const res = await fetch(`/api${BANNER_API_BASE_PATH}/detail/${rqstNo}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  save: async (request: BannerRequest): Promise<void> => {
    const res = await fetch(`/api${BANNER_API_BASE_PATH}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
  },

  remove: async (rqstNo: string): Promise<void> => {
    const res = await fetch(`/api${BANNER_API_BASE_PATH}/delete/${rqstNo}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
  },
};