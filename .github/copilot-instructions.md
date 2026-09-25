# 프로젝트 에이전트 지침

## 작업 원칙

- 모든 답변은 한국어로 작성하고, 변경 내용과 검증 결과를 짧고 명확하게 보고한다.
- 사용자가 지정한 파일, 현재 탭, 직접 호출부를 먼저 확인하고 관련 없는 전체 탐색은 피한다.
- 작업 전 [.ai/AI_AUTO_RULES.md](../.ai/AI_AUTO_RULES.md)와 요청에 필요한 문서만 읽는다.
- 먼저 동작 경로를 정리하고, 가장 가까운 기존 구현과 최소 검증 방법을 확인한 뒤 수정한다.
- 불필요한 리팩터링, 주석 추가, 메타데이터 변경, 커밋, 브랜치 생성은 하지 않는다.
- 첫 수정 직후 가장 좁은 관련 검증을 실행하고, 성공 이후에만 인접 영역을 확장한다.

## 문서와 기준 구현

- 문서 인덱스: [docs/md/README.md](../docs/md/README.md)
- 전체 구조: [docs/md/core/system-architecture.md](../docs/md/core/system-architecture.md)
- 공식 도메인 기준: [docs/md/official/official-domain-guide.md](../docs/md/official/official-domain-guide.md)
- 백엔드 기준 구현은 [src/main/java/com/main/app/official/about/pastor](../src/main/java/com/main/app/official/about/pastor/) 부터 확인한다.
- 프론트 기준 구현은 [frontend/src/official/about/pastor/pastorPage.tsx](../frontend/src/official/about/pastor/pastorPage.tsx) → [frontend/src/official/about/pastor/pastorHook.ts](../frontend/src/official/about/pastor/pastorHook.ts) → [frontend/src/official/about/pastor/pastorApi.ts](../frontend/src/official/about/pastor/pastorApi.ts) → [frontend/src/official/about/pastor/pastorModel.ts](../frontend/src/official/about/pastor/pastorModel.ts) 순서로 확인한다.
- 공식 라우팅은 [frontend/src/router/OfficialRoutes.tsx](../frontend/src/router/OfficialRoutes.tsx), 전체 진입점은 [frontend/src/App.tsx](../frontend/src/App.tsx)에서 확인한다.
- 구조, 파일 배치, 메서드명, 경로 규칙은 문서에 중복해 적지 않고 링크를 따라 확인한다.

## 구현 시 확인할 경계

- 새 기능은 DB 메뉴 경로, 라우트, 페이지, API URL이 일치하는지 확인한다. 메뉴와 권한은 코드보다 DB 기준을 우선한다.
- API 변경 전 [src/main/java/com/main/app/common/dto/ApiResponse.java](../src/main/java/com/main/app/common/dto/ApiResponse.java)와 [frontend/src/common/api/api.types.ts](../frontend/src/common/api/api.types.ts)의 `statusCode`, `message`, `data` 계약을 확인한다.
- MyBatis Mapper 인터페이스 메서드와 XML `id`, `namespace`가 Java 전체 경로와 1:1인지 확인한다.
- MyBatis XML 비교 연산자는 XML 문법에 맞게 `!=` 또는 `&lt;&gt;`를 사용한다.
- SQL·seed를 변경하거나 실행하기 전 대상 테이블의 스키마, NOT NULL, FK, 날짜 타입, seed 순서를 확인한다.
- 삭제는 물리 삭제하지 않고 프로젝트의 소프트 삭제 정책을 따른다. 레거시는 참조 0건과 빌드 통과를 확인한 뒤에도 물리 삭제하지 않는다.
- 동일한 Controller 또는 Service 클래스명이 공존하면 bean 이름 충돌 여부를 확인한다.
- `common_code` 또는 공통 API를 수정하기 전 영향 범위와 수정 내용을 사용자에게 먼저 알린다.
- 개발/운영 설정은 [src/main/resources/application-dev.properties](../src/main/resources/application-dev.properties)와 [src/main/resources/application-prod.properties](../src/main/resources/application-prod.properties)를 확인하고 DB 접속 정보나 프로파일을 하드코딩하지 않는다.

## 검증 기준

기본 검증은 다음 순서로 수행한다.

```powershell
.\gradlew.bat compileJava
.\gradlew.bat test
Set-Location frontend; npm run build
```

- 백엔드는 Java 25, Spring Boot 4.0.6, Gradle, MyBatis, PostgreSQL을 사용한다.
- 프론트는 React 18, TypeScript, Vite를 사용한다. 개발 서버는 `Set-Location frontend; npm run dev`로 실행한다.
- SQL·API 변경은 백엔드 컴파일과 실제 호출 응답을 확인하고, 화면 변경은 `npm run build`까지 실행한다.
- 생성 명령의 종료만으로 성공을 단정하지 않는다. 실제 파일 존재 여부, 크기, 시트/행/열, API 응답, 브라우저 결과 등을 직접 확인한다.
- 검증을 실행할 수 없으면 이유와 남은 위험을 반드시 보고한다.

## 작업 체크리스트

- [ ] 지정 파일과 직접 호출부를 먼저 확인했는가?
- [ ] 필요한 문서와 가장 가까운 기준 구현만 읽었는가?
- [ ] 변경 경계가 DB 메뉴·라우트·API 계약과 맞는가?
- [ ] 최소 변경만 적용했는가?
- [ ] 실제 산출물까지 확인하는 좁은 검증을 실행했는가?
