import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CommunityGroupB2Row } from './b2Model';

export type CommunityGroupB2ListResult<T> = {
    items: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

type SpringPage<T> = {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

function toListResult<T>(page: SpringPage<T> | null | undefined): CommunityGroupB2ListResult<T> {
    return {
        items: page?.content ?? [],
        page: page?.number ?? 0,
        size: page?.size ?? 10,
        totalElements: page?.totalElements ?? 0,
        totalPages: page?.totalPages ?? 0,
    };
}

export const communityGroupB2Api = {
    async getB2List(): Promise<CommunityGroupB2ListResult<CommunityGroupB2Row>> {
        try {
            const response = await client.get<ApiResponse<SpringPage<CommunityGroupB2Row>>>('/community/group/b2', {
                params: { page: 0, size: 20 },
            });
            return toListResult(response.data.data);
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
        }
    },
};

