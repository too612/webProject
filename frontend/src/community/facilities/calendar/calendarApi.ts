import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { CommunityFacilitiesCalendarEvent } from './calendarModel';

export const communityFacilitiesCalendarApi = {
    async getCalendar(year?: string, month?: string): Promise<CommunityFacilitiesCalendarEvent[]> {
        try {
            const params: Record<string, string> = {};
            if (year) params.year = year;
            if (month) params.month = month;

            const response = await client.get<ApiResponse<{ events: CommunityFacilitiesCalendarEvent[] }>>('/community/facilities/calendar', { params });
            return response.data.data?.events ?? [];
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
        }
    },
};

