import client from "../../../common/api/api.client";
import { getApiErrorMessage } from "../../../common/api/apiError";
import type { ApiResponse } from "../../../common/api/api.types";
import type {
  MissionContent,
  MissionarySummary,
  MissionApiResponse,
} from "./missionModel";

function transformMissionToSummary(
  missionary: MissionApiResponse,
): MissionarySummary {
  const dateStr = missionary.dispatchDate || missionary.dispatchedDate || "";
  const year = dateStr ? new Date(dateStr).getFullYear() : 0;
  return {
    groupKey: missionary.groupKey || missionary.countryCode,
    country: missionary.country,
    countryFlag: missionary.countryCode,
    missionaryName: missionary.name,
    sentYear: year,
    description: missionary.assignmentContent,
  };
}

async function getMissionFromApi(): Promise<MissionarySummary[]> {
  try {
    const response = await client.get<ApiResponse<MissionApiResponse[]>>(
      "/official/news/mission/getInfo",
    );
    const data = response.data.data;
    if (!response.data.success) {
      throw new Error(response.data.message || "선교지소식 데이터 조회에 실패했습니다.");
    }
    if (!Array.isArray(data)) {
      throw new Error("선교지소식 응답 형식이 올바르지 않습니다.");
    }
    return data.map(transformMissionToSummary);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "선교사 데이터 조회 중 오류가 발생했습니다."),
    );
  }
}

export const missionApi = {
  async getMissionContent(): Promise<MissionContent | null> {
    try {
      const missionaries = await getMissionFromApi();
      return {
        headline: "선교지소식",
        summary:
          "다사랑교회가 후원하고 파송한 선교사님들의 소중한 이야기입니다. 기도와 후원으로 함께 동역해 주세요.",
        missionaries,
        letters: [],
      };
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },
};
