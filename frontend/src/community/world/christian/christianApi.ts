import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CommunityWorldChristianNewsRow } from './christianModel';

type CommunityWorldChristianListQuery = {
    page?: number;
    size?: number;
    keyword?: string;
};

type SpringPage<T> = {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

export const communityWorldChristianApi = {
    async getChristianNews(query: CommunityWorldChristianListQuery): Promise<CommunityWorldChristianNewsRow[]> {
        try {
            const params: Record<string, string | number> = {
                page: query.page ?? 0,
                size: query.size ?? 50,
            };

            if (query.keyword) {
                params.keyword = query.keyword;
            }

            const response = await client.get<ApiResponse<SpringPage<CommunityWorldChristianNewsRow>>>('/community/world/christian', { params });
            return response.data.data?.content ?? [];
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '湲곕룆援??뚯떇 ?곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
        }
    },
};

