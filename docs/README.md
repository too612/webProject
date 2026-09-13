# EventCalendar (교회 행사달력)

교회 행사 일정을 **구분값(주일학교/청년부/장년부/교회)** 기준으로 등록·수정·삭제(CRUD)하고,
구분값별 색상으로 구분해 월/주/일/목록 뷰로 보여주는 달력 컴포넌트입니다.

- 구분값은 `com_code`(공통코드)로 관리하며, 현재 4개 값은 구현 목적의 **임의값**입니다.
  값 추가/변경 시 `com_code`에 행만 추가하면 화면(필터·다이얼로그)에 자동 반영됩니다.
- 각 구분값의 표시 색상은 `com_code.extra1`에 저장합니다. (`sky/green/orange/indigo` 등)
- DB 설계는 `docs/cal_schema.sql`, 이관용 프롬프트는 `docs/DEEPSEEK_HANDOFF_PROMPT.md`를 참고하세요.

## 폴더 구조

```
frontend/src/common/ui/calendar/          # 공통 달력 컴포넌트 (폴더명=calendar 로 파일명 통일)
├── calendar.tsx                          # 메인 엔트리 (EventCalendar) - 구분값 필터/뷰 조합
├── calendarHeader.tsx                    # 상단 오늘/이전/다음/뷰 전환/새 일정 버튼
├── calendarMonthView.tsx                 # 월간 그리드
├── calendarTimeGridView.tsx              # 주간/일간 타임그리드 (Week/Day 공용)
├── calendarListView.tsx                  # 목록 뷰
├── calendarEventDialog.tsx               # 생성/수정 다이얼로그 (구분값 선택, 색상 자동 지정)
├── calendarEventDetailPopover.tsx        # 일정 클릭 시 상세 요약 카드 (수정/삭제)
├── calendarTypes.ts                      # 도메인 타입 + 색상 팔레트
├── calendarUtils.ts                      # 날짜 계산 + occurrence 전개 로직
└── index.ts                              # public export

frontend/src/official/news/eventcalendar/ # 행사달력 페이지 (feature 4파일 세트)
├── eventcalendarPage.tsx                 # 화면 (EventCalendar 활용)
├── eventcalendarHook.ts                  # 상태/유스케이스 훅
├── eventcalendarApi.ts                   # HTTP 통신 모듈
└── eventcalendarModel.ts                 # 타입 + 달력 타입 매핑

src/main/java/com/main/app/official/news/eventcalendar/   # 백엔드
├── EventCalendarController.java
├── EventCalendarService.java
├── EventCalendarMapper.java
└── dto/
    ├── EventCalendarDto.java
    ├── EventCalendarRequest.java
    └── EventCategoryDto.java

src/main/resources/mapper/official/news/eventcalendar/
└── EventCalendarMapper.xml
```

## 핵심 모델: "구분값(category)"

이 달력은 부서/사람 단위 권한 구조가 아니라, **일정마다 하나의 구분값(category)** 을 갖습니다.

| 항목 | 값 |
|---|---|
| 구분값 | 주일학교 / 청년부 / 장년부 / 교회 (com_code, 추후 변동 가능) |
| 색상 | 구분값별 1:1 (com_code.extra1), 일정 저장 시 `color_cd`로 스냅샷 저장 |
| 가시성 | 교회 공용 일정이므로 모든 사용자에게 전체 공개 |

## 데이터 흐름 (중요)

이 컴포넌트는 **자체 상태로 CRUD하지 않습니다.** `events`/`categories`는 항상 부모(컨테이너)가
API로 조회해서 prop으로 내려주고, `onCreateEvent`/`onUpdateEvent`/`onDeleteEvent` 콜백 안에서
실제 API 호출 후 목록을 재조회하는 단방향 데이터 흐름을 유지합니다.

## API 엔드포인트 (공통 규격 ApiResponse<T>)

| 메서드 | URI | 설명 |
|---|---|---|
| GET | `/api/official/news/eventcalendar/getList` | 일정 목록 조회 |
| GET | `/api/official/news/eventcalendar/getCategoryList` | 구분값 목록 조회 |
| POST | `/api/official/news/eventcalendar/setCreate` | 일정 등록 |
| PUT | `/api/official/news/eventcalendar/setUpdate/{eventKey}` | 일정 수정 |
| DELETE | `/api/official/news/eventcalendar/delRemove/{eventKey}` | 일정 소프트 삭제 |

## 사용 예시

```tsx
import { EventCalendar } from "@/common/ui/calendar";
import type { CalendarCategory, CalendarEvent, EventFormValues } from "@/common/ui/calendar";

export function ChurchCalendarPage() {
  // 아래 2개는 실제로는 각각 API(getList/getCategoryList)에서 조회해서 채웁니다.
  const categories: CalendarCategory[] = [
    { code: "401-010", name: "주일학교", color: "sky" },
    { code: "401-020", name: "청년부", color: "green" },
  ];

  const events: CalendarEvent[] = [
    {
      id: "…80자리 hex…",
      categoryCode: "401-010",
      categoryName: "주일학교",
      title: "주일학교 여름성경학교",
      start: "2026-08-17T09:00:00",
      end: "2026-08-17T12:00:00",
      allDay: false,
      location: "본당 2층",
      color: "sky",
    },
  ];

  async function handleCreate(values: EventFormValues) {
    // await api.post("/api/official/news/eventcalendar/setCreate", values);
  }

  return (
    <div className="h-[640px]">
      <EventCalendar
        categories={categories}
        events={events}
        onCreateEvent={handleCreate}
        onUpdateEvent={handleCreate}
        onDeleteEvent={async (id) => {/* await api.delete(...) */}}
      />
    </div>
  );
}
```

## 알려진 제한사항 / TODO

- 드래그로 일정 시간 이동·리사이즈 미구현 (클릭 → 다이얼로그 수정만 가능)
- 반복 일정 미구현 (단일 일정만 지원)
- 구분값(com_code) 관리 UI는 `system/config/code` 쪽과 별도로, 현재는 시드/DB로 관리
