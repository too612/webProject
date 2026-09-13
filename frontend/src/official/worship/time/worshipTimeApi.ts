import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import { getApiErrorMessage } from '../../../common/api/apiError';
import type { WorshipTimeItem } from './worshipTimeModel';

export const worshipTimeApi = {
  async getWorshipTimeItems(): Promise<WorshipTimeItem[]> {
    try {
      const response = await client.get<ApiResponse<WorshipTimeItem[]>>('/official/worship/time/getInfo');
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },

  async setCreate(items: WorshipTimeItem[]): Promise<void> {
    try {
      await client.post<ApiResponse<void>>('/official/worship/time/setCreate', items);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '예배시간 정보 등록에 실패했습니다.'));
    }
  },

  async setUpdate(items: WorshipTimeItem[]): Promise<void> {
    try {
      await client.put<ApiResponse<void>>('/official/worship/time/setUpdate', items);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '예배시간 정보 수정에 실패했습니다.'));
    }
  },

  async delRemove(): Promise<void> {
    try {
      await client.delete<ApiResponse<void>>('/official/worship/time/delRemove');
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '예배시간 정보 삭제에 실패했습니다.'));
    }
  },
};


