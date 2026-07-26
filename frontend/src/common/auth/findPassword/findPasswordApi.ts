import client from "../../api/api.client";
import type { ApiResponse } from "../../../common/api/api.types";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  FindPasswordSendCodeRequest,
  FindPasswordSendCodeResponse,
  FindPasswordVerifyCodeRequest,
  FindPasswordVerifyCodeResponse,
  ResetPasswordRequest,
} from "./findPasswordModel";

export const findPasswordApi = {
  async sendCode(
    request: FindPasswordSendCodeRequest,
  ): Promise<FindPasswordSendCodeResponse> {
    try {
      const response = await client.post<
        ApiResponse<FindPasswordSendCodeResponse>
      >("/auth/find-password/send-code", request);
      const data = response.data.data;
      if (!data) {
        throw new Error("인증코드 발송 응답이 올바르지 않습니다.");
      }
      return data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async verifyCode(
    request: FindPasswordVerifyCodeRequest,
  ): Promise<FindPasswordVerifyCodeResponse> {
    try {
      const response = await client.post<
        ApiResponse<FindPasswordVerifyCodeResponse>
      >("/auth/find-password/verify-code", request);
      const data = response.data.data;
      if (!data) {
        throw new Error("인증코드 확인 응답이 올바르지 않습니다.");
      }
      return data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    try {
      await client.post<ApiResponse<{ updated: boolean }>>(
        "/auth/find-password/reset",
        request,
      );
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },
};
