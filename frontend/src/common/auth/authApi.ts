import client from "../../common/api/api.client";
import type { ApiResponse } from "../../common/api/api.types";
import type { UserType } from "./authModel";
import { getApiErrorMessage } from "../api/apiError";

type GetCurrentUserApiResponse = UserType;
type CheckSessionApiResponse = { authenticated: boolean };

export const authApi = {
  logout: async (): Promise<boolean> => {
    try {
      await client.post("/auth/logout");
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      return true;
    } catch {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      return false;
    }
  },

  getCurrentUser: async (): Promise<GetCurrentUserApiResponse | null> => {
    try {
      const response =
        await client.get<ApiResponse<GetCurrentUserApiResponse>>("/auth/me");
      return response.data.data || null;
    } catch {
      return null;
    }
  },

  checkSession: async (): Promise<boolean> => {
    try {
      const response =
        await client.get<ApiResponse<CheckSessionApiResponse>>("/auth/check");
      if (response.data.statusCode === 401) return false;
      if (!response.data.success || typeof response.data.data?.authenticated !== "boolean") {
        throw new Error("로그인 상태 확인 응답이 올바르지 않습니다.");
      }
      return response.data.data.authenticated;
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const response = error.response;
        if (typeof response === "object" && response !== null
          && "status" in response && response.status === 401) return false;
      }
      throw new Error(getApiErrorMessage(error, "로그인 상태를 확인하지 못했습니다. 다시 시도해 주세요."));
    }
  },
};
