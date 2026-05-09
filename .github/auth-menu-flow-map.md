# Auth + Menu 흐름 분석 문서

이 문서는 전체 사이트 공통 기반인 인증(Auth)과 메뉴(Menu) 흐름을 집중 분석한 문서입니다.

## 1. 인증(Auth) 구조

### 1-1. 백엔드

핵심 파일:

- src/main/java/com/main/app/auth/api/AuthApiController.java
- src/main/java/com/main/app/auth/service/UserService.java
- src/main/java/com/main/app/auth/service/impl/UserServiceImpl.java
- src/main/java/com/main/app/auth/mapper/UserMapper.java

핵심 엔드포인트:

- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me
- GET /api/auth/check
- POST /api/auth/logout
- GET /api/auth/check-userid
- GET /api/auth/check-email

세션 처리:

- 로그인 성공 시 session에 userId/userName/loginUser 저장
- rememberMe가 true면 세션 만료 연장

### 1-2. 프론트

핵심 파일:

- frontend/src/api/client.ts
- frontend/src/store/authStore.ts
- frontend/src/components/ProtectedRoute.tsx
- frontend/src/router/AuthRoutes.tsx
- frontend/src/pages/auth/LoginPage.tsx
- frontend/src/pages/auth/RegisterPage.tsx

동작 요약:

1. 로그인 성공 후 authStore에 상태 저장
2. 보호 라우트 접근 시 ProtectedRoute가 isAuthenticated 검사
3. 미인증이면 /auth/login으로 이동
4. axios 401 응답 시 localStorage 인증정보 정리

주의:

- 백엔드 보안 체인은 permitAll이므로 서버 단 권한 차단은 제한적
- 현재 구조는 프론트 보호 + 세션 활용 중심

## 2. 메뉴(Menu) 구조

### 2-1. 백엔드

핵심 파일:

- src/main/java/com/main/app/official/api/MenuApiController.java
- src/main/java/com/main/app/common/service/MenuService.java
- src/main/java/com/main/app/common/service/impl/MenuServiceImpl.java
- src/main/java/com/main/app/common/exception/GlobalControllerAdvice.java

메뉴 API:

- GET /api/menu/hierarchical
- GET /api/menu/top
- GET /api/menu/path
- GET /api/menu/top-menu

핵심 기능:

- systemType별 계층 메뉴 생성
- 현재 URI와 최장 prefix 매칭으로 current 메뉴 결정
- 모델에 currentTopMenu/currentSubMenus/submenu 주입
- system, mypage, community의 레거시 경로 호환 처리

### 2-2. 프론트

핵심 파일:

- frontend/src/api/menuApi.ts
- frontend/src/hooks/useMenu.ts
- frontend/src/store/menuStore.ts
- frontend/src/layouts/Header.tsx
- frontend/src/layouts/SubmenuLayout.tsx
- frontend/src/layouts/Sidebar.tsx
- frontend/src/components/common/Breadcrumb.tsx

동작 요약:

1. 레이아웃 진입 시 useMenu 실행
2. /api/menu/hierarchical 호출 시도
3. 실패하면 fallbackMenuBySystem 사용
4. 현재 URL 기준 active 메뉴 계산
5. Header/Sidebar/Breadcrumb에 반영

## 3. 인증 + 메뉴 결합 흐름

1. 로그인 전

- Header는 로그인/회원가입 노출
- ProtectedRoute 경로 접근 시 로그인으로 이동

2. 로그인 후

- Header는 사용자명/로그아웃 노출
- /erp, /system, /mypage 접근 가능
- 메뉴는 systemType에 맞게 자동 전환

3. 로그아웃 후

- 세션 무효화
- authStore 초기화
- 보호 경로 재접근 시 차단

## 4. 분석/개선 체크포인트

1. 보안

- 서버 권한 정책 세분화 필요 (현재 permitAll)

2. 인증 저장소 일관성

- sessionStorage/localStorage 사용 정책 정리 필요

3. 메뉴 데이터 소스 일원화

- fallback과 DB 메뉴의 차이를 주기적으로 동기화 필요

4. 레거시 경로 정리

- GlobalControllerAdvice의 호환 코드 제거 시점 계획 필요

## 5. API 엔드포인트 표 (Auth + Menu)

| 영역 | 백엔드 베이스 경로 | 주요 메서드                     | 용도                     |
| ---- | ------------------ | ------------------------------- | ------------------------ |
| Auth | /api/auth          | POST /login, /register, /logout | 로그인/가입/로그아웃     |
| Auth | /api/auth          | GET /me, /check                 | 현재 세션/인증 상태 확인 |
| Auth | /api/auth          | GET /check-userid, /check-email | 중복 확인                |
| Menu | /api/menu          | GET /hierarchical               | 계층 메뉴                |
| Menu | /api/menu          | GET /top                        | 상위 메뉴                |
| Menu | /api/menu          | GET /path                       | 경로 기반 메뉴 조회      |
| Menu | /api/menu          | GET /top-menu                   | 상위 부모 메뉴 조회      |

## 6. 프론트 호출 매핑표 (Auth + Menu)

| 화면/레이어         | 프론트 파일                                                        | API 모듈/함수                                      | 실제 호출 경로                                  |
| ------------------- | ------------------------------------------------------------------ | -------------------------------------------------- | ----------------------------------------------- |
| 로그인 화면         | frontend/src/pages/auth/LoginPage.tsx                              | authApi.login                                      | /api/auth/login                                 |
| 회원가입 화면       | frontend/src/pages/auth/RegisterPage.tsx                           | authApi.register, checkUserId, checkEmail          | /api/auth/register, /check-userid, /check-email |
| 세션 검증           | frontend/src/hooks/useAuth.ts, store/authStore.ts                  | authApi.checkSession, getCurrentUser               | /api/auth/check, /me                            |
| 로그아웃 처리       | frontend/src/layouts/Header.tsx 등                                 | authApi.logout                                     | /api/auth/logout                                |
| 요청 공통 계층      | frontend/src/api/client.ts                                         | axios 인터셉터                                     | 401 응답 처리                                   |
| 공통 레이아웃 메뉴  | frontend/src/layouts/Header.tsx, SubmenuLayout.tsx                 | menuApi.getHierarchicalMenus/getTopMenus           | /api/menu/hierarchical, /top                    |
| 브레드크럼/사이드바 | frontend/src/components/common/Breadcrumb.tsx, layouts/Sidebar.tsx | useMenu + menuApi.findMenuByPath/findTopMenuByPath | /api/menu/path, /top-menu                       |

문서 버전: 1.0
작성일: 2026-05-06
