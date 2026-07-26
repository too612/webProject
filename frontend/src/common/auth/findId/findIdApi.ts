import client from "../../api/api.client";
import type { ApiResponse } from "../../../common/api/api.types";
import { getApiErrorMessage } from "../../api/apiError";
import type {
  FindIdSendCodeRequest,
  FindIdSendCodeResponse,
  FindIdVerifyCodeRequest,
  FindIdVerifyCodeResponse,
} from "./findIdModel";

export const findIdApi = {
  async sendCode(
    request: FindIdSendCodeRequest,
  ): Promise<FindIdSendCodeResponse> {
    try {
      const response = await client.post<ApiResponse<FindIdSendCodeResponse>>(
        "/auth/find-id/send-code",
        request,
      );
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
    request: FindIdVerifyCodeRequest,
  ): Promise<FindIdVerifyCodeResponse> {
    try {
      const response = await client.post<ApiResponse<FindIdVerifyCodeResponse>>(
        "/auth/find-id/verify-code",
        request,
      );
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
};
