# Community 도메인 소스 책임 맵

이 문서는 community 영역 분석을 빠르게 진행하기 위한 책임 중심 가이드입니다.

## 1. 역할 요약

Community 영역은 커뮤니티 기능을 담당합니다.

- group: 소그룹
- facilities: 시설
- saint: 성도지원
- world: 세계소식
- support: 지원 게시판

구조 특징:

- 메뉴/레이아웃은 official과 동일 패턴 재사용
- 게시판은 community 전용 API + 공통 Board 엔진 혼합 사용
- 레거시 redirect 경로가 일부 남아 있음

## 2. 백엔드 핵심 파일

### 2-1. 진입/리다이렉트

- src/main/java/com/main/app/community/controller/CommunityIndexController.java
- src/main/java/com/main/app/community/controller/CommunityLegacyRedirectController.java

### 2-2. 카테고리별 API

- src/main/java/com/main/app/community/api/GroupApiController.java
- src/main/java/com/main/app/community/api/FacilitiesApiController.java
- src/main/java/com/main/app/community/api/SaintApiController.java
- src/main/java/com/main/app/community/api/WorldApiController.java
- src/main/java/com/main/app/community/api/CommunityBoardApiController.java
- src/main/java/com/main/app/community/api/CommunityQnaBoardApiController.java

### 2-3. 카테고리별 서비스/매퍼

- src/main/java/com/main/app/community/group/\*
- src/main/java/com/main/app/community/facilities/\*
- src/main/java/com/main/app/community/saint/\*
- src/main/java/com/main/app/community/world/\*

### 2-4. 혼동 주의 파일

- src/main/java/com/main/app/community/qna/\*
- src/main/resources/mapper/community/qna/QnaMapper.xml

해당 경로에는 스텁/미완 파일이 섞여 있습니다.
실제 운영 경로는 community api 패키지와 common 게시판 엔진 중심으로 우선 확인해야 합니다.

## 3. 프론트엔드 핵심 파일

### 3-1. 라우팅

- frontend/src/router/CommunityRoutes.tsx

하위 경로:

- /community/group/\*
- /community/facilities/\*
- /community/saint/\*
- /community/world/\*
- /community/support/\*

### 3-2. 페이지

- frontend/src/pages/community/CommunityIndexPage.tsx
- frontend/src/pages/community/group/\*.tsx
- frontend/src/pages/community/facilities/\*.tsx
- frontend/src/pages/community/saint/\*.tsx
- frontend/src/pages/community/world/\*.tsx
- frontend/src/pages/community/support/SupportBoardPage.tsx

### 3-3. 공용 컴포넌트

- frontend/src/pages/community/shared/CommunityListPage.tsx

## 4. 동작 흐름 예시 (support board)

1. /community/support/board 진입
2. CommunityRoutes에서 SupportBoardPage 렌더링
3. boardApi 또는 communityApi 계열 호출
4. 백엔드 CommunityBoardApiController 또는 CommunityQnaBoardApiController 진입
5. 공통 게시판 서비스/매퍼 수행
6. 목록/상세/댓글 데이터 응답

## 5. 유지보수 포인트

1. qna 하위 스텁 파일과 실제 운영 경로 분리

- 경로가 유사해 혼동되므로 RequestMapping과 프론트 호출 URL로 교차검증 필요

2. 레거시 redirect 사용처 점검

- 프론트 라우트와 백엔드 리다이렉트 중복 유지 여부 확인

3. 카테고리 추가 시

- CommunityRoutes와 해당 ApiController를 쌍으로 확장

## 6. API 엔드포인트 표 (Community)

| 영역       | 백엔드 베이스 경로         | 주요 메서드                                         | 용도                      |
| ---------- | -------------------------- | --------------------------------------------------- | ------------------------- |
| Group      | /api/community/group       | GET /pages, /list, /a1, /b2                         | 그룹 목록/탭 데이터       |
| Facilities | /api/community/facilities  | GET /pages, /calendar, /dining, /prayer             | 시설/기도실/식당 데이터   |
| Saint      | /api/community/saint       | GET /pages, /family, /pray, /sales, /job            | 성도 지원 데이터          |
| World      | /api/community/world       | GET /pages, /christian, /economic, /health          | 세계 소식 데이터          |
| Board      | /api/community/support     | GET /, /view, /write, POST /write, /update, /delete | 커뮤니티 지원 게시판 CRUD |
| QnA Board  | /api/community/support/qna | GET /, /view, /write, POST /write, /update, /delete | 커뮤니티 QnA CRUD         |

## 7. 프론트 호출 매핑표 (Community)

| 화면/라우트              | 프론트 파일                                               | API 모듈/함수                                                | 실제 호출 경로                                       |
| ------------------------ | --------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| /community/group/\*      | frontend/src/pages/community/group/\*.tsx                 | communityApi.group.getList/getA1/getB2                       | /api/community/group/list, /a1, /b2                  |
| /community/facilities/\* | frontend/src/pages/community/facilities/\*.tsx            | communityApi.facilities.getCalendar/getDining/getPrayer      | /api/community/facilities/calendar, /dining, /prayer |
| /community/saint/\*      | frontend/src/pages/community/saint/\*.tsx                 | communityApi.saint.getFamily/getPray/getSales/getJob         | /api/community/saint/family, /pray, /sales, /job     |
| /community/world/\*      | frontend/src/pages/community/world/\*.tsx                 | communityApi.world.getChristian/getEconomic/getHealth        | /api/community/world/christian, /economic, /health   |
| /community/support/board | frontend/src/pages/community/support/SupportBoardPage.tsx | boardApi 또는 community board API                            | /api/community/support\*                             |
| 커뮤니티 메뉴 계산       | frontend/src/layouts/SubmenuLayout.tsx                    | useMenu + menuApi.getHierarchicalMenus(systemType=community) | /api/menu/hierarchical                               |

문서 버전: 1.0
작성일: 2026-05-06
