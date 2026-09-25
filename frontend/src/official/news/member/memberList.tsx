import { Link } from "react-router-dom";
import { ArticleList } from "../../../common/article";
import type { GridColumnDef } from "../../../common/grid";
import { Button, ListPageShell } from "../../../common/ui";
import {
  MEMBER_EVENT_TYPE_OPTIONS,
  MEMBER_NEWS_BASE_PATH,
  MEMBER_NEWS_MENU_KEY,
  MEMBER_NEWS_TEMPLATE_CODE,
} from "./memberModel";

const EVENT_TYPE_LABEL_MAP = Object.fromEntries(
  MEMBER_EVENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

const eventTypeColumn: GridColumnDef = {
  field: "eventType",
  headerName: "선교구분",
  width: 100,
  headerClass: "text-center",
  cellClass: "text-center",
  sortable: false,
  filter: false,
  valueGetter: (params: any) => {
    try {
      const metadata =
        typeof params.data.metadata === "string"
          ? JSON.parse(params.data.metadata)
          : params.data.metadata;
      const eventType = metadata?.eventType;
      return EVENT_TYPE_LABEL_MAP[eventType] ?? eventType ?? "-";
    } catch {
      return "-";
    }
  },
};

export default function MemberList() {
  return (
    <ListPageShell
      actions={
        <Button asChild>
          <Link to={`${MEMBER_NEWS_BASE_PATH}/write`}>글쓰기</Link>
        </Button>
      }
    >
      <ArticleList
        menuKey={MEMBER_NEWS_MENU_KEY}
        templateCode={MEMBER_NEWS_TEMPLATE_CODE}
        basePath={MEMBER_NEWS_BASE_PATH}
        middleColumns={[eventTypeColumn]}
        hideDefaultWriteButton
      />
    </ListPageShell>
  );
}
