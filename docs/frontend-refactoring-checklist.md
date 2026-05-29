# Frontend Common Source Refactoring Guide (Pastor Baseline)

이 문서는 완료된 도메인 이관 이력 문서가 아니라,
현재 진행 중인 공통 소스 정리 작업을 위한 실행 기준 문서다.

현재 초점:

1. 제거 가능한 공통 파일 식별 및 삭제
2. 공통으로 반드시 남겨야 하는 파일 확정
3. 업무 메뉴로 흡수할 공통 파일 정리

---

## 0) 전제

- 도메인 이관(`official`, `community`, `erp`, `system`, `mypage`)은 완료로 본다.
- 이 문서는 도메인 재이관이 아니라 `frontend/src`의 공통 레이어 정리에 집중한다.
- 기준 책임 분리는 `official/about/pastor`의 `Page/Hook/Api/Model` 역할을 따른다.

---

## 1) Pastor 기준 역할 정의 (필수)

### 1-1) Page

- 화면 렌더링, 이벤트 처리, 입력 상태 관리
- Hook 호출만 수행

금지:

- HTTP 호출 직접 수행
- 엔드포인트 하드코딩

### 1-2) Hook

- 도메인 상태(`loading/error/data`) 보유
- 유스케이스 흐름 제어
- Api 호출 오케스트레이션

금지:

- JSX 반환

### 1-3) Api

- HTTP 호출 캡슐화
- 에러 메시지 표준화
- 응답 타입 계약 유지

금지:

- UI 상태 처리

### 1-4) Model

- 타입/상수 계약 정의

금지:

- API 호출/상태 로직

---

## 2) 레이아웃 이동 기준 (중요)

`layout` 폴더 내 파일은 "auth를 참조한다"는 이유만으로 이동 대상이 아니다.

### 2-1) 이동 금지 (레이아웃 책임 유지)

- 앱 전체 레이아웃을 관장하는 파일
- 전역 네비게이션/헤더/푸터/사이드바 파일
- 여러 도메인에서 공통 사용하는 뼈대 UI

예: `Header.tsx`는 auth 상태를 참조하더라도 레이아웃 책임이므로 `common/auth` 이동 대상이 아님.

### 2-2) 이동 가능 (auth 도메인 책임)

- 로그인/회원가입/세션검증 등 인증 유스케이스를 직접 수행하는 파일
- auth 페이지/훅/API/모델/상태 파일

---

## 3) 현재 작업 범위

### 3-1) boardApi 제거 목적 작업

목표:

- `api/boardApi.ts`의 사용처를 메뉴 단위 파일로 흡수
- 공통은 최소화하고, 메뉴 우선으로 이해 가능한 구조 확립

원칙:

- 우선 메뉴별 `*Api.ts`로 기능을 흡수한다.
- 기능 중복이 안정적으로 확인되면 나중에 공통화한다.
- 파일 생성은 최소화하고 기존 `Page/Hook/Api/Model` 틀 안에서 정리한다.

현재 상태:

- `boardApi` 및 `useBoard` 제거가 완료되었고 메뉴별 로컬 Api로 흡수되었다.
- 신규 게시판 메뉴 작업은 중앙 공통 Api 추가보다 메뉴 로컬 Api 우선을 기본 원칙으로 한다.

실행 단계:

1. 메뉴별 `*Api.ts`에 board 동작 이관
2. 메뉴 Base/Page에서 `boardApi` 직접 호출 제거
3. `useBoard` 의존 제거 또는 메뉴별 Hook으로 흡수
4. 잔여 참조 0건 확인 후 `api/boardApi.ts` 제거

### 3-2) menuApi 제거 목적 작업

목표:

- Java `com.main.app.common.menu`와 동일 레벨로 프론트 메뉴 소스 정렬
- `frontend/src/common/menu`로 이동 및 재구성

원칙:

- `useMenu`가 직접 외부 호출을 책임지지 않도록,
  메뉴 도메인 Api/Hook/Model로 분리한다.
- `fallback` 데이터는 모델 상수로 분리한다.

실행 단계:

1. `common/menu/menuApi.ts`, `common/menu/menuModel.ts`, `common/menu/menuHook.ts`로 재구성
2. 기존 `hooks/useMenu.ts`와 `api/menuApi.ts` 의존 제거
3. 라우터/레이아웃 import 전환
4. 중앙 `api/menuApi.ts` 제거

최신 반영:

- `menuStore`를 `common/menu/menuStore.ts`로 이관 완료
- `MenuItem` 타입을 `common/menu/menu.types.ts`로 이관 완료
- 기존 `store/menuStore.ts`, `types/menu.types.ts`는 정리 완료

### 3-3) auth 관련 파일 정리 작업

목표:

- `common/auth` 중심으로 인증 소스 응집
- 레이아웃 책임과 인증 책임 분리

원칙:

- `useAuth.ts` 단독 이동이 아니라 `authStore`와 함께 auth 책임 범위를 검토한다.
- `Header.tsx`, `ProtectedRoute.tsx`는 인증 정보를 사용해도
  각각 레이아웃/라우팅 가드 책임이므로 무조건 auth로 이동하지 않는다.

실행 단계:

1. auth 책임 파일 식별(`authApi`, `login/register`, `useAuth`, `authStore`)
2. layout/route 책임 파일 분리 유지(`Header`, `AuthRoutes`, `ProtectedRoute`)
3. 필요 시 auth 내부 Hook/Model 재구성

최신 반영:

- `login/register`는 각각 `Page/Hook/Api/Model` 4파일 체계로 정리되었다.
- `authApi`는 공통 세션 책임(`logout/getCurrentUser/checkSession`)만 유지한다.
- `/auth` 라우트는 공통 auth layout 1개를 사용하고,
  로그인/회원가입 전용 wrapper layout 파일은 제거되었다.
- `types/user.types.ts`의 타입을 auth 도메인으로 이관 완료
- `AuthResponse/LoginRequest`는 `loginModel`로 병합,
  `RegisterRequest`는 `registerModel`로 병합,
  `UserType`은 `authStore`로 병합
- auth 타입 의존 단순화를 위해 `common/auth/authModel.ts`를 추가하고
  `AuthResponse/UserType`을 공통 모델로 재배치 완료
- auth 타입 import 진입점으로 `common/auth/authTypes.ts`를 추가해
  login/register API의 타입 import 경로를 단순화
- login/register API의 요청/응답 타입 alias를
  `LoginApiRequest/LoginApiResponse`, `RegisterApiRequest/RegisterApiResponse`로 통일
- `types/index.ts`는 auth 도메인 타입을 re-export하도록 갱신되었고,
  기존 `types/user.types.ts`는 제거되었다.

### 3-4) 대분류 레이아웃 통합 정리 작업

목표:

- ERP/Mypage 전용 레이아웃 중복 제거
- 공통 `MainLayout + SubmenuLayout` 조합으로 계층 정리

최신 반영:

- `ErpLayout.tsx`, `MypageLayout.tsx` 제거 완료
- `ErpRoutes`, `MypageRoutes`를 `MainLayout` + 하위 `SubmenuLayout` 구조로 재배치 완료
- `MainLayout`에 `showChatbot` 옵션을 추가해 도메인별 표시 정책을 유지

### 3-5) 공통 컴포넌트 위치 정리 작업

목표:

- 공통 UI 기능은 `common` 레이어로 응집

최신 반영:

- `components/chatbot`의 `Chatbot`을 `common/chatbot`으로 이동 완료
- `MainLayout`, `authLayout` import를 공통 경로로 전환 완료
- 중복 소스 제거 및 단일 소스 유지 완료
- `ProtectedRoute`를 `components`에서 `router`로 이동해 라우팅 가드 책임 위치를 정렬
- `Breadcrumb`를 `components/common`에서 `layouts`로 이동해 레이아웃 책임 위치를 정렬
- `Breadcrumb` 홈 이동을 `window.location.href`에서 `Link` 기반 SPA 이동으로 전환
- `Breadcrumb` 드롭다운에 `button/aria-expanded/aria-controls`를 적용해 접근성 개선

---

## 4) 삭제/유지/흡수 분류 기준

### 4-1) 즉시 삭제 가능

- 참조 0건
- 역할 중복
- 대체 파일 존재

### 4-2) 공통 유지

- 다수 도메인에서 안정적으로 재사용
- 비즈니스가 아닌 인프라/전역 관점 책임

### 4-3) 업무단 흡수

- 특정 메뉴 흐름에 강하게 결합
- 공통으로 묶을수록 이해도가 떨어짐

---

## 5) 진행 현황 (공통 소스 중심)

- [x] `api/newsApi.ts` 제거 (참조 0건 확인)
- [x] 미사용 공용 UI 보조 컴포넌트 7개 제거
- [x] `official/support/qna`의 `boardApi` 의존 제거 (`qnaApi` 로컬 흡수)
- [x] `official/news/announcement`의 `boardApi` 의존 제거 (`announcementApi` 로컬 흡수)
- [x] `official/news/bulletin`의 `boardApi` 의존 제거 (`bulletinApi` 로컬 흡수)
- [x] `official/news/registration`의 `boardApi` 의존 제거 (`registrationApi` 로컬 흡수)
- [x] `official/ministries/children`의 `boardApi` 의존 제거 (`childrenApi` 로컬 흡수)
- [x] `official/ministries/youth`의 `boardApi` 의존 제거 (`youthApi` 로컬 흡수)
- [x] `official/ministries/mission`의 `boardApi` 의존 제거 (`missionApi` 로컬 흡수)
- [x] `official/worship/sermons`의 `boardApi` 의존 제거 (`sermonsApi` 직접 구현 전환)
- [x] 중앙 `api/boardApi.ts` 제거 및 미사용 `hooks/useBoard.ts` 제거
- [x] `common/menu` 구조로 전환 (`menuApi/menuModel/menuHook`) 및 중앙 `api/menuApi.ts` + `hooks/useMenu.ts` 제거
- [x] `menuStore`를 `common/menu/menuStore.ts`로 이관하고 기존 `store/menuStore.ts` 제거
- [x] `MenuItem` 타입을 `common/menu/menu.types.ts`로 이관하고 기존 `types/menu.types.ts` 제거
- [x] auth 책임 파일을 `common/auth`로 응집 (`authApi/authStore/authHook/login/register`)하고 레이아웃/가드 책임은 기존 위치 유지
- [x] auth `login/register`를 각각 `Page/Hook/Api/Model` 4파일 체계로 정리
- [x] auth 공통 라우팅에서 로그인/회원가입 전용 layout wrapper 제거 및 공통 layout 단일화
- [x] `types/user.types.ts` 제거 및 auth 도메인 파일(`authStore/loginModel/registerModel`)로 타입 병합 이관
- [x] `common/auth/authModel.ts` 도입으로 `AuthResponse/UserType` 공통 타입 의존 방향 정리
- [x] `common/auth/authTypes.ts` 도입 및 login/register API 요청/응답 alias 네이밍 통일
- [x] `ErpLayout.tsx`, `MypageLayout.tsx` 제거 및 `ErpRoutes/MypageRoutes`를 `MainLayout + SubmenuLayout` 계층으로 통합
- [x] `MainLayout`에 `showChatbot` 옵션 추가로 도메인별 챗봇 표시 정책 유지
- [x] `Chatbot` 컴포넌트를 `common/chatbot`으로 이동하고 기존 `components/chatbot` 제거
- [x] `ProtectedRoute`를 `router/ProtectedRoute.tsx`로 이동하여 라우트 가드 책임 위치 정렬
- [x] `Breadcrumb`를 `layouts/Breadcrumb.tsx`로 이동하여 레이아웃 책임 위치 정렬
- [x] `Breadcrumb` 홈 이동을 SPA 방식(`Link`)으로 전환하고 드롭다운 접근성(aria/button) 개선

---

## 6) 완료 조건

아래를 모두 만족하면 공통 소스 정리 완료로 본다.

1. `boardApi`, `menuApi` 중앙 파일 제거 또는 유지 사유 명문화
2. auth 관련 파일의 책임 경계(인증 vs 레이아웃) 문서화
3. `get_errors` 무오류
4. frontend build 통과

---

## 7) 작업 시 유의사항

- 도메인 폴더(`official`, `community`, `erp`, `system`, `mypage`)의 완료 구조를 훼손하지 않는다.
- 파일 이동은 "참조 여부"보다 "책임" 기준으로 판단한다.
- 공통화는 선행하지 말고, 메뉴 흡수 후 중복이 확인된 기능만 순차적으로 진행한다.
