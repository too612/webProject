import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { MinistryReportRow } from './reportModel';

export type MinistryReportListResult<T> = {
    items: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

export type MinistryReportListQuery = {
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

function toListResult<T>(page: SpringPage<T> | null | undefined): MinistryReportListResult<T> {
    return {
        items: page?.content ?? [],
        page: page?.number ?? 0,
        size: page?.size ?? 10,
        totalElements: page?.totalElements ?? 0,
        totalPages: page?.totalPages ?? 0,
    };
}

export const ministryReportApi = {
    async getReportList(query: MinistryReportListQuery): Promise<MinistryReportListResult<MinistryReportRow>> {
        try {
            const params: Record<string, string | number> = {
                page: query.page ?? 0,
                size: query.size ?? 10,
            };

            if (query.keyword) {
                params.keyword = query.keyword;
            }

            const response = await client.get<ApiResponse<SpringPage<MinistryReportRow>>>('/erp/ministry/report', { params });
            return toListResult(response.data.data);
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '?ъ뿭 蹂닿퀬 紐⑸줉??遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
        }
    },
};

