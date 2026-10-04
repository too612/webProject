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
  excelToken?: string;
};

export type ManagerListQuery = {
  page?: number;
  size?: number;
  keyword?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
} & Partial<ManagerFilters>;

type SpringPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function toListResult<T>(
  page: SpringPage<T>,
): ManagerListResult<T> {
  return {
    items: page.content,
    page: page.number,
    size: page.size,
    totalElements: page.totalElements,
    totalPages: page.totalPages,
  };
}

export const managerApi = {
  async getManagerList(
    query: ManagerListQuery,
    signal?: AbortSignal,
  ): Promise<ManagerListResult<ManagerRow>> {
    try {
      const params = Object.fromEntries(
        Object.entries(query).filter(
          ([, value]) => value !== undefined && value !== "",
        ),
      ) as Record<string, string | number>;

      const response = await client.get<ApiResponse<SpringPage<ManagerRow>>>(
        "/erp/humen/manager",
        { params: { ...params, excelSnapshot: true }, signal },
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "인사 목록 응답이 올바르지 않습니다.");
      }
      const header = response.headers["x-excel-snapshot"];
      const token = typeof header === "string" ? header : undefined;
      const result = toListResult(response.data.data);
      return { ...result, excelToken: token,
        items: result.items.map((row, index) => ({ ...row, excelRef: token ? { token, index } : undefined })) };
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async getFilterOptions(signal?: AbortSignal): Promise<ManagerFilterOptions> {
    try {
      const response = await client.get<ApiResponse<ManagerFilterOptions>>(
        "/erp/humen/manager/options",
        { signal },
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "인사 검색조건 응답이 올바르지 않습니다.");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "인사 필터 옵션을 불러오지 못했습니다."),
      );
    }
  },

  async getPersonDetail(employeeNo: string, signal?: AbortSignal): Promise<ManagerPersonDetail> {
    try {
      const response = await client.get<ApiResponse<ManagerPersonDetail>>(
        `/erp/humen/manager/${encodeURIComponent(employeeNo)}`,
        { signal },
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "인사정보를 찾을 수 없습니다.");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "인사 상세정보를 불러오지 못했습니다."),
      );
    }
  },

  async createPerson(request: ManagerCreateRequest): Promise<void> {
    try {
      const response = await client.post<ApiResponse<void>>("/erp/humen/manager", request);
      if (!response.data.success) {
        throw new Error(response.data.message || "인사정보 등록에 실패했습니다.");
      }
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "인사정보 등록에 실패했습니다."),
      );
    }
  },
};
