# Tailwind CSS 마이그레이션 계획

> **작성일**: 2026-05-05  
> **대상 프로젝트**: `frontend/` (React + TypeScript + Vite)  
> **목표**: 현재 커스텀 CSS 클래스 체계를 Tailwind CSS 유틸리티 클래스로 통일  
> **원칙**: 기존 개별 CSS 파일(`portal.css`, `community.css` 등)은 유지하며 필요 시 override로 활용

---

## 1. 현황 분석

### 1-1. CSS 파일 구조

| 파일                   | 역할                                  | 주요 클래스 네임스페이스                         |
| ---------------------- | ------------------------------------- | ------------------------------------------------ |
| `styles/global.css`    | 전역 리셋, 공통 레이아웃, Auth 페이지 | `.container`, `.header`, `.sidebar`, `.btn-*` 등 |
| `styles/portal.css`    | 교회 메인 포털 전용                   | `.main-visual`, `.visual-*`, `.news-card` 등     |
| `styles/community.css` | 커뮤니티 섹션 전용                    | `.community-*`, `.community-detail-panel` 등     |
| `styles/erp.css`       | ERP 대시보드 전용                     | `.erp-dashboard-wrap`, `.erp-card` 등            |
| `styles/mypage.css`    | 마이페이지 전용                       | `.mypage-*`                                      |
| `styles/system.css`    | 시스템 관리 전용                      | `.sys-*`                                         |

### 1-2. tsx 파일 규모

- 전체 tsx 파일: **약 150개**
- 주요 구분:
  - `layouts/` — 8개 (Header, Footer, Sidebar, Layout 래퍼들)
  - `pages/official/` — 약 40개 (공식 홈, 예배, 부서, 소식 등)
  - `pages/community/` — 약 20개
  - `pages/erp/` — 약 30개 (공유 컴포넌트 포함)
  - `pages/system/` — 10개 (공유 컴포넌트 포함)
  - `pages/mypage/` — 8개
  - `pages/auth/` — 3개
  - `components/` — 15개 (공통 UI 컴포넌트)

### 1-3. 현재 의존 상황 (Tailwind 없음)

```json
// package.json devDependencies — Tailwind 미설치
{
  "vite": "^5.4.19",
  "typescript": "^5.8.3",
  "@vitejs/plugin-react": "^4.3.1"
}
```

---

## 2. 마이그레이션 전략

### 기본 방향

```
[기존]  커스텀 CSS 클래스 (className="community-panel-header")
   ↓
[신규]  Tailwind 유틸리티 클래스 (className="flex items-center justify-between px-6 py-4 bg-white")
   +
[유지]  개별 CSS 파일은 삭제 금지 — Tailwind로 표현 어려운 복잡한 UI나 애니메이션 override에 활용
```

### CSS 파일 처리 방침

| 파일            | 처리 방침                                                      |
| --------------- | -------------------------------------------------------------- |
| `global.css`    | Tailwind base/components로 교체 → 파일은 최소화 유지           |
| `portal.css`    | **유지** — hero 배너 배경 그라데이션 등 복잡한 bg 처리         |
| `community.css` | **유지** — `.community-hero` 그라데이션, 뱃지 등 override 용도 |
| `erp.css`       | **유지** — ERP 대시보드 카드 그림자/그라데이션                 |
| `mypage.css`    | **유지** — 마이페이지 전용 알림 배너 등                        |
| `system.css`    | **유지** — `.sys-hero` 다층 그라데이션 배경                    |

> **규칙**: 개별 CSS에 남기는 클래스는 Tailwind만으로 표현이 어렵거나, 기존 디자인 정체성이 있는 스타일만 유지

---

## 3. 단계별 작업 계획

### Phase 1 — Tailwind 설치 및 기반 구성 (1~2일)

#### 1-1. 패키지 설치

```bash
cd frontend
npm install -D tailwindcss @tailwindcss/vite
```

#### 1-2. vite.config.ts 수정

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ... 기존 server 설정 유지
});
```

#### 1-3. global.css 상단에 Tailwind 지시자 추가

```css
/* styles/global.css 최상단 */
@import "tailwindcss";

/* 기존 스타일은 아래에 유지하되 점진적으로 제거 */
```

#### 1-4. tailwind.config.ts 생성 (커스텀 토큰 정의)

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 사이트 브랜드 컬러 (현재 CSS에서 추출)
        brand: {
          primary: "#5c6bc0", // community/ERP 주조색
          dark: "#2b2f42", // 타이틀 색
          muted: "#6d7589", // 보조 텍스트
        },
        sys: {
          dark: "#113a5c",
          mid: "#1f6f78",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 24px rgba(0,0,0,0.08)",
        panel: "0 2px 8px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        card: "16px",
        panel: "12px",
      },
    },
  },
} satisfies Config;
```

---

### Phase 2 — 공통 레이아웃 컴포넌트 마이그레이션 (2~3일)

> `layouts/` 8개 파일이 모든 페이지에 영향을 미치므로 최우선 처리

| 파일                | 현재 주요 클래스                                                   | 전환 방향                           |
| ------------------- | ------------------------------------------------------------------ | ----------------------------------- |
| `Header.tsx`        | `.header`, `.header-top`, `.header-main`, `.nav-main`, `.dropdown` | Tailwind sticky/flex/z-index        |
| `Footer.tsx`        | `.footer`, `.container`                                            | Tailwind grid/padding               |
| `Sidebar.tsx`       | `.sidebar`, `.sidebar-menu`, `.is-active`                          | Tailwind flex/border-l/bg           |
| `MainLayout.tsx`    | `.app-shell`                                                       | Tailwind min-h-screen flex flex-col |
| `ErpLayout.tsx`     | `.app-shell` 변형                                                  | Tailwind                            |
| `MypageLayout.tsx`  | `.app-shell.mypage-shell`                                          | Tailwind                            |
| `SubmenuLayout.tsx` | `.hero`, `.main-content`, `.content-area`                          | Tailwind                            |
| `AuthLayout.tsx`    | `.auth-layout`                                                     | Tailwind                            |

---

### Phase 3 — 공통 컴포넌트 마이그레이션 (1~2일)

> `components/` 하위 15개 파일 — 재사용 빈도가 높아 완성도가 중요

| 파일                                | 현재 스타일                                      | 전환 방향                         |
| ----------------------------------- | ------------------------------------------------ | --------------------------------- |
| `components/common/Pagination.tsx`  | `community-pagination`, `btn btn-sm`             | Tailwind flex/gap/button          |
| `components/common/SearchBar.tsx`   | `community-search-bar`, `community-search-input` | Tailwind input/ring/focus         |
| `components/common/Breadcrumb.tsx`  | `.breadcrumb-*`                                  | Tailwind flex/text-sm/gap         |
| `components/common/CommentList.tsx` | 커스텀 클래스                                    | Tailwind                          |
| `components/common/FileUpload.tsx`  | 커스텀 클래스                                    | Tailwind                          |
| `components/board/BoardList.tsx`    | `community-*` 테이블 클래스                      | Tailwind table                    |
| `components/board/BoardForm.tsx`    | `community-form*`                                | Tailwind form/input/label         |
| `components/board/BoardView.tsx`    | `community-*`                                    | Tailwind                          |
| `components/chatbot/Chatbot.tsx`    | 커스텀 클래스                                    | Tailwind (fixed position chat UI) |

---

### Phase 4 — 공유 페이지 컴포넌트 마이그레이션 (1~2일)

> `shared/` 폴더의 공유 컴포넌트 — 여러 페이지가 사용

| 파일                                           | 현재 클래스                    | 비고                 |
| ---------------------------------------------- | ------------------------------ | -------------------- |
| `erp/shared/ErpListPage.tsx`                   | `community-*` (이미 교체 완료) | Tailwind로 최종 정리 |
| `erp/shared/ErpPageShell.tsx`                  | 확인 필요                      | -                    |
| `system/shared/SystemListPage.tsx`             | `community-*` (이미 교체 완료) | Tailwind로 최종 정리 |
| `official/shared/OfficialBoardListPage.tsx`    | `community-*`                  | -                    |
| `official/shared/OfficialBoardViewPage.tsx`    | `community-*`                  | -                    |
| `official/shared/OfficialBoardWritePage.tsx`   | `community-*`                  | -                    |
| `official/shared/OfficialEventPage.tsx`        | 확인 필요                      | -                    |
| `official/shared/OfficialSupportInfoPages.tsx` | 확인 필요                      | -                    |

---

### Phase 5 — 섹션별 페이지 마이그레이션 (5~7일)

작업 순서는 의존성이 낮은 섹션부터 진행

#### 5-1. auth 페이지 (3개) — 간단한 폼 UI

- `pages/auth/` — `.login-container`, `.register-container` → Tailwind card

#### 5-2. official 페이지 (약 40개)

- `pages/official/index/` — portal.css와 협력 (hero 배경은 CSS 유지)
- `pages/official/worship/` — community-\* 테이블/폼
- `pages/official/news/` — 목록/뷰/작성 패턴 반복
- `pages/official/ministries/` — 목록/뷰/작성 패턴 반복
- `pages/official/support/` — FAQ, QnA, 위치 페이지

#### 5-3. community 페이지 (약 20개)

- community.css의 그라데이션 hero는 CSS 유지, 나머지 Tailwind

#### 5-4. erp 페이지 (약 30개)

- Phase 2-4에서 공유 컴포넌트 완료 후 나머지 커스텀 페이지 처리
- `erp.css`의 대시보드 카드 스타일은 CSS 유지

#### 5-5. system 페이지 (10개)

- Phase 4에서 공유 컴포넌트 완료 후 나머지 처리
- `system.css`의 sys-hero 다층 그라데이션은 CSS 유지

#### 5-6. mypage 페이지 (8개)

- `mypage.css`의 카드/알림 스타일 유지, 나머지 Tailwind

---

## 4. 클래스 대응표 (마이그레이션 레퍼런스)

### 레이아웃

| 기존 CSS 클래스 | Tailwind 대응                                 |
| --------------- | --------------------------------------------- |
| `.container`    | `max-w-[1200px] mx-auto px-5`                 |
| `.app-shell`    | `flex flex-col min-h-screen`                  |
| `.app-content`  | `flex-1`                                      |
| `.main-content` | `flex gap-6 max-w-[1200px] mx-auto px-5 py-8` |
| `.content-area` | `flex-1 min-w-0`                              |
| `.sidebar`      | `w-56 shrink-0`                               |

### community-\* 패널

| 기존 CSS 클래스           | Tailwind 대응                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `.community-detail-panel` | `bg-white rounded-xl shadow-panel p-6`                                                                                |
| `.community-panel-header` | `flex items-center justify-between mb-6`                                                                              |
| `.community-panel-title`  | `text-xl font-bold text-[#2b2f42]`                                                                                    |
| `.community-panel-desc`   | `text-sm text-[#6d7589] mt-1`                                                                                         |
| `.community-search-bar`   | `flex gap-2 mb-4`                                                                                                     |
| `.community-search-input` | `flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary` |
| `.community-table-wrap`   | `overflow-x-auto`                                                                                                     |
| `.community-detail-table` | `w-full text-sm border-collapse`                                                                                      |
| `.community-th-num`       | `w-12 text-center`                                                                                                    |
| `.community-td-center`    | `text-center`                                                                                                         |
| `.community-td-empty`     | `text-center text-gray-400 py-8`                                                                                      |
| `.community-pagination`   | `flex items-center justify-between mt-4 pt-4 border-t border-gray-100`                                                |
| `.community-total`        | `text-sm text-gray-500`                                                                                               |
| `.community-page-btns`    | `flex items-center gap-2`                                                                                             |
| `.community-page-info`    | `text-sm text-gray-600 px-2`                                                                                          |
| `.community-error`        | `text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3 mb-4`                                                            |
| `.community-badge`        | `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium`                                               |

### 버튼

| 기존 CSS 클래스      | Tailwind 대응                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `.btn.btn-primary`   | `inline-flex items-center gap-1 bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#4e5caf] transition` |
| `.btn.btn-secondary` | `inline-flex items-center gap-1 bg-gray-100 text-gray-700 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-200 transition`                |
| `.btn.btn-sm`        | `px-3 py-1.5 text-sm rounded-lg`                                                                                                      |
| `.btn.btn-danger`    | `bg-red-500 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-red-600 transition`                                                    |

### 헤더/네비게이션

| 기존 CSS 클래스  | Tailwind 대응                                                                          |
| ---------------- | -------------------------------------------------------------------------------------- |
| `.header`        | `sticky top-0 z-50 bg-white shadow-sm`                                                 |
| `.header-top`    | `bg-gray-50 border-b border-gray-100`                                                  |
| `.header-main`   | `border-b border-gray-200`                                                             |
| `.dropdown`      | `relative group`                                                                       |
| `.dropdown-menu` | `absolute top-full left-0 bg-white shadow-lg rounded-lg py-1 hidden group-hover:block` |

---

## 5. 작업 규칙 및 주의사항

### ✅ Tailwind 사용 규칙

1. **유틸리티 우선**: 단순 패딩/마진/색상/폰트는 모두 Tailwind 인라인으로
2. **반복 패턴은 컴포넌트로**: 동일한 Tailwind 조합이 3회 이상 반복되면 컴포넌트 추출 고려
3. **브랜드 컬러**: `tailwind.config.ts`의 `brand.*`, `sys.*` 토큰 사용 (하드코딩 금지)
4. **반응형**: `sm:`, `md:`, `lg:` 접두사 활용 (기존 `.desktop-only`, `.mobile-only` 대체)

### ⚠️ 기존 CSS 유지 규칙

기존 개별 CSS 파일에 **유지해야 하는** 스타일 유형:

| 유형                          | 예시                       | 이유                                                        |
| ----------------------------- | -------------------------- | ----------------------------------------------------------- |
| 다층 그라데이션 배경          | `sys-hero`, `main-visual`  | Tailwind gradient는 단순 2-stop만 지원                      |
| 배경 이미지 + 그라데이션 합성 | `portal.css .main-visual`  | `bg-[url]` + overlay 복잡도 높음                            |
| CSS 애니메이션/keyframes      | 각종 fade/slide 효과       | Tailwind animate-\* 범위 초과                               |
| backdrop-filter blur          | `sys-status` 등            | Tailwind `backdrop-blur-*`로 대체 가능하나 복잡한 경우 유지 |
| 복잡한 pseudo-element         | `::before`, `::after` 장식 | Tailwind content-\* 한계                                    |

### 🚫 금지 사항

- 기존 CSS 파일 **삭제 금지** (덮어쓰기 충돌만 정리)
- Tailwind class에 `!important` 남발 금지 — CSS 특이도 전략으로 해결
- `@apply` 과다 사용 금지 — 필요한 경우에만 (반복 패턴 컴포넌트화 우선)

---

## 6. 예상 일정

| Phase     | 작업 내용                | 예상 기간      |
| --------- | ------------------------ | -------------- |
| Phase 1   | Tailwind 설치 + 설정     | 0.5일          |
| Phase 2   | 공통 레이아웃 8개        | 2~3일          |
| Phase 3   | 공통 컴포넌트 15개       | 1~2일          |
| Phase 4   | 공유 페이지 컴포넌트 8개 | 1~2일          |
| Phase 5-1 | auth 페이지 3개          | 0.5일          |
| Phase 5-2 | official 페이지 ~40개    | 3~4일          |
| Phase 5-3 | community 페이지 ~20개   | 2일            |
| Phase 5-4 | erp 페이지 ~30개         | 2~3일          |
| Phase 5-5 | system 페이지 10개       | 1일            |
| Phase 5-6 | mypage 페이지 8개        | 1일            |
| **총계**  |                          | **약 14~19일** |

---

## 7. 검증 방법

각 Phase 완료 후:

1. **빌드 통과 확인**: `npm run build` 에러 없음
2. **육안 검토**: 주요 페이지 레이아웃 깨짐 없음
3. **반응형 확인**: 모바일/데스크톱 브레이크포인트 동작
4. **CSS 잔재 스캔**: 교체 완료된 Phase의 구 클래스 사용 여부 `Select-String` 확인

---

## 8. 참고 링크

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [@tailwindcss/vite Plugin](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind CSS Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet)
