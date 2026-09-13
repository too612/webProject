import { Link } from "react-router-dom";
import { ArticleList } from "../../../common/article";
import type { GridColumnDef } from "../../../common/grid";
import { Button, PageTitle } from "../../../common/ui";
import { useMenu } from "../../../common/menu/menuHook";
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
  const { currentMenu: menu, loading: menuLoading } = useMenu();

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <PageTitle
            title={
              menuLoading
                ? "페이지 정보를 불러오는 중"
                : (menu?.menuName ?? "성도소식")
            }
            description={
              menuLoading
                ? "페이지 설명을 불러오는 중"
                : (menu?.menuSummary ??
                  "성도들의 기쁜 소식과 위로의 소식을 함께 나눕니다.")
            }
          />
          <Button asChild>
            <Link to={`${MEMBER_NEWS_BASE_PATH}/write`}>글쓰기</Link>
          </Button>
        </div>
        <div className="[&>section]:space-y-0 [&>section>div]:border-0 [&>section>div]:bg-transparent [&>section>div]:shadow-none [&>section>div]:p-0 [&>section>div]:space-y-4 [&>section>div>div:first-child]:hidden">
          <ArticleList
            menuKey={MEMBER_NEWS_MENU_KEY}
            templateCode={MEMBER_NEWS_TEMPLATE_CODE}
            basePath={MEMBER_NEWS_BASE_PATH}
            middleColumns={[eventTypeColumn]}
            hideDefaultWriteButton
          />
        </div>
      </div>
    </section>
  );
}
