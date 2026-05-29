import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/lib/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { StatsDashboardData } from './dashboardModel';

export const statsDashboardApi = {
    async getDashboard(): Promise<StatsDashboardData> {
        try {
            const response = await client.get<ApiResponse<StatsDashboardData>>('/erp/stats/dashboard');
            return response.data.data ?? {};
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '?€?œë³´???°ì´?°ë? ë¶ˆëŸ¬?¤ì? ëª»í–ˆ?µë‹ˆ??'));
        }
    },
};
