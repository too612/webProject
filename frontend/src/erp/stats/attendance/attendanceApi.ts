import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { StatsAttendanceRow } from './attendanceModel';

export const statsAttendanceApi = {
    async getAttendanceList(): Promise<StatsAttendanceRow[]> {
        try {
            const response = await client.get<ApiResponse<{ content: StatsAttendanceRow[] }>>('/erp/stats/attendance');
            return response.data.data?.content ?? [];
        } catch (error) {
            throw new Error(getApiErrorMessage(error, '異쒖꽍 ?듦퀎 ?곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?듬땲??'));
        }
    },
};

