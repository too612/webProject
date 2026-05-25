# Frontend Refactoring Checklist (Menu-Driven)

이 문서는 대화가 끊겨도 그대로 이어서 사용할 수 있는 체크리스트입니다.
기준 메뉴: `M_MAIN_01_01 /about/pastor` (목회자소개)

---

## 0) Refactoring Goal

- [ ] 백엔드 메뉴/도메인 구조와 프론트 폴더 구조를 최대한 일치시킨다.
- [ ] 기능 단위(도메인 단위) 응집도를 높여 유지보수 비용을 줄인다.
- [ ] 공통은 공통으로, 업무 전용은 업무 폴더로 분리한다.

---

## 1) Target Folder Blueprint

- [ ] `frontend/src/common`을 공통 영역으로 정의한다.
- [ ] 업무(메뉴) 대분류를 `frontend/src` 바로 아래에 둔다.
- [x] `official/about/pastor`를 첫 프로토타입 도메인으로 확정한다.
- [x] pastor는 하위 역할 폴더를 만들지 않고 파일명으로 역할을 표현한다.
- [x] 아래 평면 구조를 pastor에 우선 적용한다.
- [x] `router`, `store`, `components`는 앱 레이어로 두고 `src` 루트에 유지한다.

```text
frontend/src
  common/
    ui/
    lib/
    api/
    styles/
    assets/
  official/
    about/
      pastor/
        PastorPage.tsx
        usePastorProfile.ts
        pastorApi.ts
        PastorModel.ts
        PastorValidator.ts (optional)
        index.ts
  community/
  erp/
  system/
  mypage/
  router/
  store/
  components/
```

---

## 2) Naming Rules (Name + Role)

- [x] 컴포넌트는 `PascalCase`를 사용한다. 예: `PastorPage`, `PastorForm`
- [x] 훅은 `use` 접두어를 사용한다. 예: `usePastorProfile`
- [x] API 파일은 도메인 + `Api`를 사용한다. 예: `pastorApi.ts` 또는 `PastorApi.ts`
- [x] 타입/모델은 도메인 + 역할명을 사용한다. 예: `PastorModel.ts`, `PastorRequest.ts`
- [x] 이벤트 핸들러는 `handle` 접두어를 사용한다. 예: `handleSubmit`
- [x] 서버 액션 함수는 동사형으로 통일한다. 예: `load`, `save`, `remove`

---

## 3) Pastor Prototype Scope

현재 기준 파일:

- `frontend/src/pages/official/about/PastorPage.tsx`
- `frontend/src/hooks/usePastorProfile.ts`
- `frontend/src/api/aboutApi.ts`

체크리스트:

- [x] `PastorPage.tsx`를 pastor 도메인 폴더로 이동한다.
- [x] `usePastorProfile.ts`를 pastor 도메인 폴더로 이동한다.
- [x] `aboutApi.ts` 내 pastor 전용 로직을 `pastorApi.ts`로 분리한다.
- [x] pastor 전용 타입(`Pastor`, `PastorRequest`)을 `PastorModel.ts`로 이동한다.
- [x] pastor 폴더 내 파일명은 역할이 드러나도록 유지한다. (Page/Hook/Api/Model)
- [x] 라우터 import 경로를 새 위치 기준으로 수정한다.
- [ ] 빌드/실행 후 pastor CRUD 동작을 확인한다.

---

## 4) Common vs Feature Boundary

공통(common)으로 이동 가능한 후보:

- [x] HTTP client wrapper (예: axios 인스턴스)
- [x] 공통 에러 처리/포맷 유틸
- [ ] 공통 UI 컴포넌트 (Button, Modal, Pagination 등)
- [ ] 전역 스타일 토큰/리셋

기능(대분류/도메인)에 남겨야 하는 항목:

- [x] pastor 화면 전용 컴포넌트
- [x] pastor 화면 전용 훅/검증 로직
- [x] pastor 엔드포인트 호출 API
- [x] pastor 전용 타입/상수

---

## 5) Static Resource Strategy (js/css/img)

- [ ] 전역 스타일은 `common/styles`로 모은다.
- [ ] 기능 전용 스타일은 해당 도메인 폴더 근처에 둔다.
- [ ] 전역 이미지(로고/아이콘/브랜드)는 `common/assets`로 모은다.
- [ ] 기능 전용 이미지는 기능 폴더 근처에 둔다.
- [ ] 대용량 이미지는 포맷(webp)과 lazy loading 기준을 정한다.
- [ ] 사용하지 않는 정적 파일 제거 기준을 정한다.

---

## 6) Router/Menu Alignment

- [x] `erp_menu_seed.sql`의 메뉴 경로와 React 라우트 경로를 매핑한다. (`official` 1차)
- [ ] 메뉴 대분류(`official`, `community`, `erp`, `system`, `mypage`)를 `src` 바로 아래 폴더와 정렬한다.
- [x] 라우터 파일은 라우트 선언만 담당하고 상세 구현은 대분류 하위 도메인에서 import한다.
- [x] 메뉴 변경 시 수정 위치를 문서화한다. (DB -> Router -> Domain)

`official` route/menu mapping:

| Menu Code    | Menu Name   | SQL Path             | React Route          |
| ------------ | ----------- | -------------------- | -------------------- |
| M_MAIN_01_01 | 목회자소개  | /about/pastor        | /about/pastor        |
| M_MAIN_01_02 | 비전        | /about/vision        | /about/vision        |
| M_MAIN_01_03 | 연혁        | /about/history       | /about/history       |
| M_MAIN_01_04 | 신앙고백    | /about/beliefs       | /about/beliefs       |
| M_MAIN_02_01 | 예배시간    | /worship/time        | /worship/time        |
| M_MAIN_02_02 | 온라인예배  | /worship/live        | /worship/live        |
| M_MAIN_02_03 | 설교정보    | /worship/sermons     | /worship/sermons     |
| M_MAIN_03_01 | 주일학교    | /ministries/children | /ministries/children |
| M_MAIN_03_02 | 청년부      | /ministries/youth    | /ministries/youth    |
| M_MAIN_03_03 | 선교부      | /ministries/mission  | /ministries/mission  |
| M_MAIN_04_01 | 공지사항    | /news/announcement   | /news/announcement   |
| M_MAIN_04_02 | 행사        | /news/event          | /news/event          |
| M_MAIN_04_03 | 주보        | /news/bulletin       | /news/bulletin       |
| M_MAIN_04_04 | 새가족 등록 | /news/registration   | /news/registration   |
| M_MAIN_05_01 | 오시는길    | /support/location    | /support/location    |
| M_MAIN_05_02 | Q&A         | /support/qna         | /support/qna         |
| M_MAIN_05_03 | FAQ         | /support/faq         | /support/faq         |

---

## 7) Migration Procedure (Safe Order)

- [x] 1단계: pastor 관련 파일을 pastor 폴더로 모으고 평면 구조로 정렬한다.
- [x] 2단계: 라우터/메뉴 연결 경로를 수정한다.
- [x] 3단계: 파일명 역할 규칙(Page/Hook/Api/Model)을 적용한다.
- [x] 4단계: 공통으로 올릴 항목만 `common`으로 추출한다.
- [x] 5단계: 다음 도메인(vision/history/beliefs)으로 확장한다.
- [x] 6단계: 안정화 완료 후 기존 브리지 파일을 제거한다.

---

## 8) Official Stabilization (Phase-1: about)

- [x] about 라우트가 새 도메인 경로(`src/official/about/*`)를 직접 참조한다.
- [x] 빌드 재검증이 통과한다. (`tsc -b && vite build`)
- [x] about 화면 수동 점검(vision/history/beliefs/pastor 진입)이 완료된다. (렌더 확인)
- [x] 안정화 완료 선언 후 브리지 파일 제거를 실행한다.

---

## 9) Legacy Cleanup (완료 시 기존 파일 제거)

사전 조건:

- [x] `Official Stabilization (Phase-1: about)`의 수동 점검이 완료되었다.
- [ ] 새 경로를 기준으로 최소 1회 배포/시연 검증이 끝났다.
- [x] 브리지 파일은 이미 제거되었다.

제거 대상(브리지 파일):

- [x] `frontend/src/hooks/usePastorProfile.ts`
- [x] `frontend/src/api/aboutApi.ts`
- [x] `frontend/src/pages/official/about/PastorPage.tsx`
- [x] `frontend/src/pages/official/about/VisionPage.tsx`
- [x] `frontend/src/pages/official/about/HistoryPage.tsx`
- [x] `frontend/src/pages/official/about/BeliefsPage.tsx`

제거 후 검증:

- [x] `grep` 기준으로 `hooks/usePastorProfile` import가 0건이다.
- [x] `grep` 기준으로 `api/aboutApi` import가 0건이다.
- [x] `grep` 기준으로 `pages/official/about/*` import가 0건이다.
- [x] frontend build가 통과한다. (`tsc -b && vite build`)

삭제 규칙:

- [x] 새 도메인 경로가 렌더링을 대체하면 기존 브리지 파일을 삭제한다.
- [x] `src/pages/official/about/*`처럼 오래된 진입점은 새 도메인 경로로 import가 0건일 때 제거한다.
- [ ] `frontend/dist`는 배포 산출물이므로 레거시 브리지 삭제 기준과 분리해서 관리한다.

---

## 10) Done Criteria (Definition of Done)

- [x] pastor 관련 변경이 pastor 도메인 폴더에서 대부분 해결된다.
- [ ] common과 대분류/도메인 경계가 문서/코드에서 일관된다.
- [ ] 라우트 경로와 메뉴 경로가 혼동 없이 대응된다.
- [ ] 신규 개발자가 10분 내 pastor 흐름을 추적할 수 있다.
- [ ] 린트/빌드/기능 테스트(조회/저장/수정/삭제)가 통과한다.

---

## 11) Progress Log

- [x] 2026-05-23: 초안 생성
- [x] 2026-05-23: pastor 1차 이관 완료
- [x] 2026-05-23: frontend build 통과 (tsc -b && vite build)
- [x] 2026-05-23: HTTP client를 common/api/client로 추출 및 pastorApi 직접 참조 적용
- [x] 2026-05-23: 공통 에러 처리 유틸(common/lib/apiError) 추출 및 authApi/pastorApi 공통 적용
- [x] 2026-05-23: 공통 추출 1차 완료
- [x] 2026-05-23: about 확장 후 frontend build 재검증 통과 (tsc -b && vite build)
- [x] 2026-05-23: about 하위(vision/history/beliefs) 도메인 확장 및 라우터 연결 전환 완료
- [x] 2026-05-23: official 안정화 1차 체크리스트 및 legacy 제거 조건/대상 문서화
- [x] 2026-05-23: about 브리지 파일 4건 제거 및 import/build 재검증 완료
- [x] 2026-05-23: official route/menu mapping 1차 정리 및 문서 반영
- [x] 2026-05-23: hooks/usePastorProfile.ts 및 api/aboutApi.ts legacy 브리지 제거
- [x] 2026-05-23: hooks/aboutApi legacy 제거 후 import/build 재검증 완료
- [x] 2026-05-23: router/store/components는 앱 레이어로 src 루트 유지 기준 문서화
- [x] 2026-05-23: about 화면 수동 렌더 점검 완료, menuApi 백엔드 500은 별도 이슈로 확인
- [ ] YYYY-MM-DD: official 도메인 안정화 완료
