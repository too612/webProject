# ERP + System 도메인 소스 책임 맵

이 문서는 운영성 화면이 많은 ERP와 System 영역을 함께 분석하기 위한 문서입니다.

## 1. ERP 구조

### 1-1. 역할 요약

ERP는 내부 운영 도메인 성격의 대규모 메뉴를 가집니다.

- humen, sermon, account, training, ministry
- event, facility, comm, stats, admin

### 1-2. 백엔드 핵심 파일

- src/main/java/com/main/app/erp/controller/ErpIndexController.java
  - 템플릿 경로 기반 카테고리 진입
- src/main/java/com/main/app/erp/api/ErpApiController.java
- src/main/java/com/main/app/erp/account/AccountApiController.java
- src/main/java/com/main/app/erp/training/TrainingApiController.java
- src/main/java/com/main/app/erp/stats/StatsApiController.java
- src/main/java/com/main/app/erp/event/EventApiController.java
- src/main/java/com/main/app/erp/admin/AdminApiController.java

서비스/매퍼는 각 카테고리 패키지에 분산되어 있습니다.

### 1-3. 프론트 핵심 파일

- frontend/src/router/ErpRoutes.tsx
- frontend/src/layouts/ErpLayout.tsx
- frontend/src/pages/erp/\**/*Page.tsx

특징:

- 거의 모든 ERP 경로는 ProtectedRoute로 보호
- 페이지 수가 많아 라우터 파일을 기준으로 탐색하는 것이 가장 빠름

## 2. System 구조

### 2-1. 역할 요약

System은 관리자용 설정/운영 기능입니다.

- user: 사용자/권한
- config: 코드/메뉴
- log: 시스템/감사
- backup: 정책/이력

### 2-2. 백엔드 핵심 파일

- src/main/java/com/main/app/system/controller/SystemIndexController.java
  - 카테고리/페이지별 메타 구성
- src/main/java/com/main/app/system/controller/SystemLegacyRedirectController.java
  - 과거 단축 경로 리다이렉트
- src/main/java/com/main/app/system/api/SystemApiController.java
  - 시스템 영역 API 집합 (일부 스텁 응답 포함)

카테고리별 서비스/매퍼:

- src/main/java/com/main/app/system/user/\*
- src/main/java/com/main/app/system/config/\*
- src/main/java/com/main/app/system/log/\*
- src/main/java/com/main/app/system/backup/\*

### 2-3. 프론트 핵심 파일

- frontend/src/router/SystemRoutes.tsx
- frontend/src/pages/system/SystemIndexPage.tsx
- frontend/src/pages/system/shared/SystemListPage.tsx
- frontend/src/pages/system/user/\*.tsx
- frontend/src/pages/system/config/\*.tsx
- frontend/src/pages/system/log/\*.tsx
- frontend/src/pages/system/backup/\*.tsx

특징:

- SystemListPage 기반으로 목록형 화면 패턴을 통일
- ProtectedRoute + MainLayout + SubmenuLayout 조합

## 3. 공통 분석 포인트 (ERP/System)

1. 권한

- 프론트는 ProtectedRoute에서 1차 제어
- 백엔드는 현재 SecurityConfig가 permitAll이므로, 실제 권한 통제는 추가 구현 필요

2. 메뉴

- useMenu와 menu API에 따라 사이드바/브레드크럼이 결정

3. 데이터

- 실제 운영 API와 초기 스텁 API가 섞여 있어, 화면별 호출 API 응답을 먼저 확인해야 함

## 4. 빠른 디버깅 순서

1. 라우트 경로 확인

- ErpRoutes.tsx 또는 SystemRoutes.tsx

2. 페이지 컴포넌트 확인

- 해당 페이지에서 어떤 api 모듈 호출하는지 확인

3. 백엔드 ApiController 확인
4. 서비스/매퍼/XML SQL 순으로 추적

## 5. API 엔드포인트 표 (ERP)

| 영역     | 백엔드 베이스 경로 | 주요 메서드                                          | 용도                 |
| -------- | ------------------ | ---------------------------------------------------- | -------------------- |
| ERP 메타 | /api/erp           | GET /pages, /pages/extended                          | ERP 메뉴/페이지 메타 |
| Humen    | /api/erp/humen     | GET /manager, /district, /newcomer, /change          | 성도관리 목록        |
| Sermon   | /api/erp/sermon    | GET /manager, /archive, /attendance, /order          | 설교/예배 목록       |
| Account  | /api/erp/account   | GET /manager, /input, /budget, /expense, /report     | 회계 데이터          |
| Training | /api/erp/training  | GET /course, /student, /attendance, /complete        | 교육 데이터          |
| Ministry | /api/erp/ministry  | GET /department, /schedule, /volunteer, /report      | 사역 데이터          |
| Event    | /api/erp/event     | GET /calendar, /apply, /participant, /result         | 행사 데이터          |
| Facility | /api/erp/facility  | GET /reservation, /vehicle, /inventory, /maintenance | 시설 데이터          |
| Comm     | /api/erp/comm      | GET /notice, /message, /prayer, /newsletter          | 소통 데이터          |
| Admin    | /api/erp/admin     | GET /certificate, /approval, /minutes, /archive      | 행정 데이터          |
| Stats    | /api/erp/stats     | GET /dashboard, /attendance, /offering, /ministry    | 통계 데이터          |

## 6. API 엔드포인트 표 (System)

| 영역        | 백엔드 베이스 경로 | 주요 메서드           | 용도             |
| ----------- | ------------------ | --------------------- | ---------------- |
| System 메타 | /api/system        | GET /pages            | 시스템 메뉴 메타 |
| User        | /api/system/user   | GET /list, /roles     | 사용자/권한 목록 |
| Config      | /api/system/config | GET /codes, /menus    | 코드/메뉴 설정   |
| Log         | /api/system/log    | GET /system, /audit   | 로그/감사 목록   |
| Backup      | /api/system/backup | GET /policy, /history | 백업 정책/이력   |

## 7. 프론트 호출 매핑표 (ERP/System)

| 화면/라우트       | 프론트 파일                             | API 모듈/함수                         | 실제 호출 경로                      |
| ----------------- | --------------------------------------- | ------------------------------------- | ----------------------------------- |
| /erp/\* 전체      | frontend/src/pages/erp/\*_/_.tsx        | erpApi.getPages, getPagesExtended     | /api/erp/pages\*                    |
| /erp/humen/\*     | frontend/src/pages/erp/humen/\*.tsx     | erpApi.humen.\*                       | /api/erp/humen/\*                   |
| /erp/account/\*   | frontend/src/pages/erp/account/\*.tsx   | erpApi.account.\*                     | /api/erp/account/\*                 |
| /erp/event/\*     | frontend/src/pages/erp/event/\*.tsx     | erpApi.event.\*                       | /api/erp/event/\*                   |
| /erp/stats/\*     | frontend/src/pages/erp/stats/\*.tsx     | erpApi.stats.\*                       | /api/erp/stats/\*                   |
| /system/\* 전체   | frontend/src/pages/system/\*_/_.tsx     | systemApi.getPages                    | /api/system/pages                   |
| /system/user/\*   | frontend/src/pages/system/user/\*.tsx   | systemApi.user.getList/getRoles       | /api/system/user/list, /roles       |
| /system/config/\* | frontend/src/pages/system/config/\*.tsx | systemApi.config.getCodes/getMenus    | /api/system/config/codes, /menus    |
| /system/log/\*    | frontend/src/pages/system/log/\*.tsx    | systemApi.log.getSystem/getAudit      | /api/system/log/system, /audit      |
| /system/backup/\* | frontend/src/pages/system/backup/\*.tsx | systemApi.backup.getPolicy/getHistory | /api/system/backup/policy, /history |

문서 버전: 1.0
작성일: 2026-05-06
