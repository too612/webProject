# 프로젝트 에이전트 지침

## 작업 원칙

- 모든 답변은 한국어로 작성하고, 변경 내용과 검증 결과를 간결하게 보고한다.
- 현재 탭, 사용자가 지정한 파일, 직접 호출부부터 확인한다. 관련 없는 전체 탐색은 피한다.
- 작업 전 [.ai/AI_AUTO_RULES.md](../.ai/AI_AUTO_RULES.md)와 관련 문서만 확인한다.
- 변경 전에 가장 가까운 기존 구현을 먼저 읽고, 동작을 결정하는 코드 경로와 저렴한 검증 방법을 확인한다.
- 최소 변경만 적용한다. 불필요한 리팩터링, 주석, 메타데이터, 구조 변경은 하지 않는다.
- 사용자가 요청하지 않으면 커밋이나 브랜치를 만들지 않는다.
- 첫 수정 직후 가장 좁은 관련 검증을 실행하고, 성공한 뒤에만 인접 영역을 수정한다.
- 변경 후 영향 범위에 맞는 컴파일·테스트·빌드를 실행한다. 실행할 수 없으면 이유와 남은 위험을 보고한다.

## 문서 우선순위

- 핵심 구조 기준: [docs/md/core/system-architecture.md](../docs/md/core/system-architecture.md)
- 공식 도메인 기준: [docs/md/official/official-domain-guide.md](../docs/md/official/official-domain-guide.md)
- 문서 인덱스: [docs/md/README.md](../docs/md/README.md)
- 상세 규칙은 문서에 중복해서 옮기지 말고 위 문서를 링크해 확인한다.

## 기준 구현과 탐색 순서

- 백엔드 기준 구현은 [official/about/pastor](../src/main/java/com/main/app/official/about/pastor/)를 먼저 확인한다.
- 프론트 기준 구현은 [pastorPage.tsx](../frontend/src/official/about/pastor/pastorPage.tsx), [pastorHook.ts](../frontend/src/official/about/pastor/pastorHook.ts), [pastorApi.ts](../frontend/src/official/about/pastor/pastorApi.ts), [pastorModel.ts](../frontend/src/official/about/pastor/pastorModel.ts) 순으로 확인한다.
- 공식 라우팅은 [OfficialRoutes.tsx](../frontend/src/router/OfficialRoutes.tsx), 전체 라우팅 진입점은 [App.tsx](../frontend/src/App.tsx)에서 확인한다.
- 새 기능은 메뉴 DB 경로, 라우트, 페이지, API URL이 서로 일치하는지 확인한다.

이 파일의 내용을 복사하지 않고, 필요한 세부 사항은 위 문서를 직접 확인한다.

## 도메인 규칙

- 백엔드는 [src/main/java/com/main/app](../src/main/java/com/main/app) 아래에서 `common`, `official`, `community`, `erp`, `mypage`, `system` 구조를 유지한다.
- 기능 폴더는 역할 기반 하위 폴더(`controller`, `service`, `mapper`)를 만들지 않고, 하나의 기능 단위로 `Controller`, `Service`, `Mapper`, `dto/`를 구성한다.
- MyBatis XML은 [src/main/resources/mapper](../src/main/resources/mapper) 안에서 같은 도메인 경로에 두고, `namespace`는 Java Mapper 전체 경로와 1:1로 맞춘다.
- 현재는 `official`을 기준으로 구조를 정립하고, 이후 다른 대분류는 이 패턴을 확장한다.
- URL과 메뉴 경로는 DB 메뉴 기준을 최우선으로 본다. 라우팅은 [frontend/src/App.tsx](../frontend/src/App.tsx)와 [frontend/src/router/index.tsx](../frontend/src/router/index.tsx)에서 확인한다.
- 레거시 제거는 물리 삭제 금지 원칙을 지키고, 참조가 0건인지와 빌드 통과 여부를 함께 확인한다.
- 동일한 Controller 또는 Service 클래스명이 공존하면 명시적 bean 이름이 필요한지 확인한다.

## 프런트엔드 / 백엔드 규칙

- 신규 기능은 기본적으로 Page·Hook·Api·Model 구조를 사용한다.
- URL 단위로 목록/상세/작성 화면이 분리되면 List/View/Write 구조를 우선한다.
- 공식 화면은 도메인별 Routes 파일과 `lazy` 로딩 패턴을 따른다.
- API는 [ApiResponse.java](../src/main/java/com/main/app/common/dto/ApiResponse.java)와 [api.types.ts](../frontend/src/common/api/api.types.ts)의 계약을 확인하고, HTTP 상태 코드뿐 아니라 응답의 `statusCode`, `message`, `data`를 함께 확인한다.
- MyBatis Mapper 인터페이스 메서드와 XML의 `id`를 1:1로 맞추고, XML `namespace`는 Java Mapper 전체 경로와 일치시킨다.
- SQL의 snake_case 필드는 resultMap 또는 `AS camelCase`로 DTO 필드에 명시적으로 매핑한다.
- 삭제는 물리 삭제가 아니라 소프트 삭제를 사용한다. 기본 정책은 `is_deleted = TRUE`, `is_active = FALSE`이다.
- 서비스 메서드는 표준 명명 규칙을 따른다: 조회 `getInfo`, 생성 `setCreate`, 수정 `setUpdate`, 삭제 `delRemove`.
- `common_code` 및 공통 API를 수정하기 전에는 영향 범위와 수정 내용을 사용자에게 먼저 알린다.

## 데이터와 환경 주의점

- seed 또는 SQL을 수정·실행하기 전 대상 테이블의 스키마, NOT NULL, FK, date 타입과 참조 seed 순서를 확인한다.
- MyBatis XML에서 `< >` 연산자는 XML 파싱 오류를 일으킬 수 있으므로 `!=` 또는 `&lt;&gt;`를 사용한다.
- 개발·운영 설정은 [application-dev.properties](../src/main/resources/application-dev.properties)와 [application-prod.properties](../src/main/resources/application-prod.properties)를 확인한다. DB 접속 정보와 활성 프로파일을 임의로 하드코딩하지 않는다.

## 검증 기준

```powershell
.\gradlew.bat compileJava
.\gradlew.bat test
Set-Location frontend; npm run build
```

- 백엔드는 Java 25, Spring Boot 4.0.6, Gradle, MyBatis, PostgreSQL을 사용한다.
- 프론트는 React 18, TypeScript, Vite를 사용한다.
- 프론트 개발 서버는 `Set-Location frontend; npm run dev`로 실행한다.
- 테스트 커버리지는 제한적이므로 기능 변경 시 관련 테스트 추가 여부를 별도로 판단한다.
- SQL·API 변경은 백엔드 컴파일과 관련 호출 확인을 우선하고, 화면 변경은 `npm run build`까지 실행한다.

## 작업 시작 체크리스트

- [ ] 현재 파일/호출부와 같은 범위를 먼저 확인했는가?
- [ ] 관련 문서와 기존 구현을 읽고 경계가 맞는가?
- [ ] 영향을 받을 도메인과 동일한 패턴을 따랐는가?
- [ ] 최소 변경만 적용했는가?
- [ ] 변경 후 필요한 빌드/검증을 실행했고 결과를 확인했는가?
