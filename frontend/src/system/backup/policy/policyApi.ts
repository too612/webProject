import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { SystemBackupPolicyRow } from './policyModel';

export type SystemBackupPolicyListResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type SystemBackupPolicyListQuery = {
  page?: number;
  size?: number;
};

type SpringPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function toListResult<T>(page: SpringPage<T> | null | undefined): SystemBackupPolicyListResult<T> {
  return {
    items: page?.content ?? [],
    page: page?.number ?? 0,
    size: page?.size ?? 10,
    totalElements: page?.totalElements ?? 0,
    totalPages: page?.totalPages ?? 0,
  };
}

export const systemBackupPolicyApi = {
  async getPolicyList(query: SystemBackupPolicyListQuery): Promise<SystemBackupPolicyListResult<SystemBackupPolicyRow>> {
    try {
      const params: Record<string, string | number> = {
        page: query.page ?? 0,
        size: query.size ?? 10,
      };

      const response = await client.get<ApiResponse<SpringPage<SystemBackupPolicyRow>>>('/system/backup/policy', { params });
      return toListResult(response.data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '諛깆뾽 ?뺤콉 紐⑸줉??遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
    }
  },
};

