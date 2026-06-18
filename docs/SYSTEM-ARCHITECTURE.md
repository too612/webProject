# 시스템 아키텍처 기준 문서

> 이 파일이 유일한 구조 기준 문서다.  
> 기존 `BACKEND-REFACTORING-ROADMAP.md`, `frontend-refactoring-checklist.md`는 이 파일로 통합·대체되었다.

---

## 1. 프로젝트 개요

| 항목        | 내용                                                      |
| ----------- | --------------------------------------------------------- |
| 백엔드      | Spring Boot (Java), MyBatis, Gradle                       |
| 프런트엔드  | React + TypeScript (Vite), Tailwind CSS                   |
| 라우팅 기준 | DB `erp_menu_seed.sql`의 메뉴 경로를 최우선 기준으로 사용 |

---

## 2. 도메인 구성 (공통 구조)

백엔드(`src/main/java/com/main/app/`)와 프런트엔드(`frontend/src/`)는 **동일한 대분류 도메인**으로 구성된다.

| 도메인      | 설명                                                                    |
| ----------- | ----------------------------------------------------------------------- |
| `official`  | 공식 교회 정보 (소개, 예배, 소식, 사역부서, 지원)                       |
| `community` | 공동체 (소그룹, 시설, 성도, 세계선교)                                   |
| `erp`       | 업무관리 (인사, 설교, 회계, 훈련, 사역, 행사, 시설, 소통, 관리자, 통계) |
| `mypage`    | 마이페이지 (프로필, 비밀번호, 활동, 문의, 알림, 탈퇴)                   |
| `system`    | 시스템 관리 (사용자, 설정, 로그, 백업)                                  |
| `common`    | 인프라·공통 레이어 (인증, 메뉴, 기관정보, API 기반, 챗봇 등)            |

---

## 3. 백엔드 구조

### 3-1. 패키지 트리

src/main/java/com/main/app/
├── AppApplication.java
├── common/
│ ├── advice/ # 전역 예외 처리
│ ├── auth/ # 인증/인가
│ ├── comment/ # 공통 댓글
│ ├── config/ # Spring 설정
│ ├── corp/ # 기관 기본정보 (Footer 등 공통 표시값)
│ ├── dto/ # 공통 응답 DTO
│ ├── exception/ # 커스텀 예외 클래스
│ ├── file/ # 공통 파일 관리
│ ├── menu/ # 메뉴 조회 로직
│ └── util/ # 유틸리티
├── official/
│ ├── about/ # 소개 (pastor / history / beliefs / vision)
│ ├── index/ # 메인 페이지
│ ├── ministries/ # 사역부서 (children / youth / mission)
│ ├── news/ # 소식 (announcement / bulletin / registration / event)
│ ├── support/ # 지원 (qna / faq / location)
│ └── worship/ # 예배 (time / live / sermons)
├── community/
│ ├── facilities/
│ ├── group/
│ ├── index/
│ ├── saint/
│ └── world/
├── erp/
│ ├── account/
│ ├── admin/
│ ├── comm/
│ ├── event/
│ ├── facility/
│ ├── humen/ # 인사 (district / manager / newcomer / change)
│ ├── index/
│ ├── ministry/
│ ├── sermon/
│ ├── stats/
│ └── training/
├── mypage/
│ ├── index/
│ └── user/ # profile / password / activity / inquiry / notifications / withdraw
└── system/
├── backup/
├── config/
├── index/
├── log/
└── user/

text

### 3-2. 기능 단위(feature) 파일 구성 규칙

각 기능 폴더는 아래 4종 파일을 기본 세트로 가진다.
{Domain}/
├── {Feature}Controller.java
├── {Feature}Service.java
├── {Feature}Mapper.java
└── dto/
├── {Feature}Dto.java # 응답 DTO
└── {Feature}Request.java # 요청 DTO

text

**규칙**

- 기능이 단순하면 `dto/` 하위 폴더를 억지로 만들지 않는다.
- 기능이 커지면 `about/pastor`처럼 중분류 하위 기능 폴더를 추가한다.
- `controller/`, `service/`, `mapper/` 같은 역할 기반 하위 폴더는 **만들지 않는다**.

### 3-3. MyBatis XML 위치 규칙

src/main/resources/mapper/
├── common/
├── official/
│ ├── about/
│ ├── ministries/
│ ├── news/
│ ├── support/
│ └── worship/
├── community/
├── erp/
├── mypage/
└── system/

text

- XML 파일명: `{Feature}Mapper.xml`
- XML `namespace`는 Java Mapper 인터페이스 전체 경로와 **1:1**로 일치해야 한다.  
  예: `namespace="com.main.app.official.about.pastor.PastorMapper"`

### 3-4. CRUD 기준 패턴 (official/about/pastor 기준)

**엔드포인트**

| 메서드 | 경로                                                    | 설명        |
| ------ | ------------------------------------------------------- | ----------- |
| GET    | `/api/official/about/pastor`                            | 목록 조회   |
| POST   | `/api/official/about/pastor`                            | 등록        |
| PUT    | `/api/official/about/pastor/{id}`                       | 수정        |
| DELETE | `/api/official/about/pastor/{id}?updatedBy=&updatedIp=` | 소프트 삭제 |

**Service 규칙**

- 조회: `@Transactional(readOnly = true)`
- 등록·수정·삭제: `@Transactional`
- **Service 메서드명은 `FRONT-FULLSTACK-SPEC.md`의 표준 규칙(`getInfo`, `setCreate`, `setUpdate`, `delRemove`)을 준수한다.**

**삭제 정책**

- 물리 삭제 금지
- `is_deleted = TRUE`, `is_active = FALSE` 소프트 삭제만 허용

### 3-5. 레거시 삭제 기준

아래 조건을 **모두** 만족할 때만 레거시 파일을 삭제한다.

1. 새 경로 빌드 통과
2. 옛 경로에 대한 import/namespace 참조 0건
3. 옛 구조를 대표하는 상위 셸 파일(도메인명 그대로의 Controller/Service/Mapper)이 0건

삭제 대상 예시

- 상위 셸: `official/<domain>/<Domain>Controller.java`
- 브리지: `official/<domain>/controller/<Domain>PageMetaController.java`
- 역할 기반 빈 폴더: `<feature>/controller/`, `<feature>/service/`, `<feature>/mapper/`

---

## 4. 프런트엔드 구조

### 4-1. 폴더 트리

frontend/src/
├── main.tsx
├── App.tsx
├── styles/
├── layouts/ # 전역 레이아웃 뼈대
│ ├── MainLayout.tsx
│ ├── SubmenuLayout.tsx
│ ├── Header.tsx
│ ├── Footer.tsx
│ ├── Sidebar.tsx
│ ├── Breadcrumb.tsx
│ └── heroConfig.ts
├── router/ # 라우팅 가드 및 도메인별 라우트
│ ├── index.tsx
│ ├── ProtectedRoute.tsx
│ ├── AuthRoutes.tsx
│ ├── OfficialRoutes.tsx
│ ├── CommunityRoutes.tsx
│ ├── ErpRoutes.tsx
│ ├── MypageRoutes.tsx
│ └── SystemRoutes.tsx
├── common/ # 인프라·공통 레이어
│ ├── api/ # axios 인스턴스 등 HTTP 인프라
│ ├── auth/ # 인증 도메인 (authApi / authStore / authHook / authModel / authTypes / login / register)
│ ├── corp/ # 기관정보 도메인 (Footer 주소 등 공통 표시값)
│ ├── board/ # 게시판 공통 타입 (deprecated: 도메인별 Model로 이전 중)
│ ├── chatbot/ # 챗봇 컴포넌트
│ ├── comment/ # 공통 댓글 컴포넌트
│ ├── editor/ # 리치텍스트 에디터 (editor / editorViewer / editorHook / editorApi / editorModel)
│ ├── attachment/ # 파일첨부 공통 모듈 (attachment / attachmentHook / attachmentApi / attachmentModel)
│ ├── grid/ # DataGrid 공통 모듈 (grid / gridModel / gridHook) - AG Grid 기반
│ ├── lib/ # 범용 유틸
│ └── menu/ # 메뉴 도메인 (menuApi / menuHook / menuModel / menuStore / menu.types)
├── official/
├── community/
├── erp/
├── mypage/
└── system/

text

### 4-2. 기능 단위(feature) 파일 구성 규칙

각 기능 폴더는 아래 4파일 체계를 기본 세트로 가진다.
{domain}/{feature}/
├── {feature}List.tsx # 목록 페이지 (화면 렌더링, Hook 호출)
├── {feature}View.tsx # 상세 페이지
├── {feature}Write.tsx # 작성/수정 페이지
├── {feature}Hook.ts # 도메인 상태·유스케이스 흐름
├── {feature}Api.ts # HTTP 호출 캡슐화
└── {feature}Model.ts # 타입·상수 계약 정의

text

기준 구현체: `frontend/src/official/about/pastor/`

### 4-3. 각 파일 역할 및 금지 사항

| 파일         | 역할                                                       | 금지                                |
| ------------ | ---------------------------------------------------------- | ----------------------------------- |
| `*List.tsx`  | 화면 렌더링, 이벤트 처리, 입력 상태 관리, Hook 호출        | HTTP 직접 호출, 엔드포인트 하드코딩 |
| `*View.tsx`  | 상세 화면 렌더링, 댓글/첨부파일 표시                       | HTTP 직접 호출                      |
| `*Write.tsx` | 작성/수정 폼 렌더링, 에디터/첨부파일 연동                  | HTTP 직접 호출                      |
| `*Hook.ts`   | 도메인 상태(`loading/error/data`) 보유, Api 오케스트레이션 | JSX 반환                            |
| `*Api.ts`    | HTTP 호출 캡슐화, 에러 메시지 표준화, 응답 타입 계약       | UI 상태 처리                        |
| `*Model.ts`  | 타입·상수 계약 정의                                        | API 호출, 상태 로직                 |

### 4-4. 레이아웃 계층 구조

MainLayout ← 전역 뼈대 (Header / Sidebar / Footer / Chatbot 포함)
└── SubmenuLayout ← 서브메뉴 영역 (ERP, Mypage 등 2단 네비가 필요한 도메인)

text

- `ErpLayout`, `MypageLayout` 같은 도메인 전용 Layout은 **만들지 않는다**.
- `MainLayout`의 `showChatbot` 옵션으로 도메인별 챗봇 표시 여부를 제어한다.
- `Header.tsx`는 auth 상태를 참조하더라도 레이아웃 책임이므로 `common/auth`로 이동하지 않는다.

### 4-5. common 레이어 원칙

- **auth**: 인증 유스케이스(login/register/logout/session)와 관련 상태(authStore)만 포함.  
  `ProtectedRoute`, `Header`는 인증 정보를 사용해도 책임이 다르므로 각자의 위치 유지.
- **corp**: 기관 기본정보를 읽기 전용으로 조회한다. Footer 같은 전역 레이아웃은 이 값을 소비만 한다.
- **menu**: 메뉴 조회·상태 관리를 `menuApi / menuHook / menuModel / menuStore`로 분리.  
  중앙 공통 `api/menuApi.ts`는 제거하고 `common/menu/` 단일 경로만 사용.
- **board**: 메뉴별 로컬 `*Api.ts`로 흡수한다. 중앙 `boardApi.ts`는 제거.  
  신규 게시판 메뉴는 반드시 로컬 Api 우선으로 작성한다.
- **chatbot**: `common/chatbot/`이 단일 소스. `components/chatbot`과 같은 중복 경로를 만들지 않는다.
- **editor**: `common/editor/`이 단일 소스. Tiptap v2 기반 리치텍스트 에디터.  
  `onImageUpload` Props로 이미지 서버 업로드 지원 (Base64 fallback 포함).
- **attachment**: `common/attachment/`이 단일 소스. react-dropzone 기반 파일첨부 공통 모듈.  
  업로드 실행은 도메인 Api에서 담당하고, UI·상태 관리만 공통 모듈에서 제공한다.
- **grid**: `common/grid/`이 단일 소스. AG Grid 기반 DataGrid 공통 모듈.  
  4가지 운영 모드(basic / server / infinite / client) 지원.

### 4-6. 라우팅 가드 위치

- `ProtectedRoute.tsx`는 `router/` 폴더에 위치한다 (라우팅 가드 책임).
- 인증 관련 페이지 라우트는 `router/AuthRoutes.tsx`로 분리한다.

---

## 5. API 경로 명명 규칙

/api/{domain}/{subdomain}/{feature}

text

예시

| 도메인          | 경로                              |
| --------------- | --------------------------------- |
| official/about  | `/api/official/about/pastor`      |
| official/news   | `/api/official/news/announcement` |
| community/group | `/api/community/group`            |
| erp/humen       | `/api/erp/humen/district`         |
| mypage/user     | `/api/mypage/user/profile`        |
| system/user     | `/api/system/user`                |

- 경로는 DB 메뉴 경로(`erp_menu_seed.sql`)를 기준으로 확정한다.
- 프런트엔드 라우트 경로와 백엔드 API 경로는 도메인 단위에서 동일한 계층 구조를 유지한다.

---

## 6. 현재 구현 상태

| 도메인                | 백엔드        | 프런트엔드    | 비고                                                                                     |
| --------------------- | ------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `common`              | 완료          | 완료          | auth/menu/chatbot/editor/attachment/grid 응집 완료                                       |
| `official/about`      | 완료          | 완료          | pastor 기준 패턴 확정 · 프로필 이미지 첨부파일 모듈 연결                                 |
| `official/worship`    | 완료          | 완료          | time / live / sermons (sermons List/View/Write 분할 완료)                                |
| `official/news`       | 완료          | 완료          | announcement / bulletin / registration / event                                           |
| `official/ministries` | 완료          | 완료          | children / youth / mission                                                               |
| `official/support`    | 완료          | 완료          | 평면화 완료                                                                              |
| `mypage`              | 완료          | 완료          | user 6개 메뉴                                                                            |
| `system`              | 완료          | 완료          | user / config / log / backup                                                             |
| `community`           | 완료          | 완료          | group / facilities / saint / world                                                       |
| `erp`                 | **진행 예정** | **진행 예정** | humen / sermon / account / training / ministry / event / facility / comm / admin / stats |

---

## 7. 신규 기능 추가 시 체크리스트

### 백엔드

- [ ] DB 메뉴 경로(`erp_menu_seed.sql`)에서 도메인·기능 경로 확인
- [ ] `{Domain}/{feature}/` 하위에 Controller / Service / Mapper / dto 4파일 세트 생성
- [ ] Service 메서드명은 `FRONT-FULLSTACK-SPEC.md`의 표준 규칙(`getInfo`, `setCreate`, `setUpdate`, `delRemove`) 준수
- [ ] XML 파일을 `src/main/resources/mapper/{domain}/{subdomain}/` 에 생성
- [ ] XML `namespace`를 Java Mapper 인터페이스 경로와 1:1 일치
- [ ] 역할 기반 하위 폴더(`controller/`, `service/` 등) 생성 금지
- [ ] 빌드 통과 확인 (`gradlew compileJava`)
- [ ] 레거시 경로 참조 0건 확인 후 레거시 파일 삭제

### 프런트엔드

- [ ] `{domain}/{feature}/` 하위에 List / View / Write / Hook / Api / Model 6파일 세트 생성
- [ ] `*Api.ts`에 HTTP 호출 캡슐화 (엔드포인트 하드코딩 금지)
- [ ] `*List.tsx` / `*View.tsx` / `*Write.tsx`에서 HTTP 직접 호출 금지
- [ ] `*Hook.ts`에서 JSX 반환 금지
- [ ] 신규 라우트를 해당 도메인 `*Routes.tsx`에 등록
- [ ] 메뉴 연결은 `common/menu/menuModel.ts` 상수 또는 DB 메뉴 경로 기준
- [ ] 도메인 전용 Layout 클래스 생성 금지 (MainLayout + SubmenuLayout 조합 사용)
- [ ] 빌드 통과 확인 (`npm run build`)

---

## 8. 불변 원칙 (항상 유지)

1. **DB 메뉴 경로 우선** — 구조 결정의 최우선 기준은 `erp_menu_seed.sql`.
2. **단위 순차 진행** — 한 번에 전 도메인을 바꾸지 않는다. 중분류 단위 하나씩 완료 후 다음으로 이동.
3. **역할 기반 폴더 금지** — `controller/`, `service/`, `mapper/` 하위 폴더를 만들지 않는다.
4. **도메인 전용 Layout 금지** — 프런트엔드에서 도메인 전용 Layout 파일을 만들지 않는다.
5. **중앙 공통 API 금지** — 신규 게시판/메뉴 기능은 로컬 `*Api.ts` 우선, 중복 확인 후에만 공통화.
6. **소프트 삭제 강제** — 물리 삭제 대신 `is_deleted = TRUE`, `is_active = FALSE`.
7. **레거시 삭제 조건 준수** — 빌드 통과 + 참조 0건 동시 만족 시에만 삭제.
8. **빈 폴더 정리** — 파일이 없는 구조 잔재 폴더는 삭제 대상이다.

---

## 9. Hero 영역 운영 가이드 (메뉴 성격별)

### 9-1. 기본 원칙

- Hero는 "브랜드/메시지 전달"이 목표일 때 강화하고, "업무 처리"가 목표일 때 축소/제거한다.
- 같은 도메인 안에서도 상위 랜딩(소개)과 하위 실행 화면(목록/폼/관리)은 분리 운영한다.
- 모바일은 첫 화면 진입 속도를 우선해 Hero 높이를 줄이거나 단순화한다.

### 9-2. 도메인별 권장 강도

| 도메인      | 화면 성격           | Hero 강도 | 권장 방식                                   |
| ----------- | ------------------- | --------- | ------------------------------------------- |
| `official`  | 대외 소개/브랜딩    | 높음      | 메뉴별 대표 이미지 + 짧은 카피 + CTA 1~2개  |
| `community` | 소식/활동 전달      | 중간      | 이미지 또는 아이콘형 Hero, 정보 카드와 연계 |
| `mypage`    | 개인 작업 중심      | 낮음      | 얇은 타이틀 바 또는 미니 배너               |
| `system`    | 운영/설정 중심      | 없음~낮음 | Hero 제거, 제목/설명 1줄만 유지             |
| `erp`       | 업무 처리/입력 중심 | 없음      | Hero 제거, 필터/테이블/폼 가시성 최우선     |

### 9-3. 화면 레벨별 적용 기준

| 화면 레벨    | 권장              | 이유                                      |
| ------------ | ----------------- | ----------------------------------------- |
| 메인/랜딩    | Hero 사용         | 첫 인상, 브랜드 톤, 빠른 진입 CTA 제공    |
| 섹션 인덱스  | 축소 Hero 사용    | 맥락 제공은 유지하되 콘텐츠 노출 우선     |
| 목록/검색/폼 | Hero 미사용       | 세로 공간 확보, 작업 효율, 스캔 속도 개선 |
| 상세 조회    | 필요 시 미니 Hero | 커버 이미지가 의미 있을 때만 제한적 사용  |

### 9-4. Hero를 사용할 때의 디자인 기준

- 텍스트 가독성: 이미지 위 오버레이를 사용해 텍스트 대비를 확보한다.
- 콘텐츠 밀도: 제목 1개, 보조 문구 1~2줄, CTA 1~2개를 기본 한도로 둔다.
- 높이 가이드: Desktop > Tablet > Mobile 순으로 단계적 축소를 적용한다.
- 일관성: 색조, 버튼 스타일, 타이포는 브랜드 규칙을 유지하고 이미지만 메뉴별로 변경한다.
- 상호작용: 슬라이더를 사용할 경우 자동재생 + 수동 제어(버튼/인디케이터/스와이프)를 함께 제공한다.

### 9-5. 성능/접근성 운영 체크

- 이미지 최적화(WebP/적정 해상도/용량 제한)와 지연 로딩을 기본 적용한다.
- 배너 이미지 로딩 실패 시 기본 플레이스홀더를 제공한다.
- 배너 조작 버튼은 키보드 접근 가능해야 하며, `aria-label`을 제공한다.
- 자동 전환 슬라이더는 사용자가 직접 제어할 수 있어야 한다.

### 9-6. 본 프로젝트 적용 결론

- `official`: 현재처럼 Hero/슬라이더 유지 가능. 메뉴 성격에 맞는 이미지 교체 운영 권장.
- `community`: 중간 강도 Hero 또는 카드형 대표 비주얼 권장.
- `mypage`, `system`: Hero 축소(또는 제거) 권장.
- `erp`: Hero 비노출 권장. 상단 공간은 검색/필터/액션 버튼에 할당.

### 9-7. 메뉴별 Hero 운영표 (완성형)

아래 표는 "이미지 유무와 무관하게" 동작하는 기본 운영안이다. 이미지가 없으면 기본 그라데이션 Hero로 자동 폴백한다.

| 도메인      | 메뉴군(예시 경로)         | Hero 노출   | 이미지 파일 규칙(권장)                      | 문구 톤          |
| ----------- | ------------------------- | ----------- | ------------------------------------------- | ---------------- |
| `official`  | `/about/*`                | 노출        | `public/img/hero/official-about.webp`       | 소개/비전 중심   |
| `official`  | `/worship/*`              | 노출        | `public/img/hero/official-worship.webp`     | 예배/설교 중심   |
| `official`  | `/ministries/*`           | 노출        | `public/img/hero/official-ministries.webp`  | 사역/섬김 중심   |
| `official`  | `/news/*`                 | 노출        | `public/img/hero/official-news.webp`        | 소식/공지 중심   |
| `official`  | `/support/*`              | 노출        | `public/img/hero/official-support.webp`     | 안내/문의 중심   |
| `community` | `/community/group/*`      | 노출        | `public/img/hero/community-group.webp`      | 모임/공동체 중심 |
| `community` | `/community/facilities/*` | 노출        | `public/img/hero/community-facilities.webp` | 시설/이용 중심   |
| `community` | `/community/saint/*`      | 노출        | `public/img/hero/community-saint.webp`      | 지원/돌봄 중심   |
| `community` | `/community/world/*`      | 노출        | `public/img/hero/community-world.webp`      | 콘텐츠/읽기 중심 |
| `mypage`    | `/mypage/*`               | 축소 노출   | 선택(없어도 무방)                           | 개인 관리 중심   |
| `system`    | `/system/*`               | 기본 비노출 | 사용 안 함                                  | 운영/설정 중심   |
| `erp`       | `/erp/*`                  | 비노출      | 사용 안 함                                  | 업무 처리 중심   |

### 9-8. 에셋이 없는 경우 운영 규칙

- 이미지 파일이 없어도 Hero는 기본 배경(그라데이션 + 오버레이)으로 렌더링되어 화면이 깨지지 않아야 한다.
- 이미지 로딩 실패 시 자동으로 이미지 레이어만 제거하고 텍스트/레이아웃은 유지한다.
- 이미지 준비 전 단계에서는 문구와 높이만 먼저 확정하고, 파일이 준비되면 경로만 연결한다.

### 9-9. 이미지 준비 스펙(권장)

- 포맷: WebP 우선 (필요 시 JPG 병행)
- 기준 해상도: 1920x540 (서브 Hero), 1920x720 (메인 랜딩)
- 용량 권장: 장당 250KB 이하(최대 400KB)
- 안전 영역: 좌측 40% 안쪽에 제목/문구 배치 기준 확보
- 명명 규칙: `{domain}-{menu-group}.webp` (예: `official-news.webp`)

---

## 10. Pastor(목회자 소개) 개선 방향

### 10-1. 운영 모드(2가지) 정의

목회자 소개는 아래 2개 모드를 모두 지원한다.

1. **단일 이미지 모드**

- 목회자 사진과 인사말이 하나의 이미지 파일로 합성된 경우 사용
- DB `com_corp.photo_path` 기준으로 이미지 렌더링
- 텍스트 소개(`introduction`)는 화면 표시에서 비활성화(또는 무시)

2. **분리 모드(텍스트 + 이미지)**

- 이미지: `com_corp.photo_path`
- 소개문: `com_corp.introduction`
- 이미지와 본문을 분리해 렌더링

### 10-2. 표시 규칙(불완전 데이터 포함)

- 단일 이미지 모드에서 `photo_path`가 없으면 기본 플레이스홀더 이미지를 표시한다.
- 분리 모드에서 `photo_path`가 없으면 기본 이미지를 표시하고, `introduction`은 정상 출력한다.
- 분리 모드에서 `introduction`이 비어 있으면 "소개문이 등록되지 않았습니다" 안내문을 표시한다.
- 모드 전환 시 기존 데이터는 삭제하지 않고, 표시 규칙만 변경한다.

### 10-3. 구현 원칙

- 권한 제어(편집/삭제 권한)는 별도 단계에서 적용한다.
- 현재 단계는 화면/업로드/표시 로직 구현에 집중한다.
- `updatedBy`, `updatedIp` 같은 감사 필드는 장기적으로 서버에서 확정하는 방향을 권장한다.

---

## 11. 공통 파일관리 체계

### 11-1. 저장소 루트 원칙

- 프로젝트 루트 기준 `data/`를 업로드 파일 루트로 사용한다. (`app.upload.path=./data/`)
- 기능별 파일은 `data/` 하위 목적 폴더로 분리한다.
  data/
  ├── photo/
  │ └── pastor/
  ├── board/
  │ ├── announcement/
  │ ├── bulletin/
  │ └── ...
  ├── temp/
  └── archive/

text

### 11-2. 경로/식별자 저장 규칙

- DB에는 서버 절대경로가 아닌 **상대경로**만 저장한다.
  - 표준 패턴: `data/{구분}/{연도}/{월일}/{메뉴명}/{난수파일명}.{확장자}`
  - 예: `data/photo/2026/0604/pastor/a8f3b1f4d9c34a71b2e1c3f44f0f0e7a.webp`
- 파일 저장 폴더 규칙은 아래를 고정한다.
  - `{구분}`: 업무 목적 분류 (예: `photo`, `board`, `archive`)
  - `{연도}`: 4자리 연도 (`yyyy`)
  - `{월일}`: 4자리 월일 (`MMdd`, 예: `0604`)
  - `{메뉴명}`: 메뉴/기능 식별자 (예: `pastor`, `announcement`)
- 실제 저장 파일명은 UUID/난수 기반으로 생성한다.
- 사용자 업로드 원본 파일명은 별도 컬럼에 보관하고 화면 표시에 사용한다.
- 확장자, MIME, 크기, 생성일, 업로더 등 메타데이터는 `file_table`에서 관리한다.

### 11-3. 공통 파일 모듈 구성 (현행)

**백엔드** (`com.main.app.common.file`)

| 파일                  | 역할                                                               |
| --------------------- | ------------------------------------------------------------------ |
| `FileController.java` | `/api/common/files` 엔드포인트 (upload / list / download / delete) |
| `FileService.java`    | 업로드·다운로드·삭제 유스케이스                                    |
| `FileMapper.java`     | MyBatis Mapper 인터페이스                                          |
| `FileMapper.xml`      | `file_table` CRUD SQL (`mapper/common/file/`)                      |
| `FileDto.java`        | 파일 메타데이터 DTO (`common/dto/`)                                |
| `FileUploadUtil.java` | UUID 저장명 생성·디스크 저장 유틸 (`common/util/`)                 |

**프런트엔드** (`common/attachment/`)

| 파일                 | 역할                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| `attachment.tsx`     | UI 컴포넌트 (드래그존·파일 목록·진행률·상태 표시)                     |
| `attachmentHook.ts`  | `useAttachment` — existingFiles / newFiles / deletedFileIds 상태 관리 |
| `attachmentApi.ts`   | upload / remove / buildDownloadUrl stub                               |
| `attachmentModel.ts` | `AttachmentFile`, `AttachmentProps`, `AttachmentState` 타입 정의      |
| `index.ts`           | public export                                                         |

**공통 API 엔드포인트**

| 메서드 | 경로                                  | 설명                    |
| ------ | ------------------------------------- | ----------------------- |
| POST   | `/api/common/files/upload`            | 파일 업로드 (multipart) |
| GET    | `/api/common/files?pgmId=&refId=`     | 파일 목록 조회          |
| GET    | `/api/common/files/{fileId}/download` | 파일 다운로드           |
| DELETE | `/api/common/files/{fileId}`          | 파일 삭제               |

### 11-4. 운영/배포 체크

- 배포 시 `data/`는 애플리케이션 바이너리와 분리된 영속 경로로 운영한다.
- 백업 대상에 `data/` 전체를 포함한다.
- 다중 서버(수평 확장) 단계에서는 공유 스토리지 또는 오브젝트 스토리지 전환을 고려한다.

### 11-5. file_table 고도화 기준 (권장)

현재 `file_table` 기본 컬럼(`org_file_nm`, `stored_file_nm`, `file_size`, `file_path`)은 유지하되,
아래 컬럼을 추가해 경로 규칙과 운영 메타데이터를 명확히 관리한다.

| 컬럼명           | 타입           | 필수 | 설명                                         |
| ---------------- | -------------- | ---- | -------------------------------------------- |
| `file_category`  | `varchar(50)`  | Y    | `{구분}` 값 (`photo`, `board` 등)            |
| `menu_key`       | `varchar(100)` | Y    | `{메뉴명}` 값 (`pastor` 등)                  |
| `path_year`      | `char(4)`      | Y    | `{연도}` 값 (`yyyy`)                         |
| `path_mmdd`      | `char(4)`      | Y    | `{월일}` 값 (`MMdd`)                         |
| `relative_dir`   | `varchar(300)` | Y    | `data/{구분}/{연도}/{월일}/{메뉴명}`         |
| `relative_path`  | `varchar(500)` | Y    | `relative_dir + '/' + stored_file_nm`        |
| `file_ext`       | `varchar(20)`  | Y    | 파일 확장자 (`webp`, `jpg`, `pdf` 등)        |
| `mime_type`      | `varchar(120)` | N    | MIME 타입 (`image/webp` 등)                  |
| `uploader_id`    | `varchar(100)` | N    | 업로더 식별자                                |
| `uploader_ip`    | `varchar(64)`  | N    | 업로더 IP                                    |
| `is_deleted`     | `boolean`      | Y    | 소프트 삭제 여부                             |
| `del_dt`         | `timestamp`    | N    | 삭제 시각                                    |
| **`file_usage`** | `varchar(20)`  | Y    | **파일 용도 구분 ('editor' / 'attachment')** |

추가 권장 인덱스

- `(pgm_id, ref_id, is_deleted, ins_dt)`
- `(file_category, menu_key, path_year, path_mmdd)`
- `relative_path` 유니크 인덱스

운영 규칙

- `file_path`는 과거 호환을 위해 유지하되, 신규 로직은 `relative_path`를 표준으로 사용한다.
- 물리 삭제 대신 `is_deleted=true` + `del_dt=NOW()`를 우선 적용한다.
- 다운로드/목록 조회는 기본적으로 `is_deleted=false` 조건을 강제한다.

---

## 12. 공통 에디터 (common/editor)

### 12-1. 기본 방향

- Tiptap v2 기반 리치텍스트 에디터
- `editor.tsx` (편집기), `editorViewer.tsx` (읽기 전용), `editorHook.ts` (상태 관리), `editorApi.ts` (유틸)로 구성

### 12-2. 주요 기능

| 기능                 | 설명                                                    |
| :------------------- | :------------------------------------------------------ |
| **텍스트 스타일**    | 굵게, 기울임, 밑줄, 취소선, 위/아래첨자, 글자색, 형광펜 |
| **정렬**             | 좌/중/우/양쪽 정렬                                      |
| **목록**             | 글머리/번호 목록                                        |
| **인용/코드**        | 인용 블록, 인라인 코드, 코드 블록                       |
| **링크**             | URL 삽입/수정/제거                                      |
| **이미지**           | URL 삽입, 파일 업로드 (Base64 또는 서버 업로드)         |
| **이미지 정렬/크기** | 좌/중/우 정렬, 드래그 리사이징 (비율 유지)              |
| **표**               | 표 삽입/삭제                                            |
| **구분선**           | 수평선 삽입                                             |

### 12-3. 이미지 업로드 방식

- `onImageUpload` Props가 제공되면 서버 업로드를 수행하고 URL을 삽입한다.
- `onImageUpload`가 없으면 Base64 방식으로 동작한다 (하위 호환성).
- 서버 업로드 시 `attachmentApi.upload`를 통해 `com_file`에 저장되며, `file_usage='editor'`로 구분된다.

---

## 13. 공통 DataGrid (common/grid)

### 13-1. 기본 방향

- AG Grid 기반 공통 그리드 컴포넌트
- `grid.tsx` (메인 컴포넌트), `gridModel.ts` (타입 정의), `gridHook.ts` (상태 관리)로 구성

### 13-2. 4가지 운영 모드

| 모드       | 설명                                         | 사용처                         |
| :--------- | :------------------------------------------- | :----------------------------- |
| `basic`    | 게시판용. 정렬/필터 비활성화                 | 공지사항, 설교, Q&A 등         |
| `server`   | ERP 목록용. 헤더 클릭 시 서버 API 호출       | 회원 목록, 거래 내역 등        |
| `infinite` | 대용량 데이터 무한 스크롤                    | 전체 거래 내역, 시스템 로그 등 |
| `client`   | 소량 데이터 완전 제어 (클라이언트 정렬/필터) | 코드 관리, 설정 화면 등        |

### 13-3. 주요 Props

| Props             | 타입                                            | 기본값                             | 설명                                         |
| :---------------- | :---------------------------------------------- | :--------------------------------- | :------------------------------------------- |
| `mode`            | `'basic' \| 'server' \| 'infinite' \| 'client'` | `'basic'`                          | 운영 모드 선택                               |
| `columns`         | `ColDef[]`                                      | 필수                               | AG Grid 컬럼 정의                            |
| `rows`            | `any[]`                                         | 필수                               | 표시할 데이터                                |
| `rowHeight`       | `number`                                        | `44`                               | 행 높이 (px)                                 |
| `defaultColDef`   | `ColDef`                                        | `{ sortable: true, filter: true }` | 기본 컬럼 속성                               |
| `onSortChanged`   | `(sortModel) => void`                           | -                                  | 정렬 변경 콜백 (server 모드)                 |
| `onFilterChanged` | `(filterModel) => void`                         | -                                  | 필터 변경 콜백 (server 모드)                 |
| `onLoadData`      | `(params) => Promise<{ rows, totalCount }>`     | -                                  | 무한 스크롤 데이터 로드 콜백 (infinite 모드) |
| `saveState`       | `boolean`                                       | `false`                            | 컬럼 상태를 localStorage에 저장              |
| `stateKey`        | `string`                                        | -                                  | 상태 저장 고유 키 (saveState=true 필수)      |

### 13-4. 디자인 통합

- `gridTheme.css`를 통해 Tailwind 디자인 시스템과 통합
- 기본 테마: `ag-theme-custom` (CSS 변수 오버라이드)
- 헤더/셀 정렬은 페이지에서 `headerClass` / `cellClass`로 제어

---

## 14. 첨부파일 UI 스펙 (common/attachment)

### 14-1. 기본 방향

- 기반 라이브러리: **react-dropzone** (드래그앤드롭 zone 이벤트 전담)
- UI·상태·진행률은 모두 자체 구현 (Tailwind CSS)
- 업로드 실행(HTTP)은 도메인 `*Api.ts`에서 담당, 공통 컴포넌트는 콜백으로 연결

### 14-2. 구현 완료 기능

| 기능                   |  상태   |
| ---------------------- | :-----: |
| 드래그앤드롭 드롭존    | ✅ 완료 |
| 파일 추가(클릭·드래그) | ✅ 완료 |
| 기존 파일 목록 표시    | ✅ 완료 |
| 신규 파일 목록 표시    | ✅ 완료 |
| 개별 파일 삭제         | ✅ 완료 |
| 용량 표시              | ✅ 완료 |
| maxFiles / accept 제한 | ✅ 완료 |
| readOnly 모드          | ✅ 완료 |

### 14-3. 구현 예정 기능 (Phase 2)

| 기능                                   | 비고                              |
| -------------------------------------- | --------------------------------- |
| 클라우드형 드롭존 UI (아이콘·안내문구) | react-dropzone `useDropzone` 연결 |
| 확장자별 아이콘                        | MIME 타입 → 아이콘 매핑           |
| 업로드 진행률 바                       | axios `onUploadProgress`          |
| 업로드 성공/실패 상태 표시             | 파일 항목별 상태값                |
| 파일 전체 일괄 다운로드                | zip 생성 또는 개별 순차 다운      |
| 개별 파일 재시도                       | 실패 파일 상태 관리               |
| 업로드 취소                            | `AbortController`                 |

### 14-4. 장기 확장 고려 사항 (Phase 3+)

아래 기능은 현재 미구현이나 아키텍처 결정 시 고려 대상이다.

| 기능                         | 참조 오픈소스              | 필요 시 접근 방법                 |
| ---------------------------- | -------------------------- | --------------------------------- |
| **Tus 이어받기 업로드**      | Uppy `tus` plugin          | `tus-js-client` 별도 설치 (~3KB)  |
| **AWS S3 직접 업로드**       | Uppy `aws-s3` plugin       | Presigned URL + axios PUT         |
| **S3 Multipart 분할 업로드** | Uppy `aws-s3-multipart`    | S3 Multipart API 직접 호출        |
| **Google Drive 연동**        | Uppy `google-drive` plugin | Google Picker API 직접 연동       |
| **웹캠 촬영 업로드**         | Uppy `webcam` plugin       | `MediaDevices.getUserMedia()`     |
| **이미지 미리보기 썸네일**   | FilePond ImagePreview      | Canvas API or URL.createObjectURL |
| **이미지 압축·리사이즈**     | FilePond ImageResize       | `browser-image-compression`       |

> 위 기능이 필요해질 경우 **기존 `attachment.tsx` 인터페이스를 유지한 채** 내부 구현만 교체하거나 플러그인을 추가하는 방식으로 확장한다. 외부 사용 API(`AttachmentProps`, `useAttachment`)는 변경하지 않는다.

### 14-5. 사용처 연결 현황

| 도메인                        | 용도                   | 연결 상태    |
| ----------------------------- | ---------------------- | ------------ |
| `official/about/pastor`       | 담임목사 프로필 이미지 | ✅ 완료      |
| `official/worship/sermons`    | 게시글 첨부파일        | ✅ 완료      |
| 기타 게시판 (announcement 등) | 게시글 첨부파일        | ⏳ 진행 예정 |

✅ 갱신 완료!
두 문서 모두 오늘 작업한 내용이 반영되었습니다.

변경사항 FRONT-FULLSTACK-SPEC.md SYSTEM-ARCHITECTURE.md
fileUsage 규격 추가 ✅ 3.3절 ✅ 11-5절 (file_usage)
common/grid 설명 추가 ✅ 6.1절 (신규) ✅ 13절 (신규)
common/editor 설명 추가 ✅ 6.2절 (신규) ✅ 12절 (신규)
Service 표준 메서드명 준수 ✅ 기존 유지 ✅ 3-4절 강조
이제 문서를 업데이트하시면 됩니다. 😊

SYSTEM-ARCHITECTURE.md
복사 편한 형태로좀 다시해줘
좋아, 사용자가 SYSTEM-ARCHITECTURE.md 파일을 복사하기 편한 형태로 다시 달라고 했어. 이전에 내가 마크다운 코드 블록으로 전체 내용을 제공했지만, 사용자는 아마 전체 파일을 복사해서 덮어쓰기 원하는 것 같아. 그러면 코드 블록 안에 전체 내용을 다시 담아서 제공하면 되겠네. 이미 전체 내용을 다 작성했으니, 그냥 마크다운 코드 블록으로 감싸서 다시 보여주면 될 것 같아.

사용자가 "SYSTEM-ARCHITECTURE.md 복사 편한 형태로좀 다시해줘"라고 했으니, 전체 내용을 하나의 코드 블록으로 제공하면 가장 복사하기 편할 거야.

내가 기존에 작성한 SYSTEM-ARCHITECTURE.md 전체 내용을 다시 코드 블록 안에 넣어서 보여주면 돼. 주의할 점은 코드 블록 안에 있는 내용은 그대로 유지하되, 코드 블록 자체가 복사하기 편하게 제공되어야 해.

좋아, SYSTEM-ARCHITECTURE.md 전체 내용을 복사하기 편한 단일 코드 블록으로 다시 제공하겠다.

markdown

# 시스템 아키텍처 기준 문서

> 이 파일이 유일한 구조 기준 문서다.  
> 기존 `BACKEND-REFACTORING-ROADMAP.md`, `frontend-refactoring-checklist.md`는 이 파일로 통합·대체되었다.

---

## 1. 프로젝트 개요

| 항목        | 내용                                                      |
| ----------- | --------------------------------------------------------- |
| 백엔드      | Spring Boot (Java), MyBatis, Gradle                       |
| 프런트엔드  | React + TypeScript (Vite), Tailwind CSS                   |
| 라우팅 기준 | DB `erp_menu_seed.sql`의 메뉴 경로를 최우선 기준으로 사용 |

---

## 2. 도메인 구성 (공통 구조)

백엔드(`src/main/java/com/main/app/`)와 프런트엔드(`frontend/src/`)는 **동일한 대분류 도메인**으로 구성된다.

| 도메인      | 설명                                                                    |
| ----------- | ----------------------------------------------------------------------- |
| `official`  | 공식 교회 정보 (소개, 예배, 소식, 사역부서, 지원)                       |
| `community` | 공동체 (소그룹, 시설, 성도, 세계선교)                                   |
| `erp`       | 업무관리 (인사, 설교, 회계, 훈련, 사역, 행사, 시설, 소통, 관리자, 통계) |
| `mypage`    | 마이페이지 (프로필, 비밀번호, 활동, 문의, 알림, 탈퇴)                   |
| `system`    | 시스템 관리 (사용자, 설정, 로그, 백업)                                  |
| `common`    | 인프라·공통 레이어 (인증, 메뉴, 기관정보, API 기반, 챗봇 등)            |

---

## 3. 백엔드 구조

### 3-1. 패키지 트리

src/main/java/com/main/app/
├── AppApplication.java
├── common/
│ ├── advice/ # 전역 예외 처리
│ ├── auth/ # 인증/인가
│ ├── corp/ # 기관 기본정보 (Footer 등 공통 표시값)
│ ├── config/ # Spring 설정
│ ├── dto/ # 공통 응답 DTO
│ ├── exception/ # 커스텀 예외 클래스
│ ├── menu/ # 메뉴 조회 로직
│ └── util/ # 유틸리티
├── official/
│ ├── about/ # 소개 (pastor / history / beliefs / vision)
│ ├── index/ # 메인 페이지
│ ├── ministries/ # 사역부서 (children / youth / mission)
│ ├── news/ # 소식 (announcement / bulletin / registration / event)
│ ├── support/ # 지원 (qna / faq / location)
│ └── worship/ # 예배 (time / live / sermons)
├── community/
│ ├── facilities/
│ ├── group/
│ ├── index/
│ ├── saint/
│ └── world/
├── erp/
│ ├── account/
│ ├── admin/
│ ├── comm/
│ ├── event/
│ ├── facility/
│ ├── humen/ # 인사 (district / manager / newcomer / change)
│ ├── index/
│ ├── ministry/
│ ├── sermon/
│ ├── stats/
│ └── training/
├── mypage/
│ ├── index/
│ └── user/ # profile / password / activity / inquiry / notifications / withdraw
└── system/
├── backup/
├── config/
├── index/
├── log/
└── user/

text

### 3-2. 기능 단위(feature) 파일 구성 규칙

각 기능 폴더는 아래 4종 파일을 기본 세트로 가진다.
{Domain}/
├── {Feature}Controller.java
├── {Feature}Service.java
├── {Feature}Mapper.java
└── dto/
├── {Feature}Dto.java # 응답 DTO
└── {Feature}Request.java # 요청 DTO

text

**규칙**

- 기능이 단순하면 `dto/` 하위 폴더를 억지로 만들지 않는다.
- 기능이 커지면 `about/pastor`처럼 중분류 하위 기능 폴더를 추가한다.
- `controller/`, `service/`, `mapper/` 같은 역할 기반 하위 폴더는 **만들지 않는다**.

### 3-3. MyBatis XML 위치 규칙

src/main/resources/mapper/
├── common/
├── official/
│ ├── about/
│ ├── ministries/
│ ├── news/
│ ├── support/
│ └── worship/
├── community/
├── erp/
├── mypage/
└── system/

text

- XML 파일명: `{Feature}Mapper.xml`
- XML `namespace`는 Java Mapper 인터페이스 전체 경로와 **1:1**로 일치해야 한다.  
  예: `namespace="com.main.app.official.about.pastor.PastorMapper"`

### 3-4. CRUD 기준 패턴 (official/about/pastor 기준)

**엔드포인트**

| 메서드 | 경로                                                    | 설명        |
| ------ | ------------------------------------------------------- | ----------- |
| GET    | `/api/official/about/pastor`                            | 목록 조회   |
| POST   | `/api/official/about/pastor`                            | 등록        |
| PUT    | `/api/official/about/pastor/{id}`                       | 수정        |
| DELETE | `/api/official/about/pastor/{id}?updatedBy=&updatedIp=` | 소프트 삭제 |

**Service 규칙**

- 조회: `@Transactional(readOnly = true)`
- 등록·수정·삭제: `@Transactional`
- **Service 메서드명은 `FRONT-FULLSTACK-SPEC.md`의 표준 규칙(`getInfo`, `setCreate`, `setUpdate`, `delRemove`)을 준수한다.**

**삭제 정책**

- 물리 삭제 금지
- `is_deleted = TRUE`, `is_active = FALSE` 소프트 삭제만 허용

### 3-5. 레거시 삭제 기준

아래 조건을 **모두** 만족할 때만 레거시 파일을 삭제한다.

1. 새 경로 빌드 통과
2. 옛 경로에 대한 import/namespace 참조 0건
3. 옛 구조를 대표하는 상위 셸 파일(도메인명 그대로의 Controller/Service/Mapper)이 0건

삭제 대상 예시

- 상위 셸: `official/<domain>/<Domain>Controller.java`
- 브리지: `official/<domain>/controller/<Domain>PageMetaController.java`
- 역할 기반 빈 폴더: `<feature>/controller/`, `<feature>/service/`, `<feature>/mapper/`

---

## 4. 프런트엔드 구조

### 4-1. 폴더 트리

frontend/src/
├── main.tsx
├── App.tsx
├── styles/
├── layouts/ # 전역 레이아웃 뼈대
│ ├── MainLayout.tsx
│ ├── SubmenuLayout.tsx
│ ├── Header.tsx
│ ├── Footer.tsx
│ ├── Sidebar.tsx
│ ├── Breadcrumb.tsx
│ └── heroConfig.ts
├── router/ # 라우팅 가드 및 도메인별 라우트
│ ├── index.tsx
│ ├── ProtectedRoute.tsx
│ ├── AuthRoutes.tsx
│ ├── OfficialRoutes.tsx
│ ├── CommunityRoutes.tsx
│ ├── ErpRoutes.tsx
│ ├── MypageRoutes.tsx
│ └── SystemRoutes.tsx
├── common/ # 인프라·공통 레이어
│ ├── api/ # axios 인스턴스 등 HTTP 인프라
│ ├── auth/ # 인증 도메인 (authApi / authStore / authHook / authModel / authTypes / login / register)
│ ├── corp/ # 기관정보 도메인 (Footer 주소 등 공통 표시값)
│ ├── board/ # 게시판 공통 타입 (deprecated: 도메인별 Model로 이전 중)
│ ├── chatbot/ # 챗봇 컴포넌트
│ ├── editor/ # 리치텍스트 에디터 (editor / editorViewer / editorHook / editorApi / editorModel)
│ ├── attachment/ # 파일첨부 공통 모듈 (attachment / attachmentHook / attachmentApi / attachmentModel)
│ ├── grid/ # DataGrid 공통 모듈 (grid / gridModel / gridHook) - AG Grid 기반
│ ├── lib/ # 범용 유틸
│ └── menu/ # 메뉴 도메인 (menuApi / menuHook / menuModel / menuStore / menu.types)
├── official/
├── community/
├── erp/
├── mypage/
└── system/

text

### 4-2. 기능 단위(feature) 파일 구성 규칙

각 기능 폴더는 아래 4파일 체계를 기본 세트로 가진다.
{domain}/{feature}/
├── {feature}List.tsx # 목록 페이지 (화면 렌더링, Hook 호출)
├── {feature}View.tsx # 상세 페이지
├── {feature}Write.tsx # 작성/수정 페이지
├── {feature}Hook.ts # 도메인 상태·유스케이스 흐름
├── {feature}Api.ts # HTTP 호출 캡슐화
└── {feature}Model.ts # 타입·상수 계약 정의

text

기준 구현체: `frontend/src/official/about/pastor/`

### 4-3. 각 파일 역할 및 금지 사항

| 파일         | 역할                                                       | 금지                                |
| ------------ | ---------------------------------------------------------- | ----------------------------------- |
| `*List.tsx`  | 화면 렌더링, 이벤트 처리, 입력 상태 관리, Hook 호출        | HTTP 직접 호출, 엔드포인트 하드코딩 |
| `*View.tsx`  | 상세 화면 렌더링, 댓글/첨부파일 표시                       | HTTP 직접 호출                      |
| `*Write.tsx` | 작성/수정 폼 렌더링, 에디터/첨부파일 연동                  | HTTP 직접 호출                      |
| `*Hook.ts`   | 도메인 상태(`loading/error/data`) 보유, Api 오케스트레이션 | JSX 반환                            |
| `*Api.ts`    | HTTP 호출 캡슐화, 에러 메시지 표준화, 응답 타입 계약       | UI 상태 처리                        |
| `*Model.ts`  | 타입·상수 계약 정의                                        | API 호출, 상태 로직                 |

### 4-4. 레이아웃 계층 구조

MainLayout ← 전역 뼈대 (Header / Sidebar / Footer / Chatbot 포함)
└── SubmenuLayout ← 서브메뉴 영역 (ERP, Mypage 등 2단 네비가 필요한 도메인)

text

- `ErpLayout`, `MypageLayout` 같은 도메인 전용 Layout은 **만들지 않는다**.
- `MainLayout`의 `showChatbot` 옵션으로 도메인별 챗봇 표시 여부를 제어한다.
- `Header.tsx`는 auth 상태를 참조하더라도 레이아웃 책임이므로 `common/auth`로 이동하지 않는다.

### 4-5. common 레이어 원칙

- **auth**: 인증 유스케이스(login/register/logout/session)와 관련 상태(authStore)만 포함.  
  `ProtectedRoute`, `Header`는 인증 정보를 사용해도 책임이 다르므로 각자의 위치 유지.
- **corp**: 기관 기본정보를 읽기 전용으로 조회한다. Footer 같은 전역 레이아웃은 이 값을 소비만 한다.
- **menu**: 메뉴 조회·상태 관리를 `menuApi / menuHook / menuModel / menuStore`로 분리.  
  중앙 공통 `api/menuApi.ts`는 제거하고 `common/menu/` 단일 경로만 사용.
- **board**: 메뉴별 로컬 `*Api.ts`로 흡수한다. 중앙 `boardApi.ts`는 제거.  
  신규 게시판 메뉴는 반드시 로컬 Api 우선으로 작성한다.
- **chatbot**: `common/chatbot/`이 단일 소스. `components/chatbot`과 같은 중복 경로를 만들지 않는다.
- **editor**: `common/editor/`이 단일 소스. Tiptap v2 기반 리치텍스트 에디터.  
  `onImageUpload` Props로 이미지 서버 업로드 지원 (Base64 fallback 포함).
- **attachment**: `common/attachment/`이 단일 소스. react-dropzone 기반 파일첨부 공통 모듈.  
  업로드 실행은 도메인 Api에서 담당하고, UI·상태 관리만 공통 모듈에서 제공한다.
- **grid**: `common/grid/`이 단일 소스. AG Grid 기반 DataGrid 공통 모듈.  
  4가지 운영 모드(basic / server / infinite / client) 지원.

### 4-6. 라우팅 가드 위치

- `ProtectedRoute.tsx`는 `router/` 폴더에 위치한다 (라우팅 가드 책임).
- 인증 관련 페이지 라우트는 `router/AuthRoutes.tsx`로 분리한다.

---

## 5. API 경로 명명 규칙

/api/{domain}/{subdomain}/{feature}

text

예시

| 도메인          | 경로                              |
| --------------- | --------------------------------- |
| official/about  | `/api/official/about/pastor`      |
| official/news   | `/api/official/news/announcement` |
| community/group | `/api/community/group`            |
| erp/humen       | `/api/erp/humen/district`         |
| mypage/user     | `/api/mypage/user/profile`        |
| system/user     | `/api/system/user`                |

- 경로는 DB 메뉴 경로(`erp_menu_seed.sql`)를 기준으로 확정한다.
- 프런트엔드 라우트 경로와 백엔드 API 경로는 도메인 단위에서 동일한 계층 구조를 유지한다.

---

## 6. 현재 구현 상태

| 도메인                | 백엔드        | 프런트엔드    | 비고                                                                                     |
| --------------------- | ------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `common`              | 완료          | 완료          | auth/menu/chatbot/editor/attachment/grid 응집 완료                                       |
| `official/about`      | 완료          | 완료          | pastor 기준 패턴 확정 · 프로필 이미지 첨부파일 모듈 연결                                 |
| `official/worship`    | 완료          | 완료          | time / live / sermons (sermons List/View/Write 분할 완료)                                |
| `official/news`       | 완료          | 완료          | announcement / bulletin / registration / event                                           |
| `official/ministries` | 완료          | 완료          | children / youth / mission                                                               |
| `official/support`    | 완료          | 완료          | 평면화 완료                                                                              |
| `mypage`              | 완료          | 완료          | user 6개 메뉴                                                                            |
| `system`              | 완료          | 완료          | user / config / log / backup                                                             |
| `community`           | 완료          | 완료          | group / facilities / saint / world                                                       |
| `erp`                 | **진행 예정** | **진행 예정** | humen / sermon / account / training / ministry / event / facility / comm / admin / stats |

---

## 7. 신규 기능 추가 시 체크리스트

### 백엔드

- [ ] DB 메뉴 경로(`erp_menu_seed.sql`)에서 도메인·기능 경로 확인
- [ ] `{Domain}/{feature}/` 하위에 Controller / Service / Mapper / dto 4파일 세트 생성
- [ ] Service 메서드명은 `FRONT-FULLSTACK-SPEC.md`의 표준 규칙(`getInfo`, `setCreate`, `setUpdate`, `delRemove`) 준수
- [ ] XML 파일을 `src/main/resources/mapper/{domain}/{subdomain}/` 에 생성
- [ ] XML `namespace`를 Java Mapper 인터페이스 경로와 1:1 일치
- [ ] 역할 기반 하위 폴더(`controller/`, `service/` 등) 생성 금지
- [ ] 빌드 통과 확인 (`gradlew compileJava`)
- [ ] 레거시 경로 참조 0건 확인 후 레거시 파일 삭제

### 프런트엔드

- [ ] `{domain}/{feature}/` 하위에 List / View / Write / Hook / Api / Model 6파일 세트 생성
- [ ] `*Api.ts`에 HTTP 호출 캡슐화 (엔드포인트 하드코딩 금지)
- [ ] `*List.tsx` / `*View.tsx` / `*Write.tsx`에서 HTTP 직접 호출 금지
- [ ] `*Hook.ts`에서 JSX 반환 금지
- [ ] 신규 라우트를 해당 도메인 `*Routes.tsx`에 등록
- [ ] 메뉴 연결은 `common/menu/menuModel.ts` 상수 또는 DB 메뉴 경로 기준
- [ ] 도메인 전용 Layout 클래스 생성 금지 (MainLayout + SubmenuLayout 조합 사용)
- [ ] 빌드 통과 확인 (`npm run build`)

---

## 8. 불변 원칙 (항상 유지)

1. **DB 메뉴 경로 우선** — 구조 결정의 최우선 기준은 `erp_menu_seed.sql`.
2. **단위 순차 진행** — 한 번에 전 도메인을 바꾸지 않는다. 중분류 단위 하나씩 완료 후 다음으로 이동.
3. **역할 기반 폴더 금지** — `controller/`, `service/`, `mapper/` 하위 폴더를 만들지 않는다.
4. **도메인 전용 Layout 금지** — 프런트엔드에서 도메인 전용 Layout 파일을 만들지 않는다.
5. **중앙 공통 API 금지** — 신규 게시판/메뉴 기능은 로컬 `*Api.ts` 우선, 중복 확인 후에만 공통화.
6. **소프트 삭제 강제** — 물리 삭제 대신 `is_deleted = TRUE`, `is_active = FALSE`.
7. **레거시 삭제 조건 준수** — 빌드 통과 + 참조 0건 동시 만족 시에만 삭제.
8. **빈 폴더 정리** — 파일이 없는 구조 잔재 폴더는 삭제 대상이다.

---

## 9. Hero 영역 운영 가이드 (메뉴 성격별)

### 9-1. 기본 원칙

- Hero는 "브랜드/메시지 전달"이 목표일 때 강화하고, "업무 처리"가 목표일 때 축소/제거한다.
- 같은 도메인 안에서도 상위 랜딩(소개)과 하위 실행 화면(목록/폼/관리)은 분리 운영한다.
- 모바일은 첫 화면 진입 속도를 우선해 Hero 높이를 줄이거나 단순화한다.

### 9-2. 도메인별 권장 강도

| 도메인      | 화면 성격           | Hero 강도 | 권장 방식                                   |
| ----------- | ------------------- | --------- | ------------------------------------------- |
| `official`  | 대외 소개/브랜딩    | 높음      | 메뉴별 대표 이미지 + 짧은 카피 + CTA 1~2개  |
| `community` | 소식/활동 전달      | 중간      | 이미지 또는 아이콘형 Hero, 정보 카드와 연계 |
| `mypage`    | 개인 작업 중심      | 낮음      | 얇은 타이틀 바 또는 미니 배너               |
| `system`    | 운영/설정 중심      | 없음~낮음 | Hero 제거, 제목/설명 1줄만 유지             |
| `erp`       | 업무 처리/입력 중심 | 없음      | Hero 제거, 필터/테이블/폼 가시성 최우선     |

### 9-3. 화면 레벨별 적용 기준

| 화면 레벨    | 권장              | 이유                                      |
| ------------ | ----------------- | ----------------------------------------- |
| 메인/랜딩    | Hero 사용         | 첫 인상, 브랜드 톤, 빠른 진입 CTA 제공    |
| 섹션 인덱스  | 축소 Hero 사용    | 맥락 제공은 유지하되 콘텐츠 노출 우선     |
| 목록/검색/폼 | Hero 미사용       | 세로 공간 확보, 작업 효율, 스캔 속도 개선 |
| 상세 조회    | 필요 시 미니 Hero | 커버 이미지가 의미 있을 때만 제한적 사용  |

### 9-4. Hero를 사용할 때의 디자인 기준

- 텍스트 가독성: 이미지 위 오버레이를 사용해 텍스트 대비를 확보한다.
- 콘텐츠 밀도: 제목 1개, 보조 문구 1~2줄, CTA 1~2개를 기본 한도로 둔다.
- 높이 가이드: Desktop > Tablet > Mobile 순으로 단계적 축소를 적용한다.
- 일관성: 색조, 버튼 스타일, 타이포는 브랜드 규칙을 유지하고 이미지만 메뉴별로 변경한다.
- 상호작용: 슬라이더를 사용할 경우 자동재생 + 수동 제어(버튼/인디케이터/스와이프)를 함께 제공한다.

### 9-5. 성능/접근성 운영 체크

- 이미지 최적화(WebP/적정 해상도/용량 제한)와 지연 로딩을 기본 적용한다.
- 배너 이미지 로딩 실패 시 기본 플레이스홀더를 제공한다.
- 배너 조작 버튼은 키보드 접근 가능해야 하며, `aria-label`을 제공한다.
- 자동 전환 슬라이더는 사용자가 직접 제어할 수 있어야 한다.

### 9-6. 본 프로젝트 적용 결론

- `official`: 현재처럼 Hero/슬라이더 유지 가능. 메뉴 성격에 맞는 이미지 교체 운영 권장.
- `community`: 중간 강도 Hero 또는 카드형 대표 비주얼 권장.
- `mypage`, `system`: Hero 축소(또는 제거) 권장.
- `erp`: Hero 비노출 권장. 상단 공간은 검색/필터/액션 버튼에 할당.

### 9-7. 메뉴별 Hero 운영표 (완성형)

아래 표는 "이미지 유무와 무관하게" 동작하는 기본 운영안이다. 이미지가 없으면 기본 그라데이션 Hero로 자동 폴백한다.

| 도메인      | 메뉴군(예시 경로)         | Hero 노출   | 이미지 파일 규칙(권장)                      | 문구 톤          |
| ----------- | ------------------------- | ----------- | ------------------------------------------- | ---------------- |
| `official`  | `/about/*`                | 노출        | `public/img/hero/official-about.webp`       | 소개/비전 중심   |
| `official`  | `/worship/*`              | 노출        | `public/img/hero/official-worship.webp`     | 예배/설교 중심   |
| `official`  | `/ministries/*`           | 노출        | `public/img/hero/official-ministries.webp`  | 사역/섬김 중심   |
| `official`  | `/news/*`                 | 노출        | `public/img/hero/official-news.webp`        | 소식/공지 중심   |
| `official`  | `/support/*`              | 노출        | `public/img/hero/official-support.webp`     | 안내/문의 중심   |
| `community` | `/community/group/*`      | 노출        | `public/img/hero/community-group.webp`      | 모임/공동체 중심 |
| `community` | `/community/facilities/*` | 노출        | `public/img/hero/community-facilities.webp` | 시설/이용 중심   |
| `community` | `/community/saint/*`      | 노출        | `public/img/hero/community-saint.webp`      | 지원/돌봄 중심   |
| `community` | `/community/world/*`      | 노출        | `public/img/hero/community-world.webp`      | 콘텐츠/읽기 중심 |
| `mypage`    | `/mypage/*`               | 축소 노출   | 선택(없어도 무방)                           | 개인 관리 중심   |
| `system`    | `/system/*`               | 기본 비노출 | 사용 안 함                                  | 운영/설정 중심   |
| `erp`       | `/erp/*`                  | 비노출      | 사용 안 함                                  | 업무 처리 중심   |

### 9-8. 에셋이 없는 경우 운영 규칙

- 이미지 파일이 없어도 Hero는 기본 배경(그라데이션 + 오버레이)으로 렌더링되어 화면이 깨지지 않아야 한다.
- 이미지 로딩 실패 시 자동으로 이미지 레이어만 제거하고 텍스트/레이아웃은 유지한다.
- 이미지 준비 전 단계에서는 문구와 높이만 먼저 확정하고, 파일이 준비되면 경로만 연결한다.

### 9-9. 이미지 준비 스펙(권장)

- 포맷: WebP 우선 (필요 시 JPG 병행)
- 기준 해상도: 1920x540 (서브 Hero), 1920x720 (메인 랜딩)
- 용량 권장: 장당 250KB 이하(최대 400KB)
- 안전 영역: 좌측 40% 안쪽에 제목/문구 배치 기준 확보
- 명명 규칙: `{domain}-{menu-group}.webp` (예: `official-news.webp`)

---

## 10. Pastor(목회자 소개) 개선 방향

### 10-1. 운영 모드(2가지) 정의

목회자 소개는 아래 2개 모드를 모두 지원한다.

1. **단일 이미지 모드**

- 목회자 사진과 인사말이 하나의 이미지 파일로 합성된 경우 사용
- DB `com_corp.photo_path` 기준으로 이미지 렌더링
- 텍스트 소개(`introduction`)는 화면 표시에서 비활성화(또는 무시)

2. **분리 모드(텍스트 + 이미지)**

- 이미지: `com_corp.photo_path`
- 소개문: `com_corp.introduction`
- 이미지와 본문을 분리해 렌더링

### 10-2. 표시 규칙(불완전 데이터 포함)

- 단일 이미지 모드에서 `photo_path`가 없으면 기본 플레이스홀더 이미지를 표시한다.
- 분리 모드에서 `photo_path`가 없으면 기본 이미지를 표시하고, `introduction`은 정상 출력한다.
- 분리 모드에서 `introduction`이 비어 있으면 "소개문이 등록되지 않았습니다" 안내문을 표시한다.
- 모드 전환 시 기존 데이터는 삭제하지 않고, 표시 규칙만 변경한다.

### 10-3. 구현 원칙

- 권한 제어(편집/삭제 권한)는 별도 단계에서 적용한다.
- 현재 단계는 화면/업로드/표시 로직 구현에 집중한다.
- `updatedBy`, `updatedIp` 같은 감사 필드는 장기적으로 서버에서 확정하는 방향을 권장한다.

---

## 11. 공통 파일관리 체계

### 11-1. 저장소 루트 원칙

- 프로젝트 루트 기준 `data/`를 업로드 파일 루트로 사용한다. (`app.upload.path=./data/`)
- 기능별 파일은 `data/` 하위 목적 폴더로 분리한다.
  data/
  ├── photo/
  │ └── pastor/
  ├── board/
  │ ├── announcement/
  │ ├── bulletin/
  │ └── ...
  ├── temp/
  └── archive/

text

### 11-2. 경로/식별자 저장 규칙

- DB에는 서버 절대경로가 아닌 **상대경로**만 저장한다.
  - 표준 패턴: `data/{구분}/{연도}/{월일}/{메뉴명}/{난수파일명}.{확장자}`
  - 예: `data/photo/2026/0604/pastor/a8f3b1f4d9c34a71b2e1c3f44f0f0e7a.webp`
- 파일 저장 폴더 규칙은 아래를 고정한다.
  - `{구분}`: 업무 목적 분류 (예: `photo`, `board`, `archive`)
  - `{연도}`: 4자리 연도 (`yyyy`)
  - `{월일}`: 4자리 월일 (`MMdd`, 예: `0604`)
  - `{메뉴명}`: 메뉴/기능 식별자 (예: `pastor`, `announcement`)
- 실제 저장 파일명은 UUID/난수 기반으로 생성한다.
- 사용자 업로드 원본 파일명은 별도 컬럼에 보관하고 화면 표시에 사용한다.
- 확장자, MIME, 크기, 생성일, 업로더 등 메타데이터는 `file_table`에서 관리한다.

### 11-3. 공통 파일 모듈 구성 (현행)

**백엔드** (`com.main.app.common.file`)

| 파일                  | 역할                                                               |
| --------------------- | ------------------------------------------------------------------ |
| `FileController.java` | `/api/common/files` 엔드포인트 (upload / list / download / delete) |
| `FileService.java`    | 업로드·다운로드·삭제 유스케이스                                    |
| `FileMapper.java`     | MyBatis Mapper 인터페이스                                          |
| `FileMapper.xml`      | `file_table` CRUD SQL (`mapper/common/file/`)                      |
| `FileDto.java`        | 파일 메타데이터 DTO (`common/dto/`)                                |
| `FileUploadUtil.java` | UUID 저장명 생성·디스크 저장 유틸 (`common/util/`)                 |

**프런트엔드** (`common/attachment/`)

| 파일                 | 역할                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| `attachment.tsx`     | UI 컴포넌트 (드래그존·파일 목록·진행률·상태 표시)                     |
| `attachmentHook.ts`  | `useAttachment` — existingFiles / newFiles / deletedFileIds 상태 관리 |
| `attachmentApi.ts`   | upload / remove / buildDownloadUrl stub                               |
| `attachmentModel.ts` | `AttachmentFile`, `AttachmentProps`, `AttachmentState` 타입 정의      |
| `index.ts`           | public export                                                         |

**공통 API 엔드포인트**

| 메서드 | 경로                                  | 설명                    |
| ------ | ------------------------------------- | ----------------------- |
| POST   | `/api/common/files/upload`            | 파일 업로드 (multipart) |
| GET    | `/api/common/files?pgmId=&refId=`     | 파일 목록 조회          |
| GET    | `/api/common/files/{fileId}/download` | 파일 다운로드           |
| DELETE | `/api/common/files/{fileId}`          | 파일 삭제               |

### 11-4. 운영/배포 체크

- 배포 시 `data/`는 애플리케이션 바이너리와 분리된 영속 경로로 운영한다.
- 백업 대상에 `data/` 전체를 포함한다.
- 다중 서버(수평 확장) 단계에서는 공유 스토리지 또는 오브젝트 스토리지 전환을 고려한다.

### 11-5. file_table 고도화 기준 (권장)

현재 `file_table` 기본 컬럼(`org_file_nm`, `stored_file_nm`, `file_size`, `file_path`)은 유지하되,
아래 컬럼을 추가해 경로 규칙과 운영 메타데이터를 명확히 관리한다.

| 컬럼명           | 타입           | 필수 | 설명                                         |
| ---------------- | -------------- | ---- | -------------------------------------------- |
| `file_category`  | `varchar(50)`  | Y    | `{구분}` 값 (`photo`, `board` 등)            |
| `menu_key`       | `varchar(100)` | Y    | `{메뉴명}` 값 (`pastor` 등)                  |
| `path_year`      | `char(4)`      | Y    | `{연도}` 값 (`yyyy`)                         |
| `path_mmdd`      | `char(4)`      | Y    | `{월일}` 값 (`MMdd`)                         |
| `relative_dir`   | `varchar(300)` | Y    | `data/{구분}/{연도}/{월일}/{메뉴명}`         |
| `relative_path`  | `varchar(500)` | Y    | `relative_dir + '/' + stored_file_nm`        |
| `file_ext`       | `varchar(20)`  | Y    | 파일 확장자 (`webp`, `jpg`, `pdf` 등)        |
| `mime_type`      | `varchar(120)` | N    | MIME 타입 (`image/webp` 등)                  |
| `uploader_id`    | `varchar(100)` | N    | 업로더 식별자                                |
| `uploader_ip`    | `varchar(64)`  | N    | 업로더 IP                                    |
| `is_deleted`     | `boolean`      | Y    | 소프트 삭제 여부                             |
| `del_dt`         | `timestamp`    | N    | 삭제 시각                                    |
| **`file_usage`** | `varchar(20)`  | Y    | **파일 용도 구분 ('editor' / 'attachment')** |

추가 권장 인덱스

- `(pgm_id, ref_id, is_deleted, ins_dt)`
- `(file_category, menu_key, path_year, path_mmdd)`
- `relative_path` 유니크 인덱스

운영 규칙

- `file_path`는 과거 호환을 위해 유지하되, 신규 로직은 `relative_path`를 표준으로 사용한다.
- 물리 삭제 대신 `is_deleted=true` + `del_dt=NOW()`를 우선 적용한다.
- 다운로드/목록 조회는 기본적으로 `is_deleted=false` 조건을 강제한다.

---

## 12. 공통 에디터 (common/editor)

### 12-1. 기본 방향

- Tiptap v2 기반 리치텍스트 에디터
- `editor.tsx` (편집기), `editorViewer.tsx` (읽기 전용), `editorHook.ts` (상태 관리), `editorApi.ts` (유틸)로 구성

### 12-2. 주요 기능

| 기능                 | 설명                                                    |
| :------------------- | :------------------------------------------------------ |
| **텍스트 스타일**    | 굵게, 기울임, 밑줄, 취소선, 위/아래첨자, 글자색, 형광펜 |
| **정렬**             | 좌/중/우/양쪽 정렬                                      |
| **목록**             | 글머리/번호 목록                                        |
| **인용/코드**        | 인용 블록, 인라인 코드, 코드 블록                       |
| **링크**             | URL 삽입/수정/제거                                      |
| **이미지**           | URL 삽입, 파일 업로드 (Base64 또는 서버 업로드)         |
| **이미지 정렬/크기** | 좌/중/우 정렬, 드래그 리사이징 (비율 유지)              |
| **표**               | 표 삽입/삭제                                            |
| **구분선**           | 수평선 삽입                                             |

### 12-3. 이미지 업로드 방식

- `onImageUpload` Props가 제공되면 서버 업로드를 수행하고 URL을 삽입한다.
- `onImageUpload`가 없으면 Base64 방식으로 동작한다 (하위 호환성).
- 서버 업로드 시 `attachmentApi.upload`를 통해 `com_file`에 저장되며, `file_usage='editor'`로 구분된다.

---

## 13. 공통 DataGrid (common/grid)

### 13-1. 기본 방향

- AG Grid 기반 공통 그리드 컴포넌트
- `grid.tsx` (메인 컴포넌트), `gridModel.ts` (타입 정의), `gridHook.ts` (상태 관리)로 구성

### 13-2. 4가지 운영 모드

| 모드       | 설명                                         | 사용처                         |
| :--------- | :------------------------------------------- | :----------------------------- |
| `basic`    | 게시판용. 정렬/필터 비활성화                 | 공지사항, 설교, Q&A 등         |
| `server`   | ERP 목록용. 헤더 클릭 시 서버 API 호출       | 회원 목록, 거래 내역 등        |
| `infinite` | 대용량 데이터 무한 스크롤                    | 전체 거래 내역, 시스템 로그 등 |
| `client`   | 소량 데이터 완전 제어 (클라이언트 정렬/필터) | 코드 관리, 설정 화면 등        |

### 13-3. 주요 Props

| Props             | 타입                                            | 기본값                             | 설명                                         |
| :---------------- | :---------------------------------------------- | :--------------------------------- | :------------------------------------------- |
| `mode`            | `'basic' \| 'server' \| 'infinite' \| 'client'` | `'basic'`                          | 운영 모드 선택                               |
| `columns`         | `ColDef[]`                                      | 필수                               | AG Grid 컬럼 정의                            |
| `rows`            | `any[]`                                         | 필수                               | 표시할 데이터                                |
| `rowHeight`       | `number`                                        | `44`                               | 행 높이 (px)                                 |
| `defaultColDef`   | `ColDef`                                        | `{ sortable: true, filter: true }` | 기본 컬럼 속성                               |
| `onSortChanged`   | `(sortModel) => void`                           | -                                  | 정렬 변경 콜백 (server 모드)                 |
| `onFilterChanged` | `(filterModel) => void`                         | -                                  | 필터 변경 콜백 (server 모드)                 |
| `onLoadData`      | `(params) => Promise<{ rows, totalCount }>`     | -                                  | 무한 스크롤 데이터 로드 콜백 (infinite 모드) |
| `saveState`       | `boolean`                                       | `false`                            | 컬럼 상태를 localStorage에 저장              |
| `stateKey`        | `string`                                        | -                                  | 상태 저장 고유 키 (saveState=true 필수)      |

### 13-4. 디자인 통합

- `gridTheme.css`를 통해 Tailwind 디자인 시스템과 통합
- 기본 테마: `ag-theme-custom` (CSS 변수 오버라이드)
- 헤더/셀 정렬은 페이지에서 `headerClass` / `cellClass`로 제어

---

## 14. 첨부파일 UI 스펙 (common/attachment)

### 14-1. 기본 방향

- 기반 라이브러리: **react-dropzone** (드래그앤드롭 zone 이벤트 전담)
- UI·상태·진행률은 모두 자체 구현 (Tailwind CSS)
- 업로드 실행(HTTP)은 도메인 `*Api.ts`에서 담당, 공통 컴포넌트는 콜백으로 연결

### 14-2. 구현 완료 기능

| 기능                   |  상태   |
| ---------------------- | :-----: |
| 드래그앤드롭 드롭존    | ✅ 완료 |
| 파일 추가(클릭·드래그) | ✅ 완료 |
| 기존 파일 목록 표시    | ✅ 완료 |
| 신규 파일 목록 표시    | ✅ 완료 |
| 개별 파일 삭제         | ✅ 완료 |
| 용량 표시              | ✅ 완료 |
| maxFiles / accept 제한 | ✅ 완료 |
| readOnly 모드          | ✅ 완료 |

### 14-3. 구현 예정 기능 (Phase 2)

| 기능                                   | 비고                              |
| -------------------------------------- | --------------------------------- |
| 클라우드형 드롭존 UI (아이콘·안내문구) | react-dropzone `useDropzone` 연결 |
| 확장자별 아이콘                        | MIME 타입 → 아이콘 매핑           |
| 업로드 진행률 바                       | axios `onUploadProgress`          |
| 업로드 성공/실패 상태 표시             | 파일 항목별 상태값                |
| 파일 전체 일괄 다운로드                | zip 생성 또는 개별 순차 다운      |
| 개별 파일 재시도                       | 실패 파일 상태 관리               |
| 업로드 취소                            | `AbortController`                 |

### 14-4. 장기 확장 고려 사항 (Phase 3+)

아래 기능은 현재 미구현이나 아키텍처 결정 시 고려 대상이다.

| 기능                         | 참조 오픈소스              | 필요 시 접근 방법                 |
| ---------------------------- | -------------------------- | --------------------------------- |
| **Tus 이어받기 업로드**      | Uppy `tus` plugin          | `tus-js-client` 별도 설치 (~3KB)  |
| **AWS S3 직접 업로드**       | Uppy `aws-s3` plugin       | Presigned URL + axios PUT         |
| **S3 Multipart 분할 업로드** | Uppy `aws-s3-multipart`    | S3 Multipart API 직접 호출        |
| **Google Drive 연동**        | Uppy `google-drive` plugin | Google Picker API 직접 연동       |
| **웹캠 촬영 업로드**         | Uppy `webcam` plugin       | `MediaDevices.getUserMedia()`     |
| **이미지 미리보기 썸네일**   | FilePond ImagePreview      | Canvas API or URL.createObjectURL |
| **이미지 압축·리사이즈**     | FilePond ImageResize       | `browser-image-compression`       |

> 위 기능이 필요해질 경우 **기존 `attachment.tsx` 인터페이스를 유지한 채** 내부 구현만 교체하거나 플러그인을 추가하는 방식으로 확장한다. 외부 사용 API(`AttachmentProps`, `useAttachment`)는 변경하지 않는다.

### 14-5. 사용처 연결 현황

| 도메인                        | 용도                   | 연결 상태    |
| ----------------------------- | ---------------------- | ------------ |
| `official/about/pastor`       | 담임목사 프로필 이미지 | ✅ 완료      |
| `official/worship/sermons`    | 게시글 첨부파일        | ✅ 완료      |
| 기타 게시판 (announcement 등) | 게시글 첨부파일        | ⏳ 진행 예정 |
