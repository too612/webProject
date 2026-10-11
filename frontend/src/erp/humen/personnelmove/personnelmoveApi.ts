import client from "../../../common/api/api.client";
import type { ApiResponse } from "../../../common/api/api.types";
import type {
  AssignmentScope, ConcurrentMaster, EmployeeOption, PersonnelMoveOptions,
  PersonnelMoveRequest, PersonnelMoveRow, PersonnelMoveSearch,
} from "./personnelmoveModel";

export type PersonnelMovePageResult<T> = {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
  totalPages: number;
};
type ListQuery = Partial<PersonnelMoveSearch> & {
  scope: AssignmentScope;
  page: number;
  size: number;
  sort?: string;
  direction?: "asc" | "desc";
};
const BASE = "/erp/humen/personnelmove";
function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data == null) {
    throw new Error(response.message || "인사발령 응답이 올바르지 않습니다.");
  }
  return response.data;
}
export const personnelmoveApi = {
  async getList(query: ListQuery, signal?: AbortSignal) {
    const params = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== ""));
    const response = await client.get<ApiResponse<PersonnelMovePageResult<PersonnelMoveRow>>>(
      BASE, { params: { ...params, excelSnapshot: true }, signal },
    );
    const result = unwrap(response.data);
    const header: unknown = response.headers["x-excel-snapshot"];
    const token = typeof header === "string" ? header : undefined;
    return { ...result, excelToken: token, content: result.content.map((row, index) => ({
      ...row, excelRef: token ? { token, index } : undefined,
    })) };
  },
  async getDetail(key: string, signal?: AbortSignal) {
    return unwrap((await client.get<ApiResponse<PersonnelMoveRow>>(
      `${BASE}/${encodeURIComponent(key)}`, { signal },
    )).data);
  },
  async getOptions(signal?: AbortSignal) {
    return unwrap((await client.get<ApiResponse<PersonnelMoveOptions>>(`${BASE}/options`, { signal })).data);
  },
  async getEmployees(keyword: string, signal?: AbortSignal) {
    return unwrap((await client.get<ApiResponse<PersonnelMovePageResult<EmployeeOption>>>(
      `${BASE}/employees`, { params: { keyword, page: 0, size: 50 }, signal },
    )).data);
  },
  async getConcurrent(personKey: string, signal?: AbortSignal) {
    if (!personKey) return [];
    return unwrap((await client.get<ApiResponse<ConcurrentMaster[]>>(
      `${BASE}/concurrent`, { params: { personKey }, signal },
    )).data);
  },
  async createConcurrent(personKey: string) {
    return unwrap((await client.post<ApiResponse<ConcurrentMaster>>(`${BASE}/concurrent`, { personKey })).data);
  },
  async save(request: PersonnelMoveRequest, key?: string) {
    const response = key
      ? await client.put<ApiResponse<PersonnelMoveRow>>(`${BASE}/${encodeURIComponent(key)}`, request)
      : await client.post<ApiResponse<PersonnelMoveRow>>(BASE, request);
    return unwrap(response.data);
  },
  async remove(row: PersonnelMoveRow, historicalEdit: boolean, historicalReason: string) {
    const response = await client.delete<ApiResponse<unknown>>(`${BASE}/${encodeURIComponent(row.assignmentKey)}`, {
      params: { version: row.version, historicalEdit, historicalReason },
    });
    if (!response.data.success) throw new Error(response.data.message || "발령 삭제에 실패했습니다.");
    return response.data.message;
  },
};
