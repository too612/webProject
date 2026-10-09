import client from "../../../common/api/api.client";
import { getApiErrorMessage } from "../../../common/api/apiError";
import { OUTREACH_MAP_NOTICE } from "./outreachModel";
import type { ApiResponse } from "../../../common/api/api.types";
import type {
  OutreachContent,
  OutreachActivity,
  OutreachApiResponse,
} from "./outreachModel";

function transformOutreachToActivity(
  missionary: OutreachApiResponse,
): OutreachActivity {
  const dateStr = missionary.dispatchDate || missionary.dispatchedDate || "";
  const year = dateStr ? new Date(dateStr).getFullYear() : 0;
  return {
    employeeNo: missionary.employeeNo,
    title: missionary.country || missionary.assignmentContent,
    country: missionary.country,
    countryCode: missionary.countryCode,
    city: missionary.city,
    region: missionary.region,
    latitude: missionary.latitude,
    longitude: missionary.longitude,
    organization: "",
    missionaryName: missionary.name,
    sentYear: year,
    assignmentContent: missionary.assignmentContent,
  };
}

async function getOutreachFromApi(): Promise<OutreachActivity[]> {
  try {
    const response = await client.get<ApiResponse<OutreachApiResponse[]>>(
      "/official/training/outreach/getInfo",
    );
    const data = response.data.data;
    if (!response.data.success) {
      throw new Error(response.data.message || "아웃리치 데이터 조회에 실패했습니다.");
    }
    if (!Array.isArray(data)) {
      throw new Error("아웃리치 응답 형식이 올바르지 않습니다.");
    }
    return data.map(transformOutreachToActivity);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "선교사 데이터 조회 중 오류가 발생했습니다."),
    );
  }
}

export const outreachApi = {
  async getOutreachContent(): Promise<OutreachContent | null> {
    try {
      const activities = await getOutreachFromApi();
      return {
        headline: "해외선교아웃리치",
        summary:
          "하나님의 사랑을 열방에 전하는 다사랑교회의 단기선교 이야기입니다. 함께 떠나는 믿음의 여정에 여러분을 초대합니다.",
        bannerTitle: "교회의 존재 이유는 선교입니다.",
        bannerDescription:
          "'mission'은 보냄을 받는 것입니다.\n다사랑교회는 복음의 통로로 세워진 모든 성도가 열방으로 보냄을 받아, 하나님이 사랑하시는 세계를 품고 섬깁니다.",
        missionSectionTitle: "선교참여 현황",
        missionSectionDescription: OUTREACH_MAP_NOTICE,
        offeringSectionTitle: "선교헌금 안내",
        offeringSectionDescription:
          "선교헌금은 매월 현지 사역과 파송 선교사를 후원하는 데 사용되며, 매년 사역 보고를 통해 투명하게 공유됩니다.",
        activities,
      };
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."),
      );
    }
  },
};
