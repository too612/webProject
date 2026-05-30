import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CommunityWorldEconomicData } from './economicModel';

type SpringPage<T> = {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

export const communityWorldEconomicApi = {
    async getEconomicData(): Promise<CommunityWorldEconomicData> {
        try {
            const response = await client.get<ApiResponse<SpringPage<CommunityWorldEconomicData>>>('/community/world/economic', {
                params: { page: 0, size: 1 },
            });
            return response.data.data?.content?.[0] ?? {};
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
        }
    },
};


