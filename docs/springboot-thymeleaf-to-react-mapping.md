# Spring Boot + Thymeleaf -> React 전환 구조 매핑 문서

## 1) 목표와 범위

- 현재 서버 사이드 렌더링(Thymeleaf) 구조를 API 서버(Spring Boot) + 클라이언트 렌더링(React) 구조로 전환한다.
- 기존 도메인(`official`, `community`, `erp`, `system`, `auth`)의 URL 의미를 최대한 유지한다.
- 백엔드는 View 반환을 중단하고 JSON API 중심으로 재구성한다.

## 2) AS-IS 구조 요약 (Spring Boot + Thymeleaf)

```text
webProject/
├── build.gradle
├── settings.gradle
└── src/main/
    ├── java/com/main/app/
    │   ├── config/ (DatamainConfig, SecurityConfig)
    │   ├── exception/ (GlobalExceptionHandler)
    │   ├── common/ (controller, dto, mapper, helper, service)
    │   ├── auth/ (controller, dto, mapper, service)
    │   ├── official/ (controller, dto, service)
    │   ├── community/ (controller)
    │   ├── erp/ (controller)
    │   └── system/ (controller)
    └── resources/
        ├── mapper/ (common, community, auth)
        ├── templates/ (layout, official, community, erp, system, auth)
        └── static/ (css, js, img)
```

핵심 특징:

- `templates/layout/*` 중심의 공통 레이아웃 상속
- 컨트롤러가 View name 반환 (`"official/about/pastor"` 등)
- `GlobalControllerAdvice`로 공통 메뉴/세션 모델 주입
- 게시판은 `AbstractBoardController` + `BoardService` + MyBatis 조합

## 3) TO-BE 구조 요약 (Spring Boot API + React)

```text
webProject/
├── build.gradle                      # Thymeleaf 제거, API 서버 의존 구성
├── src/main/
│   ├── java/com/main/app/
│   │   ├── config/
│   │   │   ├── DatamainConfig.java
│   │   │   ├── SecurityConfig.java   # CORS/JWT(or 세션) 정책 반영
│   │   │   └── CorsConfig.java       # 신규
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler.java # JSON 에러 포맷
│   │   ├── common/
│   │   │   ├── dto/mapper/helper/service # 유지
│   │   │   └── controller/AbstractBoardController.java # JSON 반환 전환
│   │   ├── auth/api/                  # 신규 API 계층
│   │   ├── official/api/              # 신규 API 계층
│   │   ├── community/api/             # 신규 API 계층
│   │   ├── erp/api/                   # 신규 API 계층
│   │   └── system/api/                # 신규 API 계층
│   └── resources/
│       ├── application.properties     # Thymeleaf 설정 제거, CORS 설정 추가
│       ├── mapper/                    # 유지
│       ├── templates/                 # 제거 대상
│       └── static/                    # React 빌드 산출물 배치 경로
└── frontend/                          # React(Vite + TS) 신규
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── router/
        ├── layouts/
        ├── pages/
        ├── components/
        ├── api/
        ├── store/
        ├── hooks/
        ├── types/
        └── styles/
```

## 4) 영역별 매핑표

### 4.1 레이아웃/공통 구조

| AS-IS                           | TO-BE                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| `templates/layout/layout.html`  | `frontend/src/layouts/MainLayout.tsx`                                                               |
| `templates/layout/header.html`  | `frontend/src/layouts/Header.tsx`                                                                   |
| `templates/layout/footer.html`  | `frontend/src/layouts/Footer.tsx`                                                                   |
| `templates/layout/submenu.html` | `frontend/src/layouts/SubmenuLayout.tsx`                                                            |
| `templates/layout/sidebar.html` | `frontend/src/layouts/Sidebar.tsx`                                                                  |
| `GlobalControllerAdvice.java`   | `frontend/src/store/menuStore.ts` + `frontend/src/api/menuApi.ts` + `frontend/src/hooks/useMenu.ts` |

### 4.2 인증(Auth)

| AS-IS                               | TO-BE                                                  |
| ----------------------------------- | ------------------------------------------------------ |
| `UserController.java`               | `auth/api/AuthApiController.java` (신규)               |
| `templates/auth/user/login.html`    | `frontend/src/pages/auth/LoginPage.tsx`                |
| `templates/auth/user/register.html` | `frontend/src/pages/auth/RegisterPage.tsx`             |
| `templates/auth/user/mypage.html`   | `frontend/src/pages/auth/MyPage.tsx`                   |
| `session.getAttribute(...)`         | `frontend/src/store/authStore.ts`                      |
| `SecurityConfig.java`               | CORS + 인증 전략 반영으로 변경, `CorsConfig.java` 신규 |

### 4.3 공통 게시판

| AS-IS                                 | TO-BE                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------- |
| `AbstractBoardController.java`        | `BoardList.tsx`/`BoardView.tsx`/`BoardForm.tsx` + API 호출 훅으로 분리 |
| `BoardService.java`                   | 유지                                                                   |
| `BoardMapper.java`, `BoardMapper.xml` | 유지                                                                   |
| `BoardDto`, `CommentDto`, `FileDto`   | 백엔드 유지 + `frontend/src/types/board.types.ts` 신규                 |

### 4.4 Official

| AS-IS                                    | TO-BE                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| `MainController` + `official/index.html` | `MenuApiController` + `OfficialIndexPage.tsx`                             |
| `AboutController` + `about/*`            | `AboutApiController` + `Pastor/Vision/History/BeliefsPage.tsx`            |
| `WorshipController` + `worship/*`        | `WorshipApiController` + `Worship*Page.tsx`                               |
| `MinistriesController` + `ministries/*`  | `MinistriesApiController` + `Children/Youth/Mission*Page.tsx`             |
| `NewsController` + `news/*`              | `NewsApiController` + `Event/Announcement/Bulletin/Registration*Page.tsx` |
| `SupportController` + `support/*`        | `SupportApiController` + `Location/Faq/Qna*Page.tsx`                      |
| `LegacyUrlController`                    | React Router `Navigate` 리다이렉트                                        |

### 4.5 Community

| AS-IS                                        | TO-BE                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `CommunityIndexController`                   | `CommunityIndexPage.tsx`                                               |
| `FacilitiesController` + `facilities/*.html` | `FacilitiesApiController` + `FacilitiesCalendar/Dining/PrayerPage.tsx` |
| `GroupController` + `group/*.html`           | `GroupApiController` + `GroupManager/GroupA1/GroupB2Page.tsx`          |
| `SaintController` + `saint/*.html`           | `SaintApiController` + `Family/Pray/Sales/JobPage.tsx`                 |
| `WorldController` + `world/*.html`           | `WorldApiController` + `Christian/Economic/HealthPage.tsx`             |
| `QnaController` + `support/*.html`           | `CommunityBoardApiController` + `Board/Qna*Page.tsx`                   |
| `CommunityLegacyRedirectController`          | React Router `Navigate`                                                |

### 4.6 ERP

| AS-IS                                   | TO-BE                                       |
| --------------------------------------- | ------------------------------------------- |
| `ErpIndexController` + `erp/index.html` | `ErpApiController` + `ErpIndexPage.tsx`     |
| `erp/humen/*.html`                      | `frontend/src/pages/erp/humen/*Page.tsx`    |
| `erp/sermon/*.html`                     | `frontend/src/pages/erp/sermon/*Page.tsx`   |
| `erp/account/*.html`                    | `frontend/src/pages/erp/account/*Page.tsx`  |
| `erp/training/*.html`                   | `frontend/src/pages/erp/training/*Page.tsx` |
| `erp/ministry/*.html`                   | `frontend/src/pages/erp/ministry/*Page.tsx` |
| `erp/event/*.html`                      | `frontend/src/pages/erp/event/*Page.tsx`    |
| `erp/facility/*.html`                   | `frontend/src/pages/erp/facility/*Page.tsx` |
| `erp/comm/*.html`                       | `frontend/src/pages/erp/comm/*Page.tsx`     |
| `erp/stats/*.html`                      | `frontend/src/pages/erp/stats/*Page.tsx`    |

### 4.7 System

| AS-IS                                         | TO-BE                                         |
| --------------------------------------------- | --------------------------------------------- |
| `SystemIndexController` + `system/index.html` | `SystemApiController` + `SystemIndexPage.tsx` |
| `system/user/manager.html`                    | `system/user/ManagerPage.tsx`                 |
| `system/user/role.html`                       | `system/user/RolePage.tsx`                    |
| `system/config/menu.html`                     | `system/config/MenuPage.tsx`                  |
| `system/config/code.html`                     | `system/config/CodePage.tsx`                  |
| `system/log/system.html`                      | `system/log/SystemLogPage.tsx`                |
| `system/log/audit.html`                       | `system/log/AuditPage.tsx`                    |
| `system/backup/policy.html`                   | `system/backup/PolicyPage.tsx`                |
| `system/backup/history.html`                  | `system/backup/HistoryPage.tsx`               |
| `SystemLegacyRedirectController`              | React Router `Navigate`                       |

### 4.8 정적 자원/스크립트

| AS-IS                      | TO-BE                                                  |
| -------------------------- | ------------------------------------------------------ |
| `static/css/main.css`      | `frontend/src/styles/global.css`                       |
| `static/css/portal.css`    | `frontend/src/styles/portal.css`                       |
| `static/css/community.css` | `frontend/src/styles/community.css`                    |
| `static/css/erp.css`       | `frontend/src/styles/erp.css`                          |
| `static/css/system.css`    | `frontend/src/styles/system.css`                       |
| `static/js/common.js`      | `useMenu.ts`, `App.tsx`, 레이아웃/라우터 로직으로 분해 |
| `static/js/chatbot.js`     | `frontend/src/components/chatbot/Chatbot.tsx`          |

### 4.9 빌드/설정

| AS-IS                           | TO-BE                                          |
| ------------------------------- | ---------------------------------------------- |
| `build.gradle` (Thymeleaf 포함) | `build.gradle` (Thymeleaf 제거, REST/API 중심) |
| `application.properties`        | Thymeleaf 설정 제거, CORS/API 설정 추가        |
| 없음                            | `frontend/package.json`                        |
| 없음                            | `frontend/vite.config.ts`                      |
| 없음                            | `frontend/tsconfig.json`                       |
| 없음                            | `CorsConfig.java`                              |

## 5) React 전환 필수 신규 파일

| 파일                                                | 역할                                                 |
| --------------------------------------------------- | ---------------------------------------------------- |
| `frontend/src/router/index.tsx`                     | `createBrowserRouter` 기반 전체 라우팅               |
| `frontend/src/api/client.ts`                        | axios 인스턴스 (`baseURL`, 인터셉터, 공통 에러 처리) |
| `frontend/src/store/authStore.ts`                   | 인증 상태(로그인 사용자/토큰/세션) 전역 저장         |
| `frontend/src/store/menuStore.ts`                   | 메뉴 목록/현재 활성 메뉴/서브메뉴 상태               |
| `frontend/src/hooks/useMenu.ts`                     | 메뉴 API 호출 + 활성 메뉴 계산                       |
| `frontend/src/hooks/useAuth.ts`                     | 로그인 상태 판별/보호 라우트 로직                    |
| `frontend/src/hooks/useBoard.ts`                    | 게시판 CRUD 공통 훅                                  |
| `frontend/src/types/menu.types.ts`                  | `MenuDto` 대응 타입                                  |
| `frontend/src/types/board.types.ts`                 | `BoardDto`/댓글/첨부 대응 타입                       |
| `frontend/src/types/user.types.ts`                  | `UserDto` 대응 타입                                  |
| `frontend/src/types/common.types.ts`                | 페이지네이션/공통 응답 타입                          |
| `src/main/java/com/main/app/config/CorsConfig.java` | React 개발 서버 연동 CORS 정책                       |
| `frontend/src/components/ProtectedRoute.tsx`        | 인증 필요 라우트 보호                                |

## 6) 전환 작업 순서 (권장)

1. 백엔드 공통 준비
   - `build.gradle`에서 Thymeleaf 의존 제거
   - `application.properties`에서 템플릿 설정 제거
   - `CorsConfig.java` 추가, `SecurityConfig.java` CORS/인증 정책 정비
2. API 계층 전환
   - 기존 View Controller를 도메인별 `api` 패키지로 분리
   - 응답 표준화(`ApiResponse<T>` 등)와 예외 JSON 포맷 정리
3. 프론트엔드 스캐폴딩
   - `frontend`에 Vite + React + TypeScript 초기화
   - 라우터/레이아웃/상태관리(store)/API 클라이언트 기본 골격 구성
4. 메뉴/인증/게시판 우선 이관
   - `GlobalControllerAdvice` 역할을 `menuStore + useMenu`로 대체
   - 세션 모델을 `authStore + useAuth`로 대체
   - 게시판 공통 흐름을 `useBoard + Board* 컴포넌트`로 대체
5. 도메인 페이지 점진 이관
   - `official -> community -> erp -> system` 순으로 페이지 이관
   - 레거시 URL은 React Router `Navigate`로 호환
6. 배포 통합
   - 개발: Spring(8080) + React(5173) 분리 운영
   - 운영: React 빌드 산출물을 Spring `static`에 배치하거나, 별도 CDN/정적 호스팅 사용

## 7) 검증 체크리스트

- [ ] 모든 기존 주요 URL에 대응하는 React 라우트 존재
- [ ] 메뉴 활성 상태(상위/하위)가 기존과 동일하게 표시
- [ ] 로그인/로그아웃/권한 페이지 접근 제어 정상
- [ ] 게시판 목록/상세/등록/수정/삭제 API 및 UI 정상
- [ ] CORS 오류 없이 로컬 개발 환경에서 API 통신 가능
- [ ] 레거시 리다이렉트 URL이 신규 URL로 올바르게 이동
- [ ] Thymeleaf 템플릿 제거 후 서버 기동/빌드 정상

## 8) 참고

- 본 문서는 구조 매핑과 전환 범위 정의용 기준 문서다.
- 실제 구현 시 API 응답 스펙, 인증 방식(JWT/세션), 라우트 정책은 팀 표준에 맞춰 확정한다.
