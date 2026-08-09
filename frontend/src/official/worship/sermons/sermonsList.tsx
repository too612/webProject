/**
 * File Name   : sermonsList
 * Description : 설교 목록 (ArticleList Wrapper)
 * -----------------------------------------------------------------------------
 * - 공통 ArticleList에 예배구분 컬럼만 추가
 */

import { ArticleList } from "../../../common/article";
import type { GridColumnDef } from "../../../common/grid";
import { Link } from "react-router-dom";
import { Button, PageTitle } from "../../../common/ui";

const WORSHIP_TYPE_LABEL_MAP: Record<string, string> = {
  SUNDAY: "주일예배",
  WEDNESDAY: "수요예배",
  DAWN: "새벽예배",
  SPECIAL: "특별예배",
};

function resolveWorshipTypeLabel(value: unknown): string {
  if (!value) return "-";
  if (typeof value !== "string" && typeof value !== "number") return "-";
  const label = WORSHIP_TYPE_LABEL_MAP[String(value)];
  return label ?? String(value);
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
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <PageTitle
            title="설교 말씀"
            description="주일과 특별예배의 설교 말씀을 모아보는 공간입니다."
          />
          <Button asChild>
            <Link to="/worship/sermons/write">글쓰기</Link>
          </Button>
        </div>
        <div className="[&>section]:space-y-0 [&>section>div]:border-0 [&>section>div]:bg-transparent [&>section>div]:shadow-none [&>section>div]:p-0 [&>section>div]:space-y-4 [&>section>div>div:first-child]:hidden">
          <ArticleList
            menuKey="DEFAULT"
            templateCode="DEFAULT"
            basePath="/worship/sermons"
            middleColumns={[worshipTypeColumn]}
            hideDefaultWriteButton
          />
        </div>
      </div>
    </section>
  );
}
