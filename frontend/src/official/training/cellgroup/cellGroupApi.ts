import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CellGroupContent } from './cellGroupModel';

function isCellMember(value: unknown): value is CellGroupContent['groups'][number]['members'][number] {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<CellGroupContent['groups'][number]['members'][number]>;
  return typeof c.name === 'string';
}

function isCellGroup(value: unknown): value is CellGroupContent['groups'][number] {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<CellGroupContent['groups'][number]>;
  return typeof c.title === 'string' && typeof c.description === 'string' && Array.isArray(c.members) && c.members.every((m) => isCellMember(m));
}

function isCellGroupContent(value: unknown): value is CellGroupContent {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<CellGroupContent>;
  return typeof c.headline === 'string' && typeof c.summary === 'string' && Array.isArray(c.groups) && c.groups.every((g) => isCellGroup(g));
}

export const cellGroupApi = {
  async getCellGroupContent(): Promise<CellGroupContent | null> {
    try {
      const response = await client.get<ApiResponse<CellGroupContent>>('/official/training/cellgroup');
      const payload = response.data.data;
      return isCellGroupContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};