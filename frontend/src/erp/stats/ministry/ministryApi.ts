import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { StatsMinistryRow } from './ministryModel';

export const statsMinistryApi = {
    async getMinistryList(): Promise<StatsMinistryRow[]> {
        try {
            const response = await client.get<ApiResponse<{ content: StatsMinistryRow[] }>>('/erp/stats/ministry');
            return response.data.data?.content ?? [];
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
        }
    },
};


