# Official 도메인 소스 책임 맵

이 문서는 official 영역을 개발자가 빠르게 분석하기 위한 책임 중심 문서입니다.

## 1. 역할 요약

Official 영역은 대외 사이트 성격의 메뉴를 담당합니다.

- about: 교회소개
- worship: 예배/설교
- ministries: 사역
- news: 소식
- support: 안내 및 QnA

핵심 구현 특징은 다음과 같습니다.

- 게시판류는 공통 게시판 엔진 재사용
- 페이지 메타/메뉴는 API로 제공
- React 라우팅과 기존 템플릿 경로가 병행

## 2. 백엔드 핵심 파일

### 2-1. 진입/메뉴

- src/main/java/com/main/app/official/controller/MainController.java
  - 공식 메인 페이지 진입
- src/main/java/com/main/app/official/api/MenuApiController.java
  - 메뉴 계층, 상위 메뉴, 경로 기반 메뉴 조회

### 2-2. 섹션별 API

- src/main/java/com/main/app/official/api/WorshipApiController.java
- src/main/java/com/main/app/official/api/MinistriesApiController.java
- src/main/java/com/main/app/official/api/NewsApiController.java
- src/main/java/com/main/app/official/api/SupportApiController.java

위 API는 각 섹션의 페이지 메타나 목록 데이터를 제공하는 역할입니다.

### 2-3. 게시판 API (공통 엔진 어댑터)

- src/main/java/com/main/app/official/api/AnnouncementBoardApiController.java
- src/main/java/com/main/app/official/api/BulletinBoardApiController.java
- src/main/java/com/main/app/official/api/RegistrationBoardApiController.java
- src/main/java/com/main/app/official/api/SermonsBoardApiController.java
- src/main/java/com/main/app/official/api/ChildrenBoardApiController.java
- src/main/java/com/main/app/official/api/YouthBoardApiController.java
- src/main/java/com/main/app/official/api/MissionBoardApiController.java
- src/main/java/com/main/app/official/api/OfficialQnaBoardApiController.java

공통점:

- 모두 AbstractBoardController를 상속하고
- BoardContext만 바꿔서 각 게시판 타입에 연결합니다.

### 2-4. 서비스/매퍼

- src/main/java/com/main/app/official/about/\*
- src/main/java/com/main/app/official/worship/\*
- src/main/java/com/main/app/official/support/\*

실제 게시판 CRUD는 official 하위가 아니라 common의 BoardService/BoardMapper에서 처리됩니다.

## 3. 프론트엔드 핵심 파일

### 3-1. 라우팅

- frontend/src/router/OfficialRoutes.tsx

분석 포인트:

- about, worship, ministries, news, support 하위 라우트 전체 정의
- 일부 경로는 레거시 호환용 별칭 경로를 같이 유지

### 3-2. 페이지 구조

- frontend/src/pages/official/index/OfficialIndexPage.tsx
- frontend/src/pages/official/about/\*.tsx
- frontend/src/pages/official/worship/\*.tsx
- frontend/src/pages/official/ministries/\*.tsx
- frontend/src/pages/official/news/\*.tsx
- frontend/src/pages/official/support/\*.tsx

### 3-3. 게시판 공용 컴포넌트

- frontend/src/pages/official/shared/OfficialBoardListPage.tsx
- frontend/src/pages/official/shared/OfficialBoardWritePage.tsx
- frontend/src/pages/official/shared/OfficialBoardViewPage.tsx

QnA 포함 대부분 게시판이 이 3개를 재사용합니다.

## 4. 동작 흐름 예시 (announcement 기준)

1. 사용자가 /news/announcement 진입
2. OfficialRoutes에서 AnnouncementPage 렌더링
3. 페이지에서 boardApi 호출
4. 백엔드 AnnouncementBoardApiController 진입
5. AbstractBoardController -> BoardServiceImpl -> BoardMapper.xml 순으로 처리
6. 결과를 ApiResponse로 반환
7. 프론트가 목록/상세/작성 화면에 반영

## 5. 유지보수 포인트

1. 신규 게시판 추가 시

- 백엔드: ApiController 1개 + BoardContext 매핑
- 프론트: 라우트 3개(list/view/write) + shared 컴포넌트 재사용

2. 레거시 경로 정리 전 확인

- OfficialRoutes의 별칭 경로 사용 여부 체크 후 제거

3. support 하위 TODO 스텁 구분

- SupportService/Mapper가 TODO여도 QnA CRUD 자체는 common 게시판 엔진으로 동작 가능

## 6. API 엔드포인트 표 (Official)

| 영역          | 백엔드 베이스 경로       | 주요 메서드                                         | 용도                    |
| ------------- | ------------------------ | --------------------------------------------------- | ----------------------- |
| 메뉴          | /api/menu                | GET /hierarchical, /top, /path, /top-menu           | 상단/사이드 메뉴 데이터 |
| About         | /api/official/about      | GET /pages                                          | 교회소개 페이지 메타    |
| Worship       | /api/official/worship    | GET /pages                                          | 예배 섹션 메타          |
| Ministries    | /api/official/ministries | GET /pages                                          | 사역 섹션 메타          |
| News          | /api/official/news       | GET /pages                                          | 소식 섹션 메타          |
| Support       | /api/official/support    | GET /pages                                          | 지원 섹션 메타          |
| 게시판-공지   | /api/news/announcement   | GET /, /view, /write, POST /write, /update, /delete | 공지 CRUD               |
| 게시판-주보   | /api/news/bulletin       | GET /, /view, /write, POST /write, /update, /delete | 주보 CRUD               |
| 게시판-새가족 | /api/news/registration   | GET /, /view, /write, POST /write, /update, /delete | 새가족 등록 CRUD        |
| 게시판-설교   | /api/worship/sermons     | GET /, /view, /write, POST /write, /update, /delete | 설교 CRUD               |
| 게시판-어린이 | /api/ministries/children | GET /, /view, /write, POST /write, /update, /delete | 어린이사역 CRUD         |
| 게시판-청년   | /api/ministries/youth    | GET /, /view, /write, POST /write, /update, /delete | 청년사역 CRUD           |
| 게시판-선교   | /api/ministries/mission  | GET /, /view, /write, POST /write, /update, /delete | 선교사역 CRUD           |
| 게시판-QnA    | /api/support/qna         | GET /, /view, /write, POST /write, /update, /delete | 문의사항 CRUD           |

## 7. 프론트 호출 매핑표 (Official)

| 화면/라우트                     | 프론트 파일                                          | API 모듈/함수                                   | 실제 호출 경로                                       |
| ------------------------------- | ---------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| /worship/time 등                | frontend/src/pages/official/worship/\*.tsx           | worshipApi.getPages                             | /api/official/worship/pages                          |
| /news/\*                        | frontend/src/pages/official/news/\*.tsx              | newsApi.getPages                                | /api/official/news/pages                             |
| /support/location, /support/faq | frontend/src/pages/official/support/\*.tsx           | support 계열 페이지 메타 API                    | /api/official/support/pages                          |
| /support/qna                    | frontend/src/pages/official/support/QnaPage.tsx      | boardApi.getBoardList                           | /api/support/qna                                     |
| /support/qna/view               | frontend/src/pages/official/support/QnaViewPage.tsx  | boardApi.getBoardView, voteComment, saveComment | /api/support/qna/view, /comment/vote, /comment/write |
| /support/qna/write              | frontend/src/pages/official/support/QnaWritePage.tsx | boardApi.saveBoard, updateBoard                 | /api/support/qna/write, /update                      |
| 공통 메뉴                       | frontend/src/layouts/Header.tsx, SubmenuLayout.tsx   | menuApi.\* + useMenu                            | /api/menu/\*                                         |

## 8. 실전 추적: 메뉴 클릭 후 /about/pastor 화면 호출 흐름

아래는 사용자가 상단 메뉴에서 목회자소개를 클릭했을 때의 실제 실행 흐름입니다.

### 8-1. 메뉴 데이터 준비 단계

1. DB 메뉴 기준값

- src/main/resources/sql/erp_menu_seed.sql
- M_MAIN_01_01 행의 path가 /about/pastor

2. 메뉴 조회 SQL 실행

- src/main/resources/mapper/common/MenuMapper.xml 의 getMenuList
- sys_menu_mgt 테이블에서 M_MAIN% (official) 메뉴를 조회

3. 메뉴 계층 구성

- src/main/java/com/main/app/common/service/impl/MenuServiceImpl.java
- 상위/하위 메뉴 트리를 구성하고 정렬

4. 메뉴 API 노출

- src/main/java/com/main/app/official/api/MenuApiController.java
- /api/menu/hierarchical?systemType=official 호출 가능 상태가 됨

### 8-2. 클릭 시점 (React 기준)

1. 메뉴 렌더링

- frontend/src/layouts/Header.tsx
- useMenu()의 menuList를 기반으로 Link를 생성
- 목회자소개 항목 Link의 to 값은 /about/pastor

2. 라우터 매칭

- frontend/src/router/OfficialRoutes.tsx
- path about 하위의 pastor 라우트가 매칭됨

3. 레이아웃 렌더링

- frontend/src/layouts/MainLayout.tsx
- 하위에서 frontend/src/layouts/SubmenuLayout.tsx 실행

4. 페이지 컴포넌트 렌더링

- frontend/src/pages/official/about/PastorPage.tsx
- 현재 구현은 정적 JSX를 바로 렌더링

5. 공통 메뉴 상태 갱신

- frontend/src/hooks/useMenu.ts
- 현재 URL /about/pastor 기준으로 currentTopMenu/currentSubMenus 활성화
- Breadcrumb/Sidebar가 같은 기준으로 표시됨

정리하면, 클릭 후 최종 화면은 PastorPage.tsx가 직접 렌더링합니다.

### 8-3. 서버 직접 URL 접근 시(SSR 경로 존재 여부)

브라우저 새로고침 또는 서버 템플릿 경로를 직접 탈 경우 아래 컨트롤러가 관여할 수 있습니다.

1. src/main/java/com/main/app/official/about/AboutController.java

- GET /about/pastor -> 템플릿 official/about/pastor 반환

2. src/main/java/com/main/app/common/exception/GlobalControllerAdvice.java

- 모델에 submenu/currentTopMenu/currentSubMenus를 주입

즉, 이 프로젝트는 현재 React 경로와 템플릿 경로가 병행 가능한 전환 상태입니다.

## 9. /about/pastor 기준 사용 파일 판별표

| 파일                                                                | 실제 사용 여부 | 판단 근거                                             |
| ------------------------------------------------------------------- | -------------- | ----------------------------------------------------- |
| frontend/src/layouts/Header.tsx                                     | 사용           | 메뉴 클릭 이벤트와 Link 생성 담당                     |
| frontend/src/hooks/useMenu.ts                                       | 사용           | 메뉴 API 조회, 현재 경로 활성화 계산                  |
| frontend/src/router/OfficialRoutes.tsx                              | 사용           | /about/pastor 라우트 매칭                             |
| frontend/src/layouts/SubmenuLayout.tsx                              | 사용           | hero/breadcrumb/sidebar 공통 레이아웃                 |
| frontend/src/pages/official/about/PastorPage.tsx                    | 사용           | 최종 화면 컴포넌트                                    |
| frontend/src/api/menuApi.ts                                         | 사용           | /api/menu/hierarchical 등 호출                        |
| src/main/java/com/main/app/official/api/MenuApiController.java      | 사용           | 메뉴 API 엔드포인트                                   |
| src/main/java/com/main/app/common/service/impl/MenuServiceImpl.java | 사용           | 메뉴 트리 구성 로직                                   |
| src/main/resources/mapper/common/MenuMapper.xml                     | 사용           | sys_menu_mgt 메뉴 SQL                                 |
| src/main/resources/sql/erp_menu_seed.sql                            | 간접 사용      | 초기 데이터 시드로 유효, 런타임 직접 호출 파일은 아님 |
| src/main/java/com/main/app/official/about/AboutController.java      | 조건부 사용    | 서버 템플릿 라우팅 경로에서만 직접 사용               |
| src/main/resources/templates/official/about/pastor.html             | 조건부 사용    | SSR 템플릿 경로일 때만 사용                           |

### 빠른 판별 팁

1. React 컴포넌트로만 화면이 바뀌면

- PastorPage.tsx, OfficialRoutes.tsx, Header.tsx, useMenu.ts 중심 경로를 본다.

2. 서버 로그에 AboutController가 찍히면

- 템플릿 경로까지 같이 타고 있으므로 templates/official/about/pastor.html도 점검한다.

3. 메뉴명이 안 보이면

- sys_menu_mgt 데이터(M_MAIN_01_01 path)와 MenuMapper.xml 필터(M_MAIN%)를 먼저 확인한다.

문서 버전: 1.0
작성일: 2026-05-06
