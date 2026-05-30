import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CommunityWorldHealthDiseaseRow } from './healthModel';

type SpringPage<T> = {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

export const communityWorldHealthApi = {
    async getHealthList(): Promise<CommunityWorldHealthDiseaseRow[]> {
        try {
            const response = await client.get<ApiResponse<SpringPage<CommunityWorldHealthDiseaseRow>>>('/community/world/health', {
                params: { page: 0, size: 100 },
            });
            return response.data.data?.content ?? [];
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '嫄닿컯 ?뺣낫 ?곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
        }
    },
};

