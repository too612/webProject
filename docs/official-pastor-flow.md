# official > about > pastor 흐름 정리

기준 메뉴

- DB 메뉴: src/main/resources/sql/erp_menu_seed.sql:38
- 값: M_MAIN_01_01 목회자소개 -> /about/pastor

---

## 1) 클릭 시 흐름 (React -> Java -> XML)

### 1-1. React 진입

1. 상단 메뉴/서브메뉴 클릭

- frontend/src/layouts/Header.tsx:216
- frontend/src/layouts/SubmenuLayout.tsx:19
- frontend/src/layouts/Sidebar.tsx:24

2. 라우팅 매칭

- frontend/src/router/OfficialRoutes.tsx:53 (about)
- frontend/src/router/OfficialRoutes.tsx:56 (pastor -> PastorPage)

3. 페이지 마운트 후 조회 트리거

- frontend/src/pages/official/about/PastorPage.tsx:24 (loadProfile())
- frontend/src/hooks/usePastorProfile.ts:13 (aboutApi.getPastorProfile())
- frontend/src/api/aboutApi.ts:47 (getPastorProfile)
- frontend/src/api/aboutApi.ts:49 (GET /official/about/pastor)

### 1-2. Java 진입

1. 컨트롤러

- src/main/java/com/main/app/official/about/pastor/PastorController.java:10 (@RequestMapping /api/official/about/pastor)
- src/main/java/com/main/app/official/about/pastor/PastorController.java:16 (@GetMapping)

2. 서비스

- src/main/java/com/main/app/official/about/pastor/PastorService.java:16 (getPastorProfile)

3. 매퍼 인터페이스

- src/main/java/com/main/app/official/about/pastor/PastorMapper.java:11 (selectPastorProfile)

### 1-3. XML 실행

- src/main/resources/mapper/official/about/pastor/PastorMapper.xml:7 (select id="selectPastorProfile")

요약

- 메뉴 클릭 -> /about/pastor 라우팅 -> PastorPage 마운트 -> GET /api/official/about/pastor -> PastorMapper.xml select

---

## 2) CRUD 시 흐름 (React -> Java -> XML)

### C: 등록 (Create)

React

- frontend/src/pages/official/about/PastorPage.tsx:98 (handleSave)
- frontend/src/pages/official/about/PastorPage.tsx:106 (saveProfile(form))
- frontend/src/hooks/usePastorProfile.ts:30 (aboutApi.createPastorProfile)
- frontend/src/api/aboutApi.ts:56 (createPastorProfile)
- frontend/src/api/aboutApi.ts:58 (POST /official/about/pastor)

Java

- src/main/java/com/main/app/official/about/pastor/PastorController.java:21 (@PostMapping)
- src/main/java/com/main/app/official/about/pastor/PastorService.java:21 (createPastorProfile)
- src/main/java/com/main/app/official/about/pastor/PastorMapper.java:13 (insertPastorProfile)

XML

- src/main/resources/mapper/official/about/pastor/PastorMapper.xml:26 (insert id="insertPastorProfile")

### R: 조회 (Read)

React

- frontend/src/pages/official/about/PastorPage.tsx:24 (loadProfile)
- frontend/src/hooks/usePastorProfile.ts:13 (aboutApi.getPastorProfile)
- frontend/src/api/aboutApi.ts:47 (getPastorProfile)
- frontend/src/api/aboutApi.ts:49 (GET /official/about/pastor)

Java

- src/main/java/com/main/app/official/about/pastor/PastorController.java:16 (@GetMapping)
- src/main/java/com/main/app/official/about/pastor/PastorService.java:16 (getPastorProfile)
- src/main/java/com/main/app/official/about/pastor/PastorMapper.java:11 (selectPastorProfile)

XML

- src/main/resources/mapper/official/about/pastor/PastorMapper.xml:7 (select id="selectPastorProfile")

### U: 수정 (Update)

React

- frontend/src/pages/official/about/PastorPage.tsx:98 (handleSave)
- frontend/src/hooks/usePastorProfile.ts:28 (aboutApi.updatePastorProfile)
- frontend/src/api/aboutApi.ts:64 (updatePastorProfile)
- frontend/src/api/aboutApi.ts:66 (PUT /official/about/pastor/${corpId})

Java

- src/main/java/com/main/app/official/about/pastor/PastorController.java:27 (@PutMapping /{corpId})
- src/main/java/com/main/app/official/about/pastor/PastorService.java:51 (updatePastorProfile)
- src/main/java/com/main/app/official/about/pastor/PastorMapper.java:15 (updatePastorProfile)

XML

- src/main/resources/mapper/official/about/pastor/PastorMapper.xml:64 (update id="updatePastorProfile")

### D: 삭제 (Delete)

React

- frontend/src/pages/official/about/PastorPage.tsx:114 (handleDelete)
- frontend/src/pages/official/about/PastorPage.tsx:123 (removeProfile)
- frontend/src/hooks/usePastorProfile.ts:51 (aboutApi.deletePastorProfile)
- frontend/src/api/aboutApi.ts:72 (deletePastorProfile)
- frontend/src/api/aboutApi.ts:74 (DELETE /official/about/pastor/${corpId})

Java

- src/main/java/com/main/app/official/about/pastor/PastorController.java:34 (@DeleteMapping /{corpId})
- src/main/java/com/main/app/official/about/pastor/PastorService.java:66 (deletePastorProfile)
- src/main/java/com/main/app/official/about/pastor/PastorMapper.java:17 (softDeletePastorProfile)

XML

- src/main/resources/mapper/official/about/pastor/PastorMapper.xml:83 (update id="softDeletePastorProfile")
