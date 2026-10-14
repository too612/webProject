import client from "../../api/api.client";
import type { ApiResponse } from "../../api/api.types";
import type { EmployeePopupContext, EmployeePopupQuery, EmployeePopupResult } from "./employeePopupModel";

const BASE = "/common/popup/employee";
function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data == null) {
    throw new Error(response.message || "직원 조회 응답이 올바르지 않습니다.");
  }
  return response.data;
}
export const employeePopupApi = {
  async getContext(signal?: AbortSignal) {
    return unwrap((await client.get<ApiResponse<EmployeePopupContext>>(`${BASE}/context`, { signal })).data);
  },
  async getInfo(query: EmployeePopupQuery = {}, signal?: AbortSignal) {
    return unwrap((await client.get<ApiResponse<EmployeePopupResult>>(BASE, { params: query, signal })).data);
  },
};
