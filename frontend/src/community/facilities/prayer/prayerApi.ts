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
            throw new Error(getApiErrorMessage(error, '湲곕룄???덉빟 ?곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
        }
    },
};
