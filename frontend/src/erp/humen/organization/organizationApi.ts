import client from "../../../common/api/api.client";
import { getApiErrorMessage } from "../../../common/api/apiError";
import type { ApiResponse } from "../../../common/api/api.types";
import type { OrganizationDetail, OrganizationReorg } from "./organizationModel";

type SpringPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type OrganizationListResult = {
  items: OrganizationReorg[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function errorMessage(error: unknown): Error {
  return new Error(getApiErrorMessage(error, "조직개편 요청 중 오류가 발생했습니다."));
}

export const organizationApi = {
  async getReorgList(query: { page: number; size: number; keyword?: string }): Promise<OrganizationListResult> {
    try {
      const response = await client.get<ApiResponse<SpringPage<OrganizationReorg>>>("/erp/humen/organization", {
        params: query,
      });
      const page = response.data.data;
      return {
        items: page?.content ?? [],
        page: page?.number ?? 0,
        size: page?.size ?? query.size,
        totalElements: page?.totalElements ?? 0,
        totalPages: page?.totalPages ?? 0,
      };
    } catch (error) {
      throw errorMessage(error);
    }
  },

  async getReorg(reorgKey: string): Promise<OrganizationDetail> {
    try {
      const response = await client.get<ApiResponse<OrganizationDetail>>(`/erp/humen/organization/${reorgKey}`);
      if (!response.data.data) throw new Error("조직개편 상세 응답이 비어 있습니다.");
      return response.data.data;
    } catch (error) {
      throw errorMessage(error);
    }
  },

  async createReorg(request: { reorgDt: string; reorgTitle?: string; remark?: string }): Promise<OrganizationDetail> {
    try {
      const response = await client.post<ApiResponse<OrganizationDetail>>("/erp/humen/organization", request);
      if (!response.data.data) throw new Error("조직개편 등록 응답이 비어 있습니다.");
      return response.data.data;
    } catch (error) {
      throw errorMessage(error);
    }
  },

  async addDepartment(reorgKey: string, request: {
    deptNm: string;
    engDeptNm?: string;
    parentDeptKey?: string;
    changeTypeCd?: string;
    chefEmpNo?: string;
    deptSysCd?: string;
    remark?: string;
  }): Promise<void> {
    try {
      await client.post(`/erp/humen/organization/${reorgKey}/departments`, request);
    } catch (error) {
      throw errorMessage(error);
    }
  },

  async changeParent(reorgKey: string, deptKey: string, parentDeptKey?: string): Promise<void> {
    try {
      await client.put(`/erp/humen/organization/${reorgKey}/departments/${deptKey}/parent`, undefined, {
        params: parentDeptKey ? { parentDeptKey } : {},
      });
    } catch (error) {
      throw errorMessage(error);
    }
  },

  async moveDepartment(reorgKey: string, deptKey: string, request: {
    parentDeptKey?: string | null;
    targetIndex: number;
  }): Promise<void> {
    try {
      await client.put(
        `/erp/humen/organization/${reorgKey}/departments/${deptKey}/placement`,
        request,
      );
    } catch (error) {
      throw errorMessage(error);
    }
  },

  async updateDepartment(reorgKey: string, deptKey: string, request: {
    deptNm: string;
    engDeptNm?: string;
    chefEmpNo?: string;
    deptSysCd?: string;
    remark?: string;
  }): Promise<void> {
    try {
      await client.put(`/erp/humen/organization/${reorgKey}/departments/${deptKey}`, request);
    } catch (error) {
      throw errorMessage(error);
    }
  },

  async removeDepartment(reorgKey: string, deptKey: string): Promise<void> {
    try {
      await client.delete(`/erp/humen/organization/${reorgKey}/departments/${deptKey}`);
    } catch (error) {
      throw errorMessage(error);
    }
  },

  async confirmReorg(reorgKey: string): Promise<void> {
    try {
      await client.post(`/erp/humen/organization/${reorgKey}/confirm`);
    } catch (error) {
      throw errorMessage(error);
    }
  },
};
