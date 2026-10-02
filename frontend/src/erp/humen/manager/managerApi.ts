import client from "../../../common/api/api.client";
import { getApiErrorMessage } from "../../../common/api/apiError";
import type { ApiResponse } from "../../../common/api/api.types";
import type {
  ManagerCreateRequest,
  ManagerFilterOptions,
  ManagerFilters,
  ManagerPersonDetail,
  ManagerRow,
} from "./managerModel";

export type ManagerListResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ManagerListQuery = {
  page?: number;
  size?: number;
  keyword?: string;
} & Partial<ManagerFilters>;

type SpringPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function toListResult<T>(
  page: SpringPage<T> | null | undefined,
): ManagerListResult<T> {
  return {
    items: page?.content ?? [],
    page: page?.number ?? 0,
    size: page?.size ?? 10,
    totalElements: page?.totalElements ?? 0,
    totalPages: page?.totalPages ?? 0,
  };
}

export const managerApi = {
  async getManagerList(
    query: ManagerListQuery,
  ): Promise<ManagerListResult<ManagerRow>> {
    try {
      const params = Object.fromEntries(
        Object.entries(query).filter(
          ([, value]) => value !== undefined && value !== "",
        ),
      ) as Record<string, string | number>;

      const response = await client.get<ApiResponse<SpringPage<ManagerRow>>>(
        "/erp/humen/manager",
        { params },
      );
      return toListResult(response.data.data);
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async getFilterOptions(): Promise<ManagerFilterOptions> {
    try {
      const response = await client.get<ApiResponse<ManagerFilterOptions>>(
        "/erp/humen/manager/options",
      );
      return (
        response.data.data ?? {
          departments: [],
          grades: [],
          positions: [],
          employmentTypes: [],
          serviceStatuses: [],
        }
      );
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "인사 필터 옵션을 불러오지 못했습니다."),
      );
    }
  },

  async getPersonDetail(employeeNo: string): Promise<ManagerPersonDetail> {
    try {
      const response = await client.get<ApiResponse<ManagerPersonDetail>>(
        `/erp/humen/manager/${encodeURIComponent(employeeNo)}`,
      );
      if (!response.data.data) throw new Error("인사정보를 찾을 수 없습니다.");
      return response.data.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "인사 상세정보를 불러오지 못했습니다."),
      );
    }
  },

  async createPerson(request: ManagerCreateRequest): Promise<void> {
    try {
      await client.post<ApiResponse<void>>("/erp/humen/manager", request);
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "인사정보 등록에 실패했습니다."),
      );
    }
  },
};
