import client from './client';
import type { ApiResponse } from '../types';

type PageMeta = {
  title: string;
  path: string;
  section: string;
  template: string;
};

type SpringPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CommunityListResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CommunityListQuery = {
  page?: number;
  size?: number;
  keyword?: string;
  [key: string]: string | number | undefined;
};

function toListResult<T>(page: SpringPage<T> | null | undefined): CommunityListResult<T> {
  return {
    items: page?.content ?? [],
    page: page?.number ?? 0,
    size: page?.size ?? 10,
    totalElements: page?.totalElements ?? 0,
    totalPages: page?.totalPages ?? 0,
  };
}

async function fetchList<T>(path: string, query: CommunityListQuery = {}): Promise<CommunityListResult<T>> {
  const params: Record<string, string | number> = { page: query.page ?? 0, size: query.size ?? 10 };
  if (query.keyword) params.keyword = query.keyword;
  Object.entries(query).forEach(([k, v]) => {
    if (k !== 'page' && k !== 'size' && k !== 'keyword' && v !== undefined) params[k] = v;
  });
  const response = await client.get<ApiResponse<SpringPage<T>>>(path, { params });
  return toListResult(response.data.data);
}

export const communityApi = {
  // ── 페이지 메타 ─────────────────────────────────────────────
  async getFacilitiesPages() {
    const response = await client.get<ApiResponse<PageMeta[]>>('/community/facilities/pages');
    return response.data.data ?? [];
  },
  async getGroupPages() {
    const response = await client.get<ApiResponse<PageMeta[]>>('/community/group/pages');
    return response.data.data ?? [];
  },
  async getSaintPages() {
    const response = await client.get<ApiResponse<PageMeta[]>>('/community/saint/pages');
    return response.data.data ?? [];
  },
  async getWorldPages() {
    const response = await client.get<ApiResponse<PageMeta[]>>('/community/world/pages');
    return response.data.data ?? [];
  },

  // ── 교구 (group) ────────────────────────────────────────────
  group: {
    getList:  (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/group/list', q),
    getA1:    (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/group/a1', q),
    getB2:    (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/group/b2', q),
  },

  // ── 시설 (facilities) ───────────────────────────────────────
  facilities: {
    getCalendar: async (year?: string, month?: string) => {
      const params: Record<string, string> = {};
      if (year) params.year = year;
      if (month) params.month = month;
      const r = await client.get<ApiResponse<{ events: unknown[] }>>('/community/facilities/calendar', { params });
      return r.data.data?.events ?? [];
    },
    getDining: (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/facilities/dining', q),
    getPrayer: async () => {
      const r = await client.get<ApiResponse<{ rooms: unknown[] }>>('/community/facilities/prayer');
      return r.data.data?.rooms ?? [];
    },
  },

  // ── 성도 (saint) ─────────────────────────────────────────────
  saint: {
    getFamily: (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/saint/family', q),
    getPray:   (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/saint/pray', q),
    getSales:  (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/saint/sales', q),
    getJob:    (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/saint/job', q),
  },

  // ── 세상소식 (world) ─────────────────────────────────────────
  world: {
    getChristian: (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/world/christian', q),
    getEconomic:  (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/world/economic', q),
    getHealth:    (q?: CommunityListQuery) => fetchList<Record<string, unknown>>('/community/world/health', q),
  },
};
