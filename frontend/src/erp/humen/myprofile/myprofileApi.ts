import client from "../../../common/api/api.client";
import { getApiErrorMessage } from "../../../common/api/apiError";
import type { ApiResponse } from "../../../common/api/api.types";
import type { MyProfile, MyProfileContactUpdate } from "./myprofileModel";

export const myprofileApi = {
  async getMyProfile(): Promise<MyProfile> {
    try {
      const response =
        await client.get<ApiResponse<MyProfile>>("/erp/humen/myprofile");
      if (!response.data.success) {
        throw new Error(
          response.data.message || "내 정보를 불러오지 못했습니다.",
        );
      }
      if (!response.data.data) {
        throw new Error("내 인사정보를 찾을 수 없습니다.");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          error instanceof Error ? error.message : "내 정보를 불러오지 못했습니다.",
        ),
      );
    }
  },

  async updateContactInfo(contact: MyProfileContactUpdate): Promise<void> {
    try {
      const response = await client.put<ApiResponse<void>>(
        "/erp/humen/myprofile",
        contact,
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "내 연락처 정보를 저장하지 못했습니다.",
        );
      }
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          error instanceof Error
            ? error.message
            : "내 연락처 정보를 저장하지 못했습니다.",
        ),
      );
    }
  },
};
