# CALENDAR_GUIDE (교회 행사달력 개발 가이드)

교회 행사 일정을 구분값(주일학교/청년부/장년부/교회) 기준으로 CRUD하고,
구분값별 색상으로 구분해 월/주/일/목록 뷰로 제공하는 기능의 최종 개발 산출물 문서입니다.

## 1. 개요

- 대상 메뉴: `행사달력` (`/news/eventcalendar`, `docs/sys_menu_seed.sql` M_MAIN_05_06)
- 공통 달력 컴포넌트: `frontend/src/common/ui/calendar/` (기존 Claude 산출물을 현재 시스템 규칙에 맞게 개편)
- 구분값: `주일학교 / 청년부 / 장년부 / 교회` (임의값, `com_code`로 관리 → 추후 변동 가능)
- 색상: 구분값별 1:1 매핑 (주일학교=sky, 청년부=green, 장년부=orange, 교회=indigo)

## 2. 폴더 구조

### 2-1. 공통 달력 컴포넌트 (폴더명=calendar 파일명 통일, index.ts 제외)

```
frontend/src/common/ui/calendar/
├── calendar.tsx                  # EventCalendar 루트 (구분값 필터 + 뷰 조합)
├── calendarHeader.tsx            # 오늘/이전/다음/월·주·일·목록 전환/새 일정
├── calendarMonthView.tsx         # 월간 그리드
├── calendarTimeGridView.tsx      # 주간/일간 타임그리드
├── calendarListView.tsx          # 목록 뷰
├── calendarEventDialog.tsx       # 생성/수정 다이얼로그 (구분값 선택 → 색상 자동 지정)
├── calendarEventDetailPopover.tsx# 일정 클릭 요약 카드 (수정/삭제)
├── calendarTypes.ts              # 도메인 타입 + EVENT_COLORS 팔레트
├── calendarUtils.ts              # 날짜 계산 + occurrence 전개
└── index.ts                      # public export
```

> 기존 `Calendar.tsx / CalendarHeader.tsx / CalendarSidebar.tsx / MonthView.tsx /
> TimeGridView.tsx / ListView.tsx / EventDialog.tsx / EventDetailPopover.tsx /
> types.ts / permissions.ts / utils.ts` 는 위 이름으로 개명(또는 불필요 파일 제거).
> 삭제 파일: `CalendarSidebar.tsx`, `permissions.ts` (회사 부서/사람/권한 scope 모델은 교회 모델에 불필요)

### 2-2. 행사달력 feature (4파일 세트)

```
frontend/src/official/news/eventcalendar/
├── eventcalendarPage.tsx
├── eventcalendarHook.ts
├── eventcalendarApi.ts
└── eventcalendarModel.ts
```

### 2-3. 백엔드

```
src/main/java/com/main/app/official/news/eventcalendar/
├── EventCalendarController.java
├── EventCalendarService.java
├── EventCalendarMapper.java
└── dto/
    ├── EventCalendarDto.java
    ├── EventCalendarRequest.java
    └── EventCategoryDto.java

src/main/resources/mapper/official/news/eventcalendar/EventCalendarMapper.xml
```

## 3. DB 스키마

`docs/cal_schema.sql` (구분값 시드 포함). 요약:

- `cal_event`: `event_key` CHAR(80) PK(난수 HEX 자동채번), `category_cd`, `title`,
  `description`, `start_dtm`, `end_dtm`, `all_day_yn`, `location_nm`, `color_cd`, `use_yn`
- 감사컬럼: `reg_user/reg_dtm/reg_ip/upd_user/upd_dtm/upd_ip` (`docs/hrm_person.sql` 규격과 동일)
- 구분값: `com_code` (부모 `401` = 행사구분, 색상은 `extra1`)
  - 401-010 주일학교(sky), 401-020 청년부(green), 401-030 장년부(orange), 401-040 교회(indigo)

## 4. API 명세 (공통 응답 ApiResponse<T>)

| 메서드 | URI | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/official/news/eventcalendar/getList` | - | `List<EventCalendarDto>` |
| GET | `/api/official/news/eventcalendar/getCategoryList` | - | `List<EventCategoryDto>` |
| POST | `/api/official/news/eventcalendar/setCreate` | `EventCalendarRequest` | `Void` |
| PUT | `/api/official/news/eventcalendar/setUpdate/{eventKey}` | `EventCalendarRequest` | `Void` |
| DELETE | `/api/official/news/eventcalendar/delRemove/{eventKey}` | - | `Void` |

### EventCalendarDto

```json
{
  "eventKey": "…80자리 hex…",
  "categoryCd": "401-010",
  "categoryName": "주일학교",
  "title": "주일학교 여름성경학교",
  "description": "…",
  "startDtm": "2026-08-17T09:00:00+09:00",
  "endDtm": "2026-08-17T12:00:00+09:00",
  "allDayYn": "N",
  "locationNm": "본당 2층",
  "colorCd": "sky"
}
```

### EventCategoryDto

```json
{ "code": "401-010", "codeName": "주일학교", "color": "sky" }
```

### EventCalendarRequest

```json
{
  "eventKey": "…수정 시에만…",
  "categoryCd": "401-010",
  "title": "…",
  "description": "…",
  "startDtm": "2026-08-17T09:00:00+09:00",
  "endDtm": "2026-08-17T12:00:00+09:00",
  "allDayYn": "N",
  "locationNm": "…",
  "colorCd": "sky"
}
```

## 5. 비즈니스 규칙 (검증/보정)

- 제목·구분값·시작/종료 일시는 필수 (서버에서 검증, 누락 시 IllegalArgumentException)
- `end_dtm >= start_dtm` 강제 (DB CHECK + 서비스 검증)
- `all_day_yn` 미지정 시 `'N'`, `color_cd` 미지정 시 `'indigo'`로 보정
- 소프트 삭제: `use_yn = 'N'` 갱신 (물리 삭제 없음), 모든 SELECT는 `use_yn = 'Y'` 조건
- 등록자/수정자 IP는 Front 값을 신뢰하지 않고 서버에서 `ClientIpUtil.resolveClientIp()`로 결정
- 색상은 구분값 선택 시 자동 파생되며, 일정 저장 시 `color_cd`에 스냅샷으로 저장

## 6. 자체 검증 결과

- Frontend: `npx tsc -b` → `TSC_EXIT=0` (타입 오류 없음)
- Backend: `gradlew compileJava` → `BUILD SUCCESSFUL` (1 actionable task: 1 executed)

## 7. 알려진 제한사항 / TODO

- 일정 드래그 이동/리사이즈 미구현 (클릭 → 다이얼로그로만 수정)
- 반복 일정 미구현 (단일 일정만 지원)
- 구분값(com_code) 관리 화면은 미제공 (현재 시드/DB로 관리)
