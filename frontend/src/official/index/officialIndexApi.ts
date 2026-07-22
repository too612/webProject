import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import { EMPTY_OFFICIAL_INDEX_DATA, type OfficialIndexData } from './officialIndexModel';

function okStr(v: unknown): boolean { return v === null || v === undefined || typeof v === 'string'; }
function isItem(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  var c = v as Record<string, unknown>;
  return typeof c.id === 'string' && typeof c.title === 'string' && typeof c.date === 'string';
}
function arrOk(v: unknown, fn: (x: unknown) => boolean): boolean {
  if (v === null || v === undefined) return true;
  if (!Array.isArray(v)) return false;
  return v.length === 0 || v.every(fn);
}
function isBanner(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  var c = v as Record<string, unknown>;
  return typeof c.id === 'string' && typeof c.title === 'string' && okStr(c.imageUrl);
}
function isGallery(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  var c = v as Record<string, unknown>;
  return typeof c.id === 'string' && typeof c.title === 'string' && typeof c.date === 'string'
    && okStr(c.imageUrl) && okStr(c.contentHtml);
}
function isOfficialIndexData(v: unknown): v is OfficialIndexData {
  if (!v || typeof v !== 'object') return false;
  var c = v as Record<string, unknown>;
  return Array.isArray(c.recentAnnouncements) && c.recentAnnouncements.every(isItem)
    && arrOk(c.slideBanners, isBanner) && arrOk(c.popupBanners, isBanner)
    && arrOk(c.recentBulletins, isItem) && arrOk(c.recentGalleries, isGallery);
}
export var officialIndexApi = {
  getIndexData: async function (): Promise<OfficialIndexData> {
    try {
      var res = await client.get<ApiResponse<OfficialIndexData>>('/official/index');
      var payload = res.data.data;
      return isOfficialIndexData(payload) ? payload : EMPTY_OFFICIAL_INDEX_DATA;
    } catch (e) { throw new Error(getApiErrorMessage(e, '요청 처리 중 오류가 발생했습니다.')); }
  },
};