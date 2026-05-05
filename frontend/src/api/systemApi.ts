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

export type SystemListResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type SystemListQuery = {
  page?: number;
  size?: number;
  keyword?: string;
  [key: string]: string | number | undefined;
};

function toListResult<T>(page: SpringPage<T> | null | undefined): SystemListResult<T> {
  return {
    items: page?.content ?? [],
    page: page?.number ?? 0,
    size: page?.size ?? 10,
    totalElements: page?.totalElements ?? 0,
    totalPages: page?.totalPages ?? 0,
  };
}

async function fetchList<T>(path: string, query: SystemListQuery = {}): Promise<SystemListResult<T>> {
  const params: Record<string, string | number> = { page: query.page ?? 0, size: query.size ?? 10 };
  if (query.keyword) params.keyword = query.keyword;
  Object.entries(query).forEach(([k, v]) => {
    if (k !== 'page' && k !== 'size' && k !== 'keyword' && v !== undefined) params[k] = v;
  });
  const response = await client.get<ApiResponse<SpringPage<T>>>(path, { params });
  return toListResult(response.data.data);
}

export const systemApi = {
  async getPages() {
    const response = await client.get<ApiResponse<Record<string, PageMeta[]>>>('/system/pages');
    return response.data.data ?? {};
  },

  // ── 사용자 관리 ──────────────────────────────────────────────
  user: {
    getList:  (q?: SystemListQuery) => fetchList<Record<string, unknown>>('/system/user/list', q),
    getRoles: (q?: SystemListQuery) => fetchList<Record<string, unknown>>('/system/user/roles', q),
  },

  // ── 설정 관리 ────────────────────────────────────────────────
  config: {
    getCodes: (q?: SystemListQuery) => fetchList<Record<string, unknown>>('/system/config/codes', q),
    getMenus: (q?: SystemListQuery) => fetchList<Record<string, unknown>>('/system/config/menus', q),
  },

  // ── 로그 관리 ────────────────────────────────────────────────
  log: {
    getSystem: (q?: SystemListQuery) => fetchList<Record<string, unknown>>('/system/log/system', q),
    getAudit:  (q?: SystemListQuery) => fetchList<Record<string, unknown>>('/system/log/audit', q),
  },

  // ── 백업 관리 ────────────────────────────────────────────────
  backup: {
    getPolicy:  (q?: SystemListQuery) => fetchList<Record<string, unknown>>('/system/backup/policy', q),
    getHistory: (q?: SystemListQuery) => fetchList<Record<string, unknown>>('/system/backup/history', q),
  },
};
