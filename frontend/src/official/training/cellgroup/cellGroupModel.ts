export type CellMember = {
  name: string;
  role: string;
};

export type CellGroup = {
  title: string;
  subtitle?: string;
  description: string;
  pastorName?: string;
  elderName?: string;
  members: CellMember[];
  meetingInfo?: string;
  imageUrl?: string;
};

export type CellGroupContent = {
  headline: string;
  summary: string;
  groups: CellGroup[];
};

export const DEFAULT_CELL_GROUP_CONTENT: CellGroupContent = {
  headline: "셀가족 공동체",
  summary:
    "성도모임부 하위 셀가족 공동체가 말씀과 교제로 연결되어 함께 성장합니다.",
  groups: [],
};
