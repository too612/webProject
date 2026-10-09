# 시스템 아키텍처 기준

## 목적

이 문서는 프로젝트의 구조적 기준을 정의합니다. 기능을 만들 때 가장 먼저 읽어야 하는 문서입니다.

## 기본 구조

- 백엔드: src/main/java/com/main/app
- 프론트: frontend/src
- 현재 기준 도메인: `official`
- 현재 기준 기능: `official/about/pastor`
- 향후 확장 시, 다른 대분류는 `official` 구조를 복제해 확장합니다.

## 기준 구현

새 기능을 만들기 전 `official/about/pastor`의 실제 파일 배치와 호출 흐름을 먼저 확인합니다.

- 백엔드: `official/about/pastor/{Feature}Controller.java`, `{Feature}Service.java`, `{Feature}Mapper.java`, `dto/`
- mapper: `src/main/resources/mapper/official/about/pastor/{Feature}Mapper.xml`
- 프론트: `frontend/src/official/about/pastor/{feature}Page.tsx`, `Hook.ts`, `Api.ts`, `Model.ts`
- 상세 복붙 템플릿: [official-domain-guide.md](../official/official-domain-guide.md)

## 백엔드 규칙

- 기능 폴더는 역할 기반 하위 폴더를 만들지 않습니다.
- 기본 형식:
  - {Feature}Controller.java
  - {Feature}Service.java
  - {Feature}Mapper.java
  - dto/{Feature}Dto.java
  - dto/{Feature}Request.java
- MyBatis XML은 mapper 경로에 같은 도메인 구조로 둡니다.
- namespace는 Java Mapper 전체 경로와 1:1로 맞춥니다.

## 프론트 규칙

- 신규 기능은 Page / Hook / Api / Model 구조를 기본으로 합니다.
- URL 단위 화면은 List / View / Write 구조를 우선합니다.
- 공통 기능은 frontend/src/common 안에서 재사용합니다.

### 관리 범위와 파일 생성 기준

- 전역 UI 기반은 `common/ui`의 기존 컴포넌트를 우선 재사용합니다. 여러 도메인의 실제 소비 요구와 도메인 중립 계약이 확인될 때 `common`으로 승격하며, 향후 사용 가능성만으로 공통 모듈을 만들지 않습니다.
- 한 화면에 종속된 패널은 해당 기능 폴더에서 관리합니다. 독립적인 상태·수명주기·렌더링 책임이 있으면 컴포넌트를 분리하되, 분리할 때마다 Hook / Api / Model / CSS 파일을 기계적으로 생성하지 않습니다.
- 화면 전용 타입·상수·순수 정책 및 계산 함수는 기존 기능 Model에 우선 모읍니다. 책임이 명확히 달라지거나 별도 소비·검증 경계가 필요한 경우에만 추가 파일로 분리합니다. React 훅·DOM 측정·브라우저 저장소 접근 같은 부수효과는 Model에 넣지 않습니다.
- 데이터 원천이 같아도 조회 화면과 편집 화면의 계약이 다르면 각 응답 모델을 유지합니다. 같은 테이블을 사용한다는 이유만으로 서로 다른 기능의 DTO/API를 통합하지 않습니다.

### 스타일 배치 기준

- 컴포넌트의 단순 스타일은 기존 Tailwind 클래스와 공통 토큰을 우선 사용합니다. 복잡한 선택자·스크롤 상태·안전영역·외부 라이브러리 스타일 등 별도 CSS로 관리할 이유가 있으면 `frontend/src/styles` 하위에 실제 적용 범위를 드러내는 이름으로 배치합니다.
- 화면 전용 CSS는 해당 컴포넌트에서 import하고 도메인/기능 접두어로 선택자 범위를 제한합니다. `styles`에 위치한다고 전역 공용 스타일이 되는 것은 아니며, 일반 CSS는 import 후 전역 선택자로 동작하므로 접두어로 충돌을 방지합니다.
- 전역 기반과 토큰은 `global.css`, 레이아웃은 `styles/layouts`, 도메인 스타일은 기존 도메인 CSS의 책임을 유지합니다. 기존 import 순서·workspace 선택자 범위는 [작업공간 스타일 기준](./workspace-layout.md#스타일과-검증)을 따릅니다.
- 이 기준은 신규 파일과 직접 정리하는 범위에 적용합니다. 기존 파일을 규칙 통일만을 위해 일괄 이동하거나 기능별 빈 파일을 추가하지 않습니다.

## CRUD / 삭제 규칙

- 조회: getInfo
- 생성: setCreate
- 수정: setUpdate
- 삭제: delRemove
- 삭제는 물리 삭제가 아니라 소프트 삭제를 사용합니다.
- 기본 정책: is_deleted = TRUE, is_active = FALSE

## 레거시 규칙

- import/namespace 참조가 0건이면서 빌드가 통과해야 삭제합니다.
- 역할 기반 빈 폴더(controller, service, mapper)를 만들지 않습니다.
