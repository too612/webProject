import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import { EMPTY_COMMUNITY_INDEX, type CommunityIndexData } from './communityIndexModel';

export const communityIndexApi = {
    async getIndexData(): Promise<CommunityIndexData> {
        try {
            const response = await client.get<ApiResponse<CommunityIndexData>>('/community/index');
            return response.data.data ?? EMPTY_COMMUNITY_INDEX;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
        }
    },
};


