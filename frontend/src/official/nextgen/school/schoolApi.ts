import client from "../../../common/api/api.client";
import type { ApiResponse } from "../../../common/api/api.types";
import type { SchoolPageContent } from "./schoolModel";
import { SCHOOL_API_BASE_PATH } from "./schoolModel";

function isSchoolPageContent(value: unknown): value is SchoolPageContent {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<SchoolPageContent>;
  return (
    typeof data.headline === "string" &&
    typeof data.summary === "string" &&
    Array.isArray(data.activities)
  );
}

export const schoolApi = {
  async getSchoolPageContent(): Promise<SchoolPageContent | null> {
    try {
      const response =
        await client.get<ApiResponse<SchoolPageContent>>(SCHOOL_API_BASE_PATH);
      const payload = response.data.data;
      return isSchoolPageContent(payload) ? payload : null;
    } catch {
      return null;
    }
  },
};
