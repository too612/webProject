/**
 * File Name   : sermonsList
 * Description : 설교 목록 (ArticleList Wrapper)
 * -----------------------------------------------------------------------------
 * - 공통 ArticleList에 예배구분 컬럼만 추가
 */

import { ArticleList } from "../../../common/article";
import type { GridColumnDef } from "../../../common/grid";

const WORSHIP_TYPE_LABEL_MAP: Record<string, string> = {
  SUNDAY: "주일예배",
  WEDNESDAY: "수요예배",
  DAWN: "새벽예배",
  SPECIAL: "특별예배",
};

function resolveWorshipTypeLabel(value: unknown): string {
  if (!value) return "-";
  return WORSHIP_TYPE_LABEL_MAP[String(value)] ?? String(value);
}

// ★ 예배구분 컬럼 (공통 ArticleList의 '번호'와 '제목' 사이에 삽입됨)
const worshipTypeColumn: GridColumnDef = {
  field: "worshipType",
  headerName: "예배구분",
  width: 100,
  headerClass: "text-center",
  cellClass: "text-center",
  sortable: false,
  filter: false,
  valueGetter: (params: any) => {
    let worshipType = "SUNDAY";
    try {
      const meta =
        typeof params.data.metadata === "string"
          ? JSON.parse(params.data.metadata)
          : params.data.metadata;
      worshipType = meta?.worshipType || "SUNDAY";
    } catch {
      // ignore
    }
    return resolveWorshipTypeLabel(worshipType);
  },
};

export default function SermonsList() {
  return (
    <ArticleList
      menuKey="DEFAULT"
      templateCode="DEFAULT"
      basePath="/worship/sermons"
      middleColumns={[worshipTypeColumn]}
    />
  );
}
