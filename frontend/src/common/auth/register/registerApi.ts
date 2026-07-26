import client from "../../api/api.client";
import type { ApiResponse } from "../../../common/api/api.types";
import { getApiErrorMessage } from "../../api/apiError";
import type { AuthResponse } from "../authModel";
import type {
  RegisterRequest,
  TermsPolicyItem,
  TermsType,
} from "./registerModel";

type RegisterApiRequest = RegisterRequest;
type RegisterApiResponse = AuthResponse;

export const registerApi = {
  async register(request: RegisterApiRequest): Promise<RegisterApiResponse> {
    try {
      const response = await client.post<ApiResponse<RegisterApiResponse>>(
        "/auth/register",
        request,
      );
      const data = response.data.data;
      if (!data) {
        throw new Error("회원가입 응답이 올바르지 않습니다.");
      }
      return data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async checkUserId(userId: string): Promise<boolean> {
    try {
      const response = await client.get<ApiResponse<{ available: boolean }>>(
        "/auth/check-userid",
        {
          params: { userId },
        },
      );
      return response.data.data?.available ?? false;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async checkEmail(email: string): Promise<boolean> {
    try {
      const response = await client.get<ApiResponse<{ available: boolean }>>(
        "/auth/check-email",
        {
          params: { email },
        },
      );
      return response.data.data?.available ?? false;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async getActiveTermsPolicies(): Promise<
    Partial<Record<TermsType, TermsPolicyItem>>
  > {
    try {
      const response =
        await client.get<
          ApiResponse<Partial<Record<TermsType, TermsPolicyItem>>>
        >("/auth/terms/active");
      return response.data.data ?? {};
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "약관 정보를 불러오지 못했습니다."),
      );
    }
  },
};
