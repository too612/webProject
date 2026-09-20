import client from "../../../common/api/api.client";
import { getApiErrorMessage } from "../../../common/api/apiError";
import type { ApiResponse } from "../../../common/api/api.types";
import type { ContributionInfo } from "./contributionModel";

export const contributionApi = {
  async getInfo(): Promise<ContributionInfo | null> {
    try {
      const response = await client.get<ApiResponse<ContributionInfo>>(
        "/official/about/contribution",
      );
      return response.data.data ?? null;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "헌금 안내를 불러오지 못했습니다."),
      );
    }
  },
};
