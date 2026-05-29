import client from '../../../common/api/api.client';
import { getApiErrorMessage } from '../../../common/lib/apiError';
import type { ApiResponse } from '../../../common/api/api.types';
import type { FacilityVehicleRow } from './vehicleModel';

export type FacilityVehicleListResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type FacilityVehicleListQuery = {
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

function toListResult<T>(page: SpringPage<T> | null | undefined): FacilityVehicleListResult<T> {
  return {
    items: page?.content ?? [],
    page: page?.number ?? 0,
    size: page?.size ?? 10,
    totalElements: page?.totalElements ?? 0,
    totalPages: page?.totalPages ?? 0,
  };
}

export const facilityVehicleApi = {
  async getVehicleList(query: FacilityVehicleListQuery): Promise<FacilityVehicleListResult<FacilityVehicleRow>> {
    try {
      const params: Record<string, string | number> = {
        page: query.page ?? 0,
        size: query.size ?? 10,
      };

      if (query.keyword) {
        params.keyword = query.keyword;
      }

      const response = await client.get<ApiResponse<SpringPage<FacilityVehicleRow>>>('/erp/facility/vehicle', { params });
      return toListResult(response.data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '차량 목록??불러?��? 못했?�니??'));
    }
  },
};
