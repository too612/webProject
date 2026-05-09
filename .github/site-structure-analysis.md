# 전체 사이트 소스 구조 분석 가이드

이 문서는 현재 webProject 전체를 빠르게 분석하려는 개발자를 위한 구조 가이드입니다.
목표는 "어디를 먼저 보면 되는지", "각 소스가 어떤 책임을 가지는지", "실제 동작 경로가 어디인지"를 명확히 하는 것입니다.

---

## 1. 프로젝트 성격 요약

현재 코드는 하이브리드 상태입니다.

- 백엔드: Spring Boot + MyBatis + PostgreSQL
- 프론트: React + Vite + TypeScript + Tailwind
- 인증: Spring Security는 전체 허용(permissive) + 세션 기반 커스텀 인증
- 렌더링: 기존 Thymeleaf 템플릿 경로와 React SPA 경로가 공존

즉, "완전 분리 API 서버"가 아니라, 전환기 구조(SSR 흔적 + SPA 병행)로 보는 것이 정확합니다.

---

## 2. 최상위 디렉토리 역할

1. src/main/java/com/main/app

- 백엔드 애플리케이션 코드 핵심
- 도메인별 패키지(auth, official, community, erp, system, mypage, common)

2. src/main/resources

- application.properties
- MyBatis XML (mapper/\*\*)
- 정적 리소스(static/\*\*)
- 기존 템플릿(templates/\*\*)

3. frontend/src

- React 애플리케이션
- router, layouts, pages, api, store, hooks, styles

4. .github

- 개발/분석용 문서

---

## 3. 백엔드 구조 (소스 역할 중심)

### 3-1. 엔트리 및 공통 설정

1. src/main/java/com/main/app/AppApplication.java

- Spring Boot 시작점
- MapperScan으로 MyBatis 매퍼 패키지 등록

2. src/main/java/com/main/app/config/SecurityConfig.java

- 보안 필터 체인 설정
- 현재는 `anyRequest().permitAll()`로 모든 요청 허용
- 세션 정책은 IF_REQUIRED

3. src/main/resources/application.properties

- 서버 포트/인코딩/DB/MyBatis/로깅/업로드 설정
- DB: PostgreSQL DEV

### 3-2. 공통 레이어 (핵심)

1. src/main/java/com/main/app/common/exception/GlobalControllerAdvice.java

- 모든 요청에 공통 모델 데이터 주입
- 현재 URI 기반 systemType 추출
- 메뉴 계층 조회 후 `currentTopMenu`, `currentSubMenus`, `submenu` 등 설정
- 레거시 경로(/system, /mypage, /community 변형) 호환 처리 포함

2. src/main/java/com/main/app/common/service/MenuService.java
3. src/main/java/com/main/app/common/service/impl/MenuServiceImpl.java

- 메뉴 계층 구성, 최상위 메뉴 조회, 경로 기반 메뉴 탐색

4. src/main/java/com/main/app/common/mapper/\*
5. src/main/resources/mapper/common/\*

- 공통 DB 접근과 SQL
- 특히 BoardMapper는 게시판 공통 엔진의 핵심

### 3-3. 도메인 패키지 역할

1. auth

- 로그인/회원가입/세션 확인 API
- 핵심: src/main/java/com/main/app/auth/api/AuthApiController.java

2. official

- 교회소개/예배/사역/소식/지원 도메인
- 메뉴 API: src/main/java/com/main/app/official/api/MenuApiController.java
- 지원 페이지 메타: SupportApiController
- QnA 등 게시판 API는 공통 BoardController 상속 패턴 사용

3. community

- 그룹/시설/성도/세계/지원 도메인
- API 패키지에 페이지 메타/목록 API가 모여 있음
- 일부 qna 하위 파일은 스텁/레거시 성격이 섞여 있으므로 실제 경로 구분 필요

4. erp

- humen/sermon/account/training/ministry/event/facility/comm/stats/admin
- 인덱스/카테고리별 컨트롤러 + API 컨트롤러 공존

5. system

- 사용자/설정/로그/백업
- 핵심:
  - src/main/java/com/main/app/system/controller/SystemIndexController.java
  - src/main/java/com/main/app/system/controller/SystemLegacyRedirectController.java
  - src/main/java/com/main/app/system/api/SystemApiController.java

6. mypage

- 마이페이지 사용자 기능 API

---

## 4. 프론트엔드 구조 (소스 역할 중심)

### 4-1. 앱 진입/라우팅

1. frontend/src/App.tsx

- RouterProvider 연결만 담당

2. frontend/src/router/index.tsx

- 전체 라우트 통합
- official/community/erp/mypage/system/auth 라우트를 병합

3. frontend/src/router/\*Routes.tsx

- 도메인별 라우팅 선언
- 실제 URL 구조 파악의 1순위 파일

### 4-2. 레이아웃 계층

1. frontend/src/layouts/MainLayout.tsx

- Header + Outlet + Footer + Chatbot

2. frontend/src/layouts/SubmenuLayout.tsx

- Hero + Breadcrumb + Sidebar + 콘텐츠 영역
- 공식/커뮤니티/시스템 등 서브메뉴 페이지 공통 틀

3. frontend/src/layouts/ErpLayout.tsx
4. frontend/src/layouts/MypageLayout.tsx
5. frontend/src/layouts/AuthLayout.tsx

- 도메인별 레이아웃 분화

### 4-3. 인증/메뉴 상태

1. frontend/src/components/ProtectedRoute.tsx

- 인증되지 않은 경우 /auth/login으로 리다이렉트

2. frontend/src/store/authStore.ts

- 세션스토리지 기반 인증 상태 저장

3. frontend/src/hooks/useMenu.ts

- 메뉴 API 호출 및 fallback 메뉴 구성
- 현재 경로 기준 활성 메뉴/서브메뉴 계산

4. frontend/src/api/menuApi.ts

- `/api/menu/*` 호출 래퍼

### 4-4. API 호출 공통

1. frontend/src/api/client.ts

- axios 인스턴스
- baseURL 기본값: /api
- withCredentials=true
- 401 응답 시 로컬 인증정보 정리

2. frontend/src/api/\*.ts

- 도메인별 API 함수 집합
- 화면 컴포넌트는 이 레이어를 통해 백엔드와 통신

---

## 5. URL 구조 파악표 (프론트 기준)

1. 공식(메인)

- /about/_, /worship/_, /ministries/_, /news/_, /support/\*
- 라우트 정의: frontend/src/router/OfficialRoutes.tsx

2. 커뮤니티

- /community/group/_, /community/facilities/_, /community/saint/_, /community/world/_, /community/support/\*
- 라우트 정의: frontend/src/router/CommunityRoutes.tsx

3. ERP

- /erp/\* 하위 다수
- 라우트 정의: frontend/src/router/ErpRoutes.tsx

4. 시스템

- /system/user/_, /system/config/_, /system/log/_, /system/backup/_
- 라우트 정의: frontend/src/router/SystemRoutes.tsx

5. 마이페이지/인증

- /mypage/_, /auth/_
- 라우트 정의: frontend/src/router/MypageRoutes.tsx, AuthRoutes.tsx

---

## 6. 요청 처리 데이터 흐름

### 6-1. 일반 페이지(React)

1. 사용자 브라우저가 React Route 진입
2. 해당 페이지 컴포넌트가 api/\* 함수 호출
3. client.ts(axios)가 /api/\* 요청 전송
4. 백엔드 Controller/ApiController 진입
5. Service에서 비즈니스 처리
6. Mapper + XML SQL 실행
7. DB 결과를 ApiResponse로 반환
8. 프론트에서 상태 업데이트 후 렌더링

### 6-2. 메뉴/사이드바 공통 흐름

1. 레이아웃에서 useMenu() 실행
2. /api/menu/hierarchical 호출
3. 메뉴 스토어 업데이트
4. 현재 URL과 매칭해 currentTopMenu/currentSubMenus 계산
5. Header/Breadcrumb/Sidebar에 반영

### 6-3. 보호 라우트 흐름

1. ProtectedRoute에서 authStore.isAuthenticated 검사
2. false면 /auth/login 이동
3. true면 하위 라우트 렌더링

---

## 7. 모듈별 성숙도/상태

1. 게시판 계열(공지/설교/QnA 등)

- 공통 엔진 재사용이 잘 되어 있음
- Controller/Service/Mapper 구조가 일관됨

2. System API

- 일부는 메타/빈 목록 응답 형태(스텁 데이터)로 구현되어 있음
- 프론트 골격 검증용 API와 운영 API가 혼재

3. SupportService/일부 qna 패키지

- TODO/스텁 파일이 일부 남아 있음
- 실제 운영 경로와 레거시 경로 구분 필요

4. 전환 상태

- Thymeleaf 경로와 React 경로가 모두 남아 있어,
  "현재 사용 경로"를 기능 단위로 명확히 지정해 유지보수해야 함

---

## 8. 소스 분석 추천 순서 (실무용)

전체를 가장 빠르게 이해하려면 아래 순서로 읽는 것을 권장합니다.

1. 라우팅 지형도 파악

- frontend/src/router/index.tsx
- frontend/src/router/\*Routes.tsx

2. 공통 레이아웃/메뉴

- frontend/src/layouts/MainLayout.tsx
- frontend/src/layouts/SubmenuLayout.tsx
- frontend/src/hooks/useMenu.ts
- frontend/src/api/menuApi.ts

3. 백엔드 공통 구조

- src/main/java/com/main/app/common/exception/GlobalControllerAdvice.java
- src/main/java/com/main/app/common/service/impl/MenuServiceImpl.java
- src/main/java/com/main/app/config/SecurityConfig.java

4. 기능 1개를 세로로 추적

- 예: QnA 또는 System Backup
- 화면 -> api -> controller -> service -> mapper -> xml SQL

5. 나머지 도메인 확장

- official -> community -> erp -> system -> auth/mypage 순

---

## 9. 핵심 포인트 요약

1. 이 프로젝트는 도메인 분리가 명확한 편이다.

- official/community/erp/system/auth/mypage로 경계가 뚜렷함

2. 게시판은 공통 엔진화가 잘 되어 있다.

- 새로운 게시판 추가 시 Context + 라우트 + 화면만 붙이면 확장 가능

3. 메뉴 시스템이 전체 UX를 지배한다.

- useMenu + MenuApi + GlobalControllerAdvice 이해가 전체 분석의 핵심

4. 현재는 전환기 아키텍처다.

- React 중심으로 이동 중이며, 일부 레거시/스텁 코드가 병행 존재

5. 분석할 때는 "실제 호출 경로"를 기준으로 본다.

- 파일이 있다고 곧 운영 경로는 아님
- 라우터와 RequestMapping, API 호출부를 함께 확인해야 정확함

---

문서 버전: 1.0
작성일: 2026-05-06
