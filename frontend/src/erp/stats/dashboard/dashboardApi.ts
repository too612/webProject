import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { StatsDashboardData } from './dashboardModel';

export const statsDashboardApi = {
    async getDashboard(): Promise<StatsDashboardData> {
        try {
            const response = await client.get<ApiResponse<StatsDashboardData>>('/erp/stats/dashboard');
            return response.data.data ?? {};
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '??쒕낫???곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
        }
    },
};

