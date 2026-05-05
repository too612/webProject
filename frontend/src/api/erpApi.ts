import client from './client';
import type { ApiResponse } from '../types';

export type ErpPageMeta = {
  title: string;
  path: string;
  section: string;
  template: string;
};

export type ErpPageMetaMap = Record<string, ErpPageMeta[]>;

type SpringPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ErpListResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function toListResult<T>(page: SpringPage<T> | null | undefined): ErpListResult<T> {
  return {
    items: page?.content ?? [],
    page: page?.number ?? 0,
    size: page?.size ?? 10,
    totalElements: page?.totalElements ?? 0,
    totalPages: page?.totalPages ?? 0,
  };
}

export type ErpListQuery = {
  page?: number;
  size?: number;
  keyword?: string;
  [key: string]: string | number | undefined;
};

async function fetchList<T>(path: string, query: ErpListQuery = {}): Promise<ErpListResult<T>> {
  const params: Record<string, string | number> = { page: query.page ?? 0, size: query.size ?? 10 };
  if (query.keyword) params.keyword = query.keyword;
  Object.entries(query).forEach(([k, v]) => {
    if (k !== 'page' && k !== 'size' && k !== 'keyword' && v !== undefined) params[k] = v;
  });
  const response = await client.get<ApiResponse<SpringPage<T>>>(path, { params });
  return toListResult(response.data.data);
}

export const erpApi = {
  // ── 메타데이터 ──────────────────────────────────────────────
  async getPages() {
    const response = await client.get<ApiResponse<ErpPageMetaMap>>('/erp/pages');
    return response.data.data ?? {};
  },
  async getPagesExtended() {
    const response = await client.get<ApiResponse<ErpPageMetaMap>>('/erp/pages/extended');
    return response.data.data ?? {};
  },

  // ── 성도관리 (humen) ────────────────────────────────────────
  humen: {
    getManager: (q?: ErpListQuery) => fetchList('/erp/humen/manager', q),
    getDistrict: (q?: ErpListQuery) => fetchList('/erp/humen/district', q),
    getNewcomer: (q?: ErpListQuery) => fetchList('/erp/humen/newcomer', q),
    getChange:   (q?: ErpListQuery) => fetchList('/erp/humen/change', q),
  },

  // ── 설교관리 (sermon) ───────────────────────────────────────
  sermon: {
    getManager:    (q?: ErpListQuery) => fetchList('/erp/sermon/manager', q),
    getArchive:    (q?: ErpListQuery) => fetchList('/erp/sermon/archive', q),
    getAttendance: (q?: ErpListQuery) => fetchList('/erp/sermon/attendance', q),
    getOrder:      (q?: ErpListQuery) => fetchList('/erp/sermon/order', q),
  },

  // ── 회계관리 (account) ──────────────────────────────────────
  account: {
    getManager: (q?: ErpListQuery) => fetchList('/erp/account/manager', q),
    getInput:   (q?: ErpListQuery) => fetchList('/erp/account/input', q),
    getBudget:  (q?: ErpListQuery) => fetchList('/erp/account/budget', q),
    getExpense: (q?: ErpListQuery) => fetchList('/erp/account/expense', q),
    getReport: async (year?: string, month?: string) => {
      const params: Record<string, string> = {};
      if (year) params.year = year;
      if (month) params.month = month;
      const r = await client.get<ApiResponse<{ income: number; expense: number; balance: number; items: unknown[] }>>('/erp/account/report', { params });
      return r.data.data ?? { income: 0, expense: 0, balance: 0, items: [] };
    },
  },

  // ── 교육관리 (training) ─────────────────────────────────────
  training: {
    getCourse:     (q?: ErpListQuery) => fetchList('/erp/training/course', q),
    getStudent:    (q?: ErpListQuery) => fetchList('/erp/training/student', q),
    getAttendance: (q?: ErpListQuery) => fetchList('/erp/training/attendance', q),
    getComplete:   (q?: ErpListQuery) => fetchList('/erp/training/complete', q),
  },

  // ── 사역관리 (ministry) ─────────────────────────────────────
  ministry: {
    getDepartment: (q?: ErpListQuery) => fetchList('/erp/ministry/department', q),
    getSchedule:   (q?: ErpListQuery) => fetchList('/erp/ministry/schedule', q),
    getVolunteer:  (q?: ErpListQuery) => fetchList('/erp/ministry/volunteer', q),
    getReport:     (q?: ErpListQuery) => fetchList('/erp/ministry/report', q),
  },

  // ── 행사관리 (event) ───────────────────────────────────────
  event: {
    getCalendar: async (year?: string, month?: string) => {
      const params: Record<string, string> = {};
      if (year) params.year = year;
      if (month) params.month = month;
      const r = await client.get<ApiResponse<{ events: unknown[] }>>('/erp/event/calendar', { params });
      return r.data.data?.events ?? [];
    },
    getApply:       (q?: ErpListQuery) => fetchList('/erp/event/apply', q),
    getParticipant: (q?: ErpListQuery) => fetchList('/erp/event/participant', q),
    getResult:      (q?: ErpListQuery) => fetchList('/erp/event/result', q),
  },

  // ── 시설관리 (facility) ─────────────────────────────────────
  facility: {
    getReservation: (q?: ErpListQuery) => fetchList('/erp/facility/reservation', q),
    getVehicle:     (q?: ErpListQuery) => fetchList('/erp/facility/vehicle', q),
    getInventory:   (q?: ErpListQuery) => fetchList('/erp/facility/inventory', q),
    getMaintenance: (q?: ErpListQuery) => fetchList('/erp/facility/maintenance', q),
  },

  // ── 소통관리 (comm) ─────────────────────────────────────────
  comm: {
    getNotice:     (q?: ErpListQuery) => fetchList('/erp/comm/notice', q),
    getMessage:    (q?: ErpListQuery) => fetchList('/erp/comm/message', q),
    getPrayer:     (q?: ErpListQuery) => fetchList('/erp/comm/prayer', q),
    getNewsletter: (q?: ErpListQuery) => fetchList('/erp/comm/newsletter', q),
  },

  // ── 행정관리 (admin) ────────────────────────────────────────
  admin: {
    getCertificate: (q?: ErpListQuery) => fetchList('/erp/admin/certificate', q),
    getApproval:    (q?: ErpListQuery) => fetchList('/erp/admin/approval', q),
    getMinutes:     (q?: ErpListQuery) => fetchList('/erp/admin/minutes', q),
    getArchive:     (q?: ErpListQuery) => fetchList('/erp/admin/archive', q),
  },

  // ── 통계 (stats) ────────────────────────────────────────────
  stats: {
    getDashboard: async () => {
      const r = await client.get<ApiResponse<Record<string, number>>>('/erp/stats/dashboard');
      return r.data.data ?? {};
    },
    getAttendance: async (year?: string, month?: string) => {
      const params: Record<string, string> = {};
      if (year) params.year = year;
      if (month) params.month = month;
      const r = await client.get<ApiResponse<{ content: unknown[] }>>('/erp/stats/attendance', { params });
      return (r.data.data?.content ?? []) as unknown[];
    },
    getOffering: async (year?: string, month?: string) => {
      const params: Record<string, string> = {};
      if (year) params.year = year;
      if (month) params.month = month;
      const r = await client.get<ApiResponse<{ content: unknown[] }>>('/erp/stats/offering', { params });
      return (r.data.data?.content ?? []) as unknown[];
    },
    getMinistry: async (year?: string) => {
      const params: Record<string, string> = {};
      if (year) params.year = year;
      const r = await client.get<ApiResponse<{ content: unknown[] }>>('/erp/stats/ministry', { params });
      return (r.data.data?.content ?? []) as unknown[];
    },
  },
};
