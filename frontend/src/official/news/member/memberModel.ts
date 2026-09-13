export const MEMBER_NEWS_BASE_PATH = "/news/member";
export const MEMBER_NEWS_MENU_KEY = "MEMBER_NEWS";
export const MEMBER_NEWS_TEMPLATE_CODE = "MEMBER_NEWS";

export const MEMBER_EVENT_TYPE_OPTIONS = [
  { label: "결혼", value: "300-010" },
  { label: "출산", value: "300-020" },
  { label: "은퇴", value: "300-030" },
  { label: "장례", value: "300-040" },
] as const;

export type MemberEventType =
  (typeof MEMBER_EVENT_TYPE_OPTIONS)[number]["value"];

export type MemberNewsMetadata = {
  eventType?: MemberEventType;
};
