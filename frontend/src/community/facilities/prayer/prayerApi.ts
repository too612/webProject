import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CommunityFacilitiesPrayerRow } from './prayerModel';

export const communityFacilitiesPrayerApi = {
    async getPrayerList(): Promise<CommunityFacilitiesPrayerRow[]> {
        try {
            const response = await client.get<ApiResponse<{ rooms: CommunityFacilitiesPrayerRow[] }>>('/community/facilities/prayer');
            return response.data.data?.rooms ?? [];
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
        }
    },
};

