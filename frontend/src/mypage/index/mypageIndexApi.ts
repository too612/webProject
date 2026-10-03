import client from '../../common/api/api.client';
import { isAxiosError } from 'axios';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import type { MypageIndexData } from './mypageIndexModel';

export class MypageIndexRequestError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = 'MypageIndexRequestError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isMypageIndexData(value: unknown): value is MypageIndexData {
  if (!isRecord(value) || (value.source !== 'LIVE' && value.source !== 'DEMO')
    || !isDate(value.asOf) || !isDate(value.periodStart) || !isDate(value.periodEnd)
    || !isRecord(value.stats)) return false;
  const stats = value.stats;
  if (!isCount(stats.totalActivities) || !isCount(stats.periodActivities)
    || !isCount(stats.currentMonthActivities) || !isCount(stats.inquiryCount)
    || !Array.isArray(value.monthlyActivities)
    || !value.monthlyActivities.every((item: unknown) => isRecord(item)
      && typeof item.month === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(item.month) && isCount(item.count))
    || !Array.isArray(value.categories)
    || !value.categories.every((item: unknown) => isRecord(item)
      && (item.label === '게시글' || item.label === '문의') && isCount(item.count))
    || !Array.isArray(value.recentActivities) || value.recentActivities.length > 5
    || !value.recentActivities.every((item: unknown) => isRecord(item)
      && typeof item.title === 'string' && (item.type === '게시글' || item.type === '문의') && isDate(item.date))) return false;
  const months = value.monthlyActivities;
  const firstMonth = new Date(`${value.periodStart}T00:00:00Z`);
  const expectedMonths = Array.from({ length: 6 }, (_, index) =>
    new Date(Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + index, 1)).toISOString().slice(0, 7));
  const expectedEnd = new Date(Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + 6, 1))
    .toISOString().slice(0, 10);
  return months.length === 6 && value.periodStart.endsWith('-01') && value.periodEnd === expectedEnd
    && value.asOf >= value.periodStart && value.asOf < value.periodEnd
    && months.every((item, index) => item.month === expectedMonths[index])
    && months.reduce((sum, item) => sum + item.count, 0) === stats.periodActivities
    && months[5].count === stats.currentMonthActivities
    && value.categories.reduce((sum, item) => sum + item.count, 0) === stats.totalActivities
    && new Set(value.categories.map((item) => item.label)).size === value.categories.length
    && value.categories.filter((item) => item.label === '문의').reduce((sum, item) => sum + item.count, 0) === stats.inquiryCount
    && stats.periodActivities <= stats.totalActivities && value.recentActivities.length <= stats.totalActivities;
}

export const mypageIndexApi = {
  async getIndexData(mode: MypageIndexData['source']): Promise<MypageIndexData> {
    try {
      const response = await client.get<ApiResponse<unknown>>('/mypage/index', { params: { mode } });
      if (!response.data.success || response.data.statusCode !== 200) {
        throw new MypageIndexRequestError(
          response.data.message || '마이페이지 조회에 실패했습니다.',
          response.data.statusCode,
        );
      }
      const payload = response.data.data;
      if (!isMypageIndexData(payload) || payload.source !== mode) {
        throw new Error('마이페이지 응답 형식 또는 집계 합계가 올바르지 않습니다.');
      }
      return payload;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new MypageIndexRequestError(
          getApiErrorMessage(error, '마이페이지 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.'),
          error.response?.status ?? 0,
        );
      }
      if (error instanceof Error) throw error;
      throw new Error('마이페이지 조회 중 알 수 없는 오류가 발생했습니다.');
    }
  },
};
