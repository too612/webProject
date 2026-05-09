# 전환 작업 전체 계획

> 작성일: 2026-05-06
> 범위: frontend/ + backend/
> 목적: 서버 템플릿(Thymeleaf) → React + Spring Boot API 전환 전체 작업 관리

---

## 0. 전환 개요

| 항목       | AS-IS                            | TO-BE                         |
| ---------- | -------------------------------- | ----------------------------- |
| 프론트엔드 | Thymeleaf (서버 템플릿)          | React + Vite + TypeScript     |
| 백엔드     | Spring MVC + Thymeleaf           | Spring Boot REST API          |
| 스타일     | 기존 CSS (btn-_, community-_ 등) | Tailwind CSS                  |
| 컨트롤러   | `@Controller` (뷰 반환)          | `@RestController` (JSON 반환) |
| 템플릿     | `templates/`, `static/css,js`    | 제거 (React 빌드로 대체)      |

---

## 1. Phase 1 - 환경 구성 ✅ 완료

- [x] React + Vite + TypeScript 프로젝트 초기 구성
- [x] Tailwind CSS 설치 및 설정
- [x] Axios 인스턴스 설정 (client.ts)
- [x] React Router 기본 구성
- [x] Zustand 전역 상태 관리 설정 (authStore, menuStore)
- [x] 레이아웃 컴포넌트 구성 (MainLayout, ErpLayout, AuthLayout 등)

---

## 2. Phase 2 - 공통 컴포넌트 구성 ✅ 완료

- [x] Header, Footer, Sidebar, Breadcrumb 컴포넌트
- [x] 공통 UI 컴포넌트 (Button, Input, Modal)
- [x] ProtectedRoute (인증 라우트 보호)
- [x] 도메인별 API 파일 구성 (authApi, menuApi, erpApi, systemApi, officialApi, communityApi)
- [x] 도메인별 라우트 파일 구성 (AuthRoutes, ErpRoutes, OfficialRoutes 등)

---

## 3. Phase 3 - 핵심 페이지 전환 ✅ 완료

- [x] 로그인 / 회원가입 페이지
- [x] ERP 재정관리 (AccountManagerPage, AccountInputPage, AccountBudgetPage)
- [x] 성도관리 (HumenManagerPage)
- [x] 시스템관리 (UserManagementPage, ConfigMenuPage)
- [x] 마이페이지 대시보드 (MyDashboardPage)

---

## 4. Phase 4 - 공유 페이지 컴포넌트 🔄 진행 중

### 4-1. 공통 규격 통일

- [ ] OfficialBoardListPage, OfficialBoardViewPage, OfficialBoardWritePage props 규격 통일
- [ ] CommunityListPage, SystemListPage, ErpListPage의 검색/정렬/페이징 입력 파라미터 통일
- [ ] 로딩/에러/빈데이터 UI 렌더링 규칙 통일

### 4-2. 스타일 정리

- [ ] 버튼 스타일 정책 통일 (btn 클래스 혼용 제거, Tailwind 유틸 우선)
- [ ] 테이블 셀 정렬/여백/반응형 처리 공통 패턴 적용
- [ ] 폼 입력 컴포넌트의 focus, validation 상태 스타일 통일

### 4-3. 타입 정리

- [ ] BoardDto/CommentDto/FileDto 캐스팅 최소화
- [ ] 리스트 결과 타입(ListResult 계열) 단일 규격으로 통합
- [ ] API 응답 어댑터 함수 중복 제거

### 4-4. 완료 기준

- [ ] 공유 컴포넌트에서 중복 스타일 로직이 눈에 띄게 축소됨
- [ ] 동일 패턴 화면 간 UI/동작 편차가 없음

---

## 5. Phase 5 - 섹션별 페이지 마이그레이션 📋 예정

### 5-1. auth

- [ ] Login/Register/MyPage 레이아웃 및 폼 동작 점검
- [ ] 인증 실패/세션 만료 시 UX 처리 통일

### 5-2. official

- [ ] about/worship/ministries/news/support 페이지 최종 스타일 점검
- [ ] list-view-write 흐름(게시판 계열) 실제 API 기준 검증

### 5-3. community

- [ ] group/facilities/saint/world/support 라우트-페이지-API 매핑 검증
- [ ] 레거시 QnA 경로와 운영 경로 구분 반영

### 5-4. erp

- [ ] humen/sermon/account/training/ministry/event/facility/comm/stats/admin 대표 화면 검증
- [ ] 테이블/필터/폼 패턴을 공유 컴포넌트 기준으로 통일

### 5-5. system

- [ ] user/config/log/backup 화면의 목록/검색/페이지네이션 동작 점검
- [ ] 스텁 응답 영역과 운영 API 연결 영역 구분 문서화

### 5-6. mypage

- [ ] profile/password/activity/inquiry/notifications/withdraw 화면 스타일/상태 처리 정리

---

## 6. Phase 6 - Backend 구조 전환 📋 예정

### 6-1. 패키지 구조 재편

- [ ] `controller/` 루트 레벨 MVC 컨트롤러 제거 후 도메인 기준 패키지로 이동
- [ ] `XxxApiController` → `XxxController` 네이밍 정리 (api/ 패키지로 역할 구분)
- [ ] `service/impl/XxxServiceImpl` 패턴 제거 → 단일 클래스로 통합
- [ ] 각 도메인에 `api/ application/ domain/ dto/ persistence/` 계층 적용

### 6-2. Thymeleaf 전용 컨트롤러 제거

아래 파일은 React 전환 완료 도메인부터 순차 삭제

| 파일                                                    | 비고                        |
| ------------------------------------------------------- | --------------------------- |
| `controller/CompanyController.java`                     | 뷰 반환 전용                |
| `controller/MainController.java`                        | 뷰 반환 전용                |
| `controller/ProductController.java`                     | 뷰 반환 전용                |
| `controller/SupportController.java`                     | 뷰 반환 전용                |
| `controller/UserController.java`                        | 뷰 반환 전용                |
| `erp/account/AccountController.java`                    | AccountApiController로 대체 |
| `erp/controller/ErpIndexController.java`                | 뷰 반환 전용                |
| `community/controller/BoardController.java`             | 뷰 반환 전용                |
| `official/controller/OfficialController.java`           | 뷰 반환 전용                |
| `system/controller/SystemIndexController.java`          | 뷰 반환 전용                |
| `system/controller/SystemLegacyRedirectController.java` | 레거시 리다이렉트 전용      |

### 6-3. 레거시 패턴 제거

- [ ] `auth/service/impl/UserServiceImpl.java` → AuthService 단일 클래스로 통합
- [ ] `common/service/impl/MenuServiceImpl.java` → MenuService 단일 클래스로 통합
- [ ] `common/exception/GlobalControllerAdvice.java` 제거 검토 (GlobalExceptionHandler로 충분)

### 6-4. application.properties 환경별 분리

- [ ] `application.properties` → 공통 기본 설정만 유지
- [ ] `application-local.properties` 생성 (로컬 DB, 디버그 설정)
- [ ] `application-dev.properties` 생성 (개발 서버)
- [ ] `application-prod.properties` 생성 (운영 서버, 민감정보 환경변수 처리)

### 6-5. MyBatis Mapper 구조 정리

- [ ] `mapper/` XML 경로를 도메인 기준으로 재편
  ```
  mapper/
  ├── auth/
  ├── mypage/
  ├── common/
  ├── official/
  ├── community/
  ├── erp/
  └── system/
  ```
- [ ] 조인/집계 heavy 쿼리는 `XxxReportMapper`, `XxxQueryMapper`로 분리
- [ ] 문자열 기반 sqlSession 호출 잔존 여부 확인 및 Mapper 인터페이스 방식으로 전환

### 6-6. 완료 기준

- [ ] 모든 컨트롤러가 `@RestController` 기반
- [ ] `templates/`, `static/css`, `static/js` 디렉토리 완전 제거
- [ ] 도메인별 `api/ application/ dto/ persistence/` 계층 적용 완료
- [ ] 환경별 properties 파일 분리 완료

---

## 7. 교차 검증 체크리스트

- [ ] 메뉴 클릭 시 Breadcrumb/Sidebar active 상태 일치
- [ ] 직접 URL 접근(새로고침) 시 라우팅/렌더링 문제 없음
- [ ] 모바일/데스크톱에서 버튼/테이블/폼 레이아웃 깨짐 없음
- [ ] 401/403/404/빈목록 처리 일관성 확보
- [ ] 기존 클래스 잔존 여부 재점검 (community-_, btn-_ 등)
- [ ] API 엔드포인트 `/api` prefix 통일 여부 확인
- [ ] 운영 경로 vs 레거시 경로 구분 문서 최신화

---

## 8. 권장 실행 순서

1. 공유 페이지 컴포넌트(Phase 4) 먼저 완료
2. official + system 대표 경로 세로 검증 (Phase 5)
3. community + erp 확장 검증 (Phase 5)
4. auth + mypage 최종 검증 (Phase 5)
5. Backend 패키지 구조 재편 (Phase 6)
6. Thymeleaf 전용 컨트롤러/템플릿 순차 제거 (Phase 6)
7. 교차 검증 체크리스트 전체 확인

---

## 9. 최종 완료 기준 (DoD)

- [ ] 주요 메뉴 경로에서 스타일/레이아웃 깨짐 없음
- [ ] CRUD 핵심 흐름(목록/상세/등록/수정/삭제) 대표 화면 검증 완료
- [ ] 공유 컴포넌트 기반으로 코드 중복 축소 완료
- [ ] 운영 경로 vs 레거시 경로 구분 문서 최신화 완료
- [ ] 모든 컨트롤러 `@RestController` 기반 전환 완료
- [ ] `templates/`, `static/` 레거시 리소스 완전 제거 완료
- [ ] 환경별 properties 분리 및 운영 배포 검증 완료
