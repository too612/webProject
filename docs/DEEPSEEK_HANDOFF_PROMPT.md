# DeepSeek 이관 프롬프트

아래 내용을 DeepSeek 세션 시작 시 시스템/컨텍스트 메시지로 그대로 붙여넣어 사용하세요.
(코드/DDL 파일도 함께 첨부하거나 프로젝트에 실제로 반영한 뒤 진행하는 것을 권장합니다.)

---

## 프로젝트 컨텍스트

너는 다사랑교회 웹 시스템(React + Spring Boot + PostgreSQL)에서 "행사달력" 기능을 이어서 개발/유지보수한다.
프론트는 shadcn/ui 기반 공통 컴포넌트를 `frontend/src/common/ui/*`에서 가져다 쓰고,
달력 관련 코드는 `frontend/src/common/ui/calendar/` 폴더에 모여 있다. DB는 PostgreSQL이다.

### 반드시 지켜야 할 규칙

1. **테이블 네이밍**: `{구분}_{내용}` 형식. 행사달력 도메인의 구분 접두어는 `cal_` 이다.
   예: `cal_event`. 새 테이블을 추가할 때도 이 규칙을 따른다.

2. **감사컬럼**: 모든 `cal_*` 테이블은 `docs/hrm_person.sql`의 감사필드 규격과 동일하게 아래 컬럼을 포함한다.
   ```
   reg_user  VARCHAR(50)   NOT NULL DEFAULT 'SYSTEM'  -- 등록자
   reg_dtm   TIMESTAMPTZ   NOT NULL DEFAULT NOW()     -- 등록일시
   reg_ip    INET                                    -- 등록IP
   upd_user  VARCHAR(50)                              -- 수정자 (nullable)
   upd_dtm   TIMESTAMPTZ                              -- 수정일시 (nullable)
   upd_ip    INET                                     -- 수정IP
   ```

3. **PK는 CHAR(80) 서로게이트 키**를 사용한다. `DEFAULT encode(gen_random_bytes(40), 'hex')`로
   DB에서 자동 채번하며, CHECK 제약(`~ '^[0-9a-f]{80}$'`)을 건다. BIGINT/BIGSERIAL를 쓰지 않는다.

4. **소프트 삭제는 `use_yn`(CHAR(1), 'Y'/'N')** 로 처리한다. 모든 조회(SELECT)에는
   `use_yn = 'Y'` 조건이 누락되지 않도록 한다.

5. **구분값(category)은 com_code(공통코드)로 관리**한다. 캘린더 전용 별도 카테고리 테이블을 만들지 않는다.
   - 부모코드 `401` = 행사구분, 하위 코드가 구분값이다.
   - 각 구분값의 표시 색상은 `com_code.extra1`에 저장한다.
   - 구분값은 임의값이며 추후 변동 가능하다. 화면/서버는 특정 코드값을 하드코딩하지 말고 com_code 조회 결과를 그대로 사용한다.

6. **파일 네이밍(프론트 공통 컴포넌트)**: `common/editor`처럼 폴더명을 기준으로 파일명을 통일한다.
   - `frontend/src/common/ui/calendar/`의 모든 파일명은 `calendar`로 시작한다 (index.ts 제외).
   - 예: `calendar.tsx`, `calendarHeader.tsx`, `calendarTypes.ts`, `calendarUtils.ts`.

7. **feature 파일 세트**: 도메인 기능은 `docs/FRONT-FULLSTACK-SPEC.md`를 따른다.
   - 프론트: `{feature}Page.tsx`, `{feature}Hook.ts`, `{feature}Api.ts`, `{feature}Model.ts`
   - 백엔드: `{Feature}Controller.java`, `{Feature}Service.java`, `{Feature}Mapper.java`,
     `dto/{Feature}Dto.java`, `dto/{Feature}Request.java`, `mapper/.../{Feature}Mapper.xml`
   - `controller/`, `service/`, `mapper/` 같은 역할 기반 하위 폴더는 만들지 않는다.

8. **API 네이밍**: 조회 `getList`/`getInfo`, 등록 `setCreate`, 수정 `setUpdate/{id}`, 삭제(소프트) `delRemove/{id}`.
   모든 응답은 `ApiResponse<T>` 규격을 따른다.

### 파일 구조 (프론트, `frontend/src/common/ui/calendar/`)

| 파일 | 역할 |
|---|---|
| `calendarTypes.ts` | 도메인 타입 + 색상 팔레트(EVENT_COLORS) + 구분값(Category) 타입 |
| `calendarUtils.ts` | 날짜 계산 + occurrence 전개 로직 |
| `calendar.tsx` | 루트 컴포넌트(`EventCalendar`). categories/events를 prop으로 받는 controlled 컴포넌트 |
| `calendarHeader.tsx` | 상단 네비게이션 (오늘/이전/다음/월·주·일·목록 전환/새 일정) |
| `calendarMonthView.tsx` / `calendarTimeGridView.tsx` / `calendarListView.tsx` | 뷰별 렌더링 |
| `calendarEventDialog.tsx` | 생성/수정 다이얼로그. 구분값 선택 시 색상 자동 지정 |
| `calendarEventDetailPopover.tsx` | 일정 클릭 시 요약 카드 + 수정/삭제 버튼 |

### 데이터 흐름 (중요)

이 컴포넌트는 **자체 상태로 CRUD하지 않는다.** `events`/`categories`는 항상 부모(컨테이너) 컴포넌트가
API로 조회해서 prop으로 내려주고, `onCreateEvent`/`onUpdateEvent`/`onDeleteEvent` 콜백 안에서
실제 API 호출 후 목록을 재조회하는 패턴이다. 컴포넌트 내부에 직접 axios 호출을 넣지 않는다.

### 알려진 미구현 / TODO (다음 작업자가 이어받을 때 참고)

- [ ] 일정 드래그 이동/리사이즈 (현재는 클릭 → 다이얼로그로만 수정 가능)
- [ ] 반복 일정 (현재는 단일 일정만 지원)
- [ ] 구분값(com_code) 관리 화면 (현재는 시드/DB로 관리)

### 지금 요청할 작업

<!-- 여기에 실제로 DeepSeek에게 시킬 작업(예: "반복 일정 기능 추가해줘",
"구분값 관리 화면 만들어줘" 등)을 적어서 이어붙이세요. -->
