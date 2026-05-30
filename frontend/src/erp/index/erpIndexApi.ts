import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import { EMPTY_ERP_INDEX_DATA, type ErpIndexData } from './erpIndexModel';

function isErpIndexTaskItem(value: unknown): value is ErpIndexData['recentSermonTasks'][number] {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ErpIndexData['recentSermonTasks'][number]>;
  return typeof candidate.id === 'string'
    && typeof candidate.title === 'string'
    && typeof candidate.status === 'string'
    && typeof candidate.date === 'string';
}

function isErpIndexData(value: unknown): value is ErpIndexData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ErpIndexData>;
  return typeof candidate.totalMembers === 'number'
    && typeof candidate.sermonPendingCount === 'number'
    && typeof candidate.accountRecordCount === 'number'
    && Array.isArray(candidate.recentSermonTasks)
    && candidate.recentSermonTasks.every((item) => isErpIndexTaskItem(item));
}

export const erpIndexApi = {
  async getIndexData(): Promise<ErpIndexData> {
    try {
      const response = await client.get<ApiResponse<ErpIndexData>>('/erp/index');
      const payload = response.data.data;
      return isErpIndexData(payload) ? payload : EMPTY_ERP_INDEX_DATA;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};


