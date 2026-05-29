import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/lib/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { StatsMinistryRow } from './ministryModel';

export const statsMinistryApi = {
    async getMinistryList(): Promise<StatsMinistryRow[]> {
        try {
            const response = await client.get<ApiResponse<{ content: StatsMinistryRow[] }>>('/erp/stats/ministry');
            return response.data.data?.content ?? [];
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '?¬ì—­ ?µê³„ ?°ì´?°ë? ë¶ˆëŸ¬?¤ì? ëª»í–ˆ?µë‹ˆ??'));
        }
    },
};
