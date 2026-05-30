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

```
src/main/java/com/main/app/
├── AppApplication.java
├── common/
│   ├── advice/        # 전역 예외 처리
│   ├── auth/          # 인증/인가
│   ├── corp/          # 기관 기본정보 (Footer 등 공통 표시값)
│   ├── config/        # Spring 설정
│   ├── dto/           # 공통 응답 DTO
│   ├── exception/     # 커스텀 예외 클래스
│   ├── menu/          # 메뉴 조회 로직
│   └── util/          # 유틸리티
├── official/
│   ├── about/         # 소개 (pastor / history / beliefs / vision)
│   ├── index/
│   ├── ministries/    # 사역부서 (children / youth / mission)
│   ├── news/          # 소식 (announcement / bulletin / registration / event)
│   ├── support/       # 지원 (qna 등)
│   └── worship/       # 예배 (time / live / sermons)
├── community/
│   ├── facilities/
│   ├── group/
│   ├── index/
│   ├── saint/
│   └── world/
├── erp/
│   ├── account/
│   ├── admin/
│   ├── comm/
│   ├── event/
│   ├── facility/
│   ├── humen/         # 인사 (district / manager / newcomer / change)
│   ├── index/
│   ├── ministry/
│   ├── sermon/
│   ├── stats/
│   └── training/
├── mypage/
│   ├── index/
│   └── user/          # profile / password / activity / inquiry / notifications / withdraw
└── system/
    ├── backup/
    ├── config/
    ├── index/
    ├── log/
    └── user/
```

### 3-2. 기능 단위(feature) 파일 구성 규칙

각 기능 폴더는 아래 4종 파일을 기본 세트로 가진다.

```
{Domain}/
├── {Feature}Controller.java
├── {Feature}Service.java
├── {Feature}Mapper.java
└── dto/
    ├── {Feature}Dto.java      # 응답 DTO
    └── {Feature}Request.java  # 요청 DTO
```

**규칙**

- 기능이 단순하면 `dto/` 하위 폴더를 억지로 만들지 않는다.
- 기능이 커지면 `about/pastor`처럼 중분류 하위 기능 폴더를 추가한다.
- `controller/`, `service/`, `mapper/` 같은 역할 기반 하위 폴더는 **만들지 않는다**.

### 3-3. MyBatis XML 위치 규칙

```
src/main/resources/mapper/
├── common/
├── official/
│   ├── about/
│   ├── ministries/
│   ├── news/
│   ├── support/
│   └── worship/
├── community/
├── erp/
├── mypage/
└── system/
```

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

```
frontend/src/
├── main.tsx
├── App.tsx
├── styles/
├── layouts/             # 전역 레이아웃 뼈대
│   ├── MainLayout.tsx
│   ├── SubmenuLayout.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Breadcrumb.tsx
├── router/              # 라우팅 가드 및 도메인별 라우트
│   ├── index.tsx
│   ├── ProtectedRoute.tsx
│   ├── AuthRoutes.tsx
│   ├── OfficialRoutes.tsx
│   ├── CommunityRoutes.tsx
│   ├── ErpRoutes.tsx
│   ├── MypageRoutes.tsx
│   └── SystemRoutes.tsx
├── common/              # 인프라·공통 레이어
│   ├── api/             # axios 인스턴스 등 HTTP 인프라
│   ├── auth/            # 인증 도메인 (authApi / authStore / authHook / authModel / authTypes / login / register)
│   ├── corp/            # 기관정보 도메인 (Footer 주소 등 공통 표시값)
│   ├── board/           # 게시판 공통 (필요 시)
│   ├── chatbot/         # 챗봇 컴포넌트
│   ├── lib/             # 범용 유틸
│   └── menu/            # 메뉴 도메인 (menuApi / menuHook / menuModel / menuStore / menu.types)
├── official/
├── community/
├── erp/
├── mypage/
└── system/
```

### 4-2. 기능 단위(feature) 파일 구성 규칙

각 기능 폴더는 아래 4파일 체계를 기본 세트로 가진다.

```
{domain}/{feature}/
├── {feature}Page.tsx    # 화면 렌더링, Hook 호출
├── {feature}Hook.ts     # 도메인 상태·유스케이스 흐름
├── {feature}Api.ts      # HTTP 호출 캡슐화
└── {feature}Model.ts    # 타입·상수 계약 정의
```

기준 구현체: `frontend/src/official/about/pastor/`

### 4-3. 각 파일 역할 및 금지 사항

| 파일        | 역할                                                       | 금지                                |
| ----------- | ---------------------------------------------------------- | ----------------------------------- |
| `*Page.tsx` | 화면 렌더링, 이벤트 처리, 입력 상태 관리, Hook 호출        | HTTP 직접 호출, 엔드포인트 하드코딩 |
| `*Hook.ts`  | 도메인 상태(`loading/error/data`) 보유, Api 오케스트레이션 | JSX 반환                            |
| `*Api.ts`   | HTTP 호출 캡슐화, 에러 메시지 표준화, 응답 타입 계약       | UI 상태 처리                        |
| `*Model.ts` | 타입·상수 계약 정의                                        | API 호출, 상태 로직                 |

### 4-4. 레이아웃 계층 구조

```
MainLayout          ← 전역 뼈대 (Header / Sidebar / Footer / Chatbot 포함)
└── SubmenuLayout   ← 서브메뉴 영역 (ERP, Mypage 등 2단 네비가 필요한 도메인)
```

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

### 4-6. 라우팅 가드 위치

- `ProtectedRoute.tsx`는 `router/` 폴더에 위치한다 (라우팅 가드 책임).
- 인증 관련 페이지 라우트는 `router/AuthRoutes.tsx`로 분리한다.

---

## 5. API 경로 명명 규칙

```
/api/{domain}/{subdomain}/{feature}
```

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
| `common`              | 완료          | 완료          | auth/menu/chatbot 응집 완료                                                              |
| `official/about`      | 완료          | 완료          | pastor 기준 패턴 확정                                                                    |
| `official/worship`    | 완료          | 완료          | time / live / sermons                                                                    |
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
- [ ] XML 파일을 `src/main/resources/mapper/{domain}/{subdomain}/` 에 생성
- [ ] XML `namespace`를 Java Mapper 인터페이스 경로와 1:1 일치
- [ ] 역할 기반 하위 폴더(`controller/`, `service/` 등) 생성 금지
- [ ] 빌드 통과 확인 (`gradlew compileJava`)
- [ ] 레거시 경로 참조 0건 확인 후 레거시 파일 삭제

### 프런트엔드

- [ ] `{domain}/{feature}/` 하위에 Page / Hook / Api / Model 4파일 세트 생성
- [ ] `*Api.ts`에 HTTP 호출 캡슐화 (엔드포인트 하드코딩 금지)
- [ ] `*Page.tsx`에서 HTTP 직접 호출 금지
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
