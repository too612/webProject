import client from '../../common/api/api.client';
import { getApiErrorMessage } from '../../common/api/apiError';
import type { ApiResponse } from '../../common/api/api.types';
import type { ErpIndexData } from './erpIndexModel';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isErpIndexData(value: unknown): value is ErpIndexData {
  return isRecord(value)
    && isCount(value.totalMembers)
    && isCount(value.activeMemberCount)
    && isCount(value.newMemberCount)
    && isCount(value.departmentCount)
    && Array.isArray(value.monthlyRegistrations)
    && value.monthlyRegistrations.every(isMonthlyRegistration)
    && Array.isArray(value.serviceStatusDistribution)
    && value.serviceStatusDistribution.every(isMemberCategory)
    && Array.isArray(value.employmentDistribution)
    && value.employmentDistribution.every(isMemberCategory)
    && Array.isArray(value.departmentStaff)
    && value.departmentStaff.every(isDepartmentStaff);
}

function isMonthlyRegistration(value: unknown): value is ErpIndexData['monthlyRegistrations'][number] {
  return isRecord(value)
    && typeof value.month === 'string'
    && /^\d{4}-(0[1-9]|1[0-2])$/.test(value.month)
    && isCount(value.count);
}

function isMemberCategory(value: unknown): value is ErpIndexData['serviceStatusDistribution'][number] {
  return isRecord(value)
    && typeof value.code === 'string'
    && typeof value.label === 'string'
    && isCount(value.count);
}

function isDepartmentStaff(value: unknown): value is ErpIndexData['departmentStaff'][number] {
  return isRecord(value)
    && typeof value.departmentCode === 'string'
    && typeof value.department === 'string'
    && isCount(value.staffCount);
}

export const erpIndexApi = {
  async getIndexData(): Promise<ErpIndexData> {
    try {
      const response = await client.get<ApiResponse<ErpIndexData>>('/erp/index');
      const payload = response.data.data;
      if (!isErpIndexData(payload)) {
        throw new Error('ERP 대시보드 응답 형식이 올바르지 않습니다.');
      }
      return payload;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'));
    }
  },
};
