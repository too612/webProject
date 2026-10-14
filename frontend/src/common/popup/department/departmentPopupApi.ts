import client from "../../api/api.client";
import type { ApiResponse } from "../../api/api.types";
import type { DepartmentPopupQuery, DepartmentPopupResult, DepartmentReorganization } from "./departmentPopupModel";

const BASE = "/common/popup/department";
function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data == null) {
    throw new Error(response.message || "부서 조회 응답이 올바르지 않습니다.");
  }
  return response.data;
}

export const departmentPopupApi = {
  async getReorganizations(signal?: AbortSignal) {
    return unwrap((await client.get<ApiResponse<DepartmentReorganization[]>>(
      `${BASE}/reorganizations`, { signal },
    )).data);
  },
  async getInfo(query: DepartmentPopupQuery = {}, signal?: AbortSignal) {
    return unwrap((await client.get<ApiResponse<DepartmentPopupResult>>(
      BASE, { params: query, signal },
    )).data);
  },
};
