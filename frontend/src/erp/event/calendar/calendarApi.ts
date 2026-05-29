import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/lib/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { EventCalendarItem } from './calendarModel';

export type EventCalendarQuery = {
    year?: string;
    month?: string;
};

export const eventCalendarApi = {
    async getCalendar(query: EventCalendarQuery): Promise<EventCalendarItem[]> {
        try {
            const params: Record<string, string> = {};
            if (query.year) params.year = query.year;
            if (query.month) params.month = query.month;

            const response = await client.get<ApiResponse<{ events: EventCalendarItem[] }>>('/erp/event/calendar', { params });
            return response.data.data?.events ?? [];
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '?âÏÇ¨ ?¨Î†• ?∞Ïù¥?∞Î? Î∂àÎü¨?§Ï? Î™ªÌñà?µÎãà??'));
        }
    },
};