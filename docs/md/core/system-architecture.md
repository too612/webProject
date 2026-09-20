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
