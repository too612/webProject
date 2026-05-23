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

- [ ] `frontend/src/shared`를 공통 영역으로 정의한다.
- [ ] `frontend/src/domains`를 업무(메뉴) 영역으로 정의한다.
- [ ] `official/about/pastor`를 첫 프로토타입 도메인으로 확정한다.
- [ ] pastor는 하위 역할 폴더를 만들지 않고 파일명으로 역할을 표현한다.
- [ ] 아래 평면 구조를 pastor에 우선 적용한다.

```text
frontend/src
  shared/
    ui/
    lib/
    api/
    styles/
    assets/
  domains/
    official/
      about/
        pastor/
          PastorPage.tsx
          usePastorProfile.ts
          pastorApi.ts
          PastorModel.ts
          PastorValidator.ts (optional)
          index.ts
```

---

## 2) Naming Rules (Name + Role)

- [ ] 컴포넌트는 `PascalCase`를 사용한다. 예: `PastorPage`, `PastorForm`
- [ ] 훅은 `use` 접두어를 사용한다. 예: `usePastorProfile`
- [ ] API 파일은 도메인 + `Api`를 사용한다. 예: `pastorApi.ts` 또는 `PastorApi.ts`
- [ ] 타입/모델은 도메인 + 역할명을 사용한다. 예: `PastorModel.ts`, `PastorRequest.ts`
- [ ] 이벤트 핸들러는 `handle` 접두어를 사용한다. 예: `handleSubmit`
- [ ] 서버 액션 함수는 동사형으로 통일한다. 예: `load`, `save`, `remove`

---

## 3) Pastor Prototype Scope

현재 기준 파일:

- `frontend/src/pages/official/about/PastorPage.tsx`
- `frontend/src/hooks/usePastorProfile.ts`
- `frontend/src/api/aboutApi.ts`

체크리스트:

- [ ] `PastorPage.tsx`를 pastor 도메인 폴더로 이동한다.
- [ ] `usePastorProfile.ts`를 pastor 도메인 폴더로 이동한다.
- [ ] `aboutApi.ts` 내 pastor 전용 로직을 `pastorApi.ts`로 분리한다.
- [ ] pastor 전용 타입(`Pastor`, `PastorRequest`)을 `PastorModel.ts`로 이동한다.
- [ ] pastor 폴더 내 파일명은 역할이 드러나도록 유지한다. (Page/Hook/Api/Model)
- [ ] 라우터 import 경로를 새 위치 기준으로 수정한다.
- [ ] 빌드/실행 후 pastor CRUD 동작을 확인한다.

---

## 4) Common vs Feature Boundary

공통(shared)로 이동 가능한 후보:

- [ ] HTTP client wrapper (예: axios 인스턴스)
- [ ] 공통 에러 처리/포맷 유틸
- [ ] 공통 UI 컴포넌트 (Button, Modal, Pagination 등)
- [ ] 전역 스타일 토큰/리셋

기능(domains)에 남겨야 하는 항목:

- [ ] pastor 화면 전용 컴포넌트
- [ ] pastor 화면 전용 훅/검증 로직
- [ ] pastor 엔드포인트 호출 API
- [ ] pastor 전용 타입/상수

---

## 5) Static Resource Strategy (js/css/img)

- [ ] 전역 스타일은 `shared/styles`로 모은다.
- [ ] 기능 전용 스타일은 해당 도메인 폴더 근처에 둔다.
- [ ] 전역 이미지(로고/아이콘/브랜드)는 `shared/assets`로 모은다.
- [ ] 기능 전용 이미지는 기능 폴더 근처에 둔다.
- [ ] 대용량 이미지는 포맷(webp)과 lazy loading 기준을 정한다.
- [ ] 사용하지 않는 정적 파일 제거 기준을 정한다.

---

## 6) Router/Menu Alignment

- [ ] `erp_menu_seed.sql`의 메뉴 경로와 React 라우트 경로를 매핑한다.
- [ ] 메뉴 대분류(`official`, `community`, `erp`, `system`, `mypage`)와 도메인 폴더를 정렬한다.
- [ ] 라우터 파일은 라우트 선언만 담당하고 상세 구현은 도메인에서 import한다.
- [ ] 메뉴 변경 시 수정 위치를 문서화한다. (DB -> Router -> Domain)

---

## 7) Migration Procedure (Safe Order)

- [ ] 1단계: pastor 관련 파일을 pastor 폴더로 모으고 평면 구조로 정렬한다.
- [ ] 2단계: 라우터/메뉴 연결 경로를 수정한다.
- [ ] 3단계: 파일명 역할 규칙(Page/Hook/Api/Model)을 적용한다.
- [ ] 4단계: 공통으로 올릴 항목만 `shared`로 추출한다.
- [ ] 5단계: 다음 도메인(vision/history/beliefs)으로 확장한다.

---

## 8) Done Criteria (Definition of Done)

- [ ] pastor 관련 변경이 pastor 도메인 폴더에서 대부분 해결된다.
- [ ] 공통과 도메인 경계가 문서/코드에서 일관된다.
- [ ] 라우트 경로와 메뉴 경로가 혼동 없이 대응된다.
- [ ] 신규 개발자가 10분 내 pastor 흐름을 추적할 수 있다.
- [ ] 린트/빌드/기능 테스트(조회/저장/수정/삭제)가 통과한다.

---

## 9) Progress Log

- [ ] YYYY-MM-DD: 초안 생성
- [ ] YYYY-MM-DD: pastor 1차 이관 완료
- [ ] YYYY-MM-DD: 공통 추출 1차 완료
- [ ] YYYY-MM-DD: about 하위 확장 완료
- [ ] YYYY-MM-DD: official 도메인 안정화 완료
