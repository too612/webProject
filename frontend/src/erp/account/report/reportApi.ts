import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { AccountReportData } from './reportModel';

export const accountReportApi = {
  async getReport(year: string, month: string): Promise<AccountReportData> {
    try {
      const params: Record<string, string> = {};
      if (year) params.year = year;
      if (month) params.month = month;

      const response = await client.get<ApiResponse<AccountReportData>>('/erp/account/report', { params });
      return response.data.data ?? { income: 0, expense: 0, balance: 0, items: [] };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};


