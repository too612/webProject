import client from "../../../common/api/api.client";
import { getApiErrorMessage } from "../../../common/api/apiError";
import type { ApiResponse } from "../../../common/api/api.types";
import type {
  MissionContent,
  MissionarySummary,
  MissionaryApiResponse,
} from "./missionModel";

interface MissionaryApiData {
  missionaries: MissionaryApiResponse[];
}

function transformMissionaryToSummary(
  missionary: MissionaryApiResponse,
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

async function getMissionariesFromApi(): Promise<MissionarySummary[]> {
  try {
    const response = await client.get<ApiResponse<MissionaryApiData>>(
      "/official/missionaries",
    );
    const data = response.data.data;
    if (!data || !Array.isArray(data.missionaries)) {
      return [];
    }
    return data.missionaries.map(transformMissionaryToSummary);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "선교사 데이터 조회 중 오류가 발생했습니다."),
    );
  }
}

export const missionApi = {
  async getMissionContent(): Promise<MissionContent | null> {
    try {
      const missionaries = await getMissionariesFromApi();
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
