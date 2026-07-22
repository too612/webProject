import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { ServiceGroupContent } from './serviceGroupModel';

function isServiceMember(value: unknown): value is ServiceGroupContent['groups'][number]['members'][number] {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<ServiceGroupContent['groups'][number]['members'][number]>;
  return typeof c.name === 'string';
}

function isServiceGroup(value: unknown): value is ServiceGroupContent['groups'][number] {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<ServiceGroupContent['groups'][number]>;
  return typeof c.title === 'string' && typeof c.description === 'string' && Array.isArray(c.members) && c.members.every((m) => isServiceMember(m));
}

function isServiceGroupContent(value: unknown): value is ServiceGroupContent {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<ServiceGroupContent>;
  return typeof c.headline === 'string' && typeof c.summary === 'string' && Array.isArray(c.groups) && c.groups.every((g) => isServiceGroup(g));
}

export const serviceGroupApi = {
  async getServiceGroupContent(): Promise<ServiceGroupContent | null> {
    try {
      const response = await client.get<ApiResponse<ServiceGroupContent>>('/official/training/servicegroup');
      const payload = response.data.data;
      return isServiceGroupContent(payload) ? payload : null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};