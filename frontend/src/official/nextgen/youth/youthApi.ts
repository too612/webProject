import client from "../../../common/api/api.client";
import type { ApiResponse } from "../../../common/api/api.types";
import type { YouthPageContent } from "./youthModel";
import { YOUTH_API_BASE_PATH } from "./youthModel";

function isYouthPageContent(value: unknown): value is YouthPageContent {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<YouthPageContent>;
  return (
    typeof data.headline === "string" &&
    typeof data.summary === "string" &&
    Array.isArray(data.departments)
  );
}

export const youthApi = {
  async getYouthPageContent(): Promise<YouthPageContent | null> {
    try {
      const response =
        await client.get<ApiResponse<YouthPageContent>>(YOUTH_API_BASE_PATH);
      const payload = response.data.data;
      return isYouthPageContent(payload) ? payload : null;
    } catch {
      return null;
    }
  },
};
