import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CommunityGroupA1Row } from './a1Model';

export type CommunityGroupA1ListResult<T> = {
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

function toListResult<T>(page: SpringPage<T> | null | undefined): CommunityGroupA1ListResult<T> {
    return {
        items: page?.content ?? [],
        page: page?.number ?? 0,
        size: page?.size ?? 10,
        totalElements: page?.totalElements ?? 0,
        totalPages: page?.totalPages ?? 0,
    };
}

export const communityGroupA1Api = {
    async getA1List(): Promise<CommunityGroupA1ListResult<CommunityGroupA1Row>> {
        try {
            const response = await client.get<ApiResponse<SpringPage<CommunityGroupA1Row>>>('/community/group/a1', {
                params: { page: 0, size: 20 },
            });
            return toListResult(response.data.data);
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
        }
    },
};

