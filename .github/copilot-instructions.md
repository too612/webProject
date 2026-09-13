# 역할 및 응답 규칙

- 모든 답변은 한국어로 작성한다.
- 요청한 핵심 작업만 수행하고, 장황한 개념 설명은 생략한다.
- 답변은 요약(3줄 이내)과 변경된 코드 블록만 제공한다.

# 프로젝트 에이전트 지침

## 응답과 작업 범위

- 모든 답변은 한국어로 작성하고, 요청한 작업과 검증 결과만 간결하게 제시한다.
- 사용자가 요청하지 않으면 커밋이나 브랜치를 만들지 않는다.
- 현재 탭, 명시된 파일, 해당 호출부를 우선 확인하고 관련 없는 전체 탐색은 피한다.
- 최소 변경을 적용한다. 요구하지 않은 리팩터링이나 설명용 주석을 추가하지 않는다.
- 리팩터링·버그·신규 기능·분석·복구·테스트·문서화 요청은 먼저 [.ai/AI_AUTO_RULES.md](../.ai/AI_AUTO_RULES.md)를 확인한다.

## 구조와 API

- 패키지 및 파일 배치는 [SYSTEM-ARCHITECTURE.md](../docs/SYSTEM-ARCHITECTURE.md)를 기준으로 한다.
- 백엔드는 `src/main/java/com/main/app/`, MyBatis XML은 `src/main/resources/mapper/` 아래에 동일한 도메인 구조로 둔다.
- 기능별로 Controller, Service, Mapper, DTO를 배치한다. `controller/`, `service/`, `mapper/` 역할 전용 하위 폴더는 만들지 않는다.
- Front 기능은 [FRONT-FULLSTACK-SPEC.md](../docs/FRONT-FULLSTACK-SPEC.md)의 2.4절에 따라 4파일 Page 방식 또는 6파일 List/View/Write 방식을 선택한다. Hook, Api, Model은 항상 분리한다.
- 표준 메서드명은 `getInfo`, `getList`/`getPage`, `setCreate`, `setUpdate/{id}`, `delRemove/{id}`를 사용한다.
- MyBatis XML의 `namespace`는 Mapper 인터페이스의 전체 경로와 일치시킨다. XML 비교 연산자는 `!=` 또는 `&lt;&gt;`를 사용한다.
- 물리 삭제 대신 소프트 삭제를 사용하고 모든 조회에 삭제 제외 조건을 포함한다. Unique 인덱스가 있는 테이블은 삭제 후 재등록 충돌을 방지한다.
- `com_code` 또는 공통코드를 수정하기 전에는 사용자에게 변경 예정 내용을 먼저 알린다.

## Frontend

- React 18 + TypeScript + Vite, Zustand, Radix UI/shadcn/ui, Lucide React를 사용한다.
- 전역 상태는 Zustand, 화면 상태는 React state/Hook으로 관리한다. 비동기 유스케이스는 `featureHook.ts`의 `loadXxx`, `saveXxx`, `removeXxx`로 캡슐화한다.
- AG Grid는 [GRID_GUIDE.md](../docs/GRID_GUIDE.md), 달력은 [CALENDAR_GUIDE.md](../docs/CALENDAR_GUIDE.md)를 먼저 확인한다.
- 파일 업로드는 `request` JSON Blob(`application/json`)과 `files` 반복 키를 사용하며, `fileUsage`는 `editor` 또는 `attachment`로 구분한다.
- 권한 기능은 [AUTH_PERMISSION_RULES.md](../docs/AUTH_PERMISSION_RULES.md), 라이브 기능은 [LIVE.md](../docs/LIVE.md)를 따른다.

## 실행과 검증

Windows PowerShell에서 저장소 루트를 기준으로 실행한다.

```powershell
./gradlew.bat compileJava
./gradlew.bat test
Set-Location frontend; npm run build
./dev-server-control.ps1 -Action start
./dev-server-control.ps1 -Action stop
```

- 백엔드는 Java 25, Spring Boot 4.0.6, PostgreSQL이며 기본 포트는 `8080`이다.
- Front 개발 서버는 `5173`이며 Vite가 `/api`, `/data`를 `http://localhost:8080`으로 프록시한다.
- 실행 전 `SPRING_PROFILES_ACTIVE=dev` 또는 `prod`를 지정한다. 라이브 기능에는 `YOUTUBE_API_KEY`가 필요하다.
- 개발 실행 전 PostgreSQL `DEV` 데이터베이스와 필요한 접속 환경 변수를 확인한다. 업로드 경로는 저장소 루트의 `data/`다.
