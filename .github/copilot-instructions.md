# 프로젝트 에이전트 지침

## 작업 원칙

- 모든 답변은 한국어로 작성하고, 변경 내용과 검증 결과를 간결하게 보고한다.
- 현재 탭, 사용자가 지정한 파일, 직접 호출부부터 확인한다. 관련 없는 전체 탐색은 피한다.
- 변경 전 요청 유형에 맞는 [.ai/AI_AUTO_RULES.md](../.ai/AI_AUTO_RULES.md)를 확인한다.
- 최소 변경을 적용하고, 요청하지 않은 리팩터링·주석·메타데이터 변경은 하지 않는다.
- 사용자가 요청하지 않으면 커밋이나 브랜치를 만들지 않는다.
- 변경 후 영향 범위에 맞는 컴파일·테스트·빌드를 실행한다. 실행할 수 없으면 이유를 보고한다.

## 변경 안전장치

- 전체 구조와 레거시 제거의 단일 기준은 [SYSTEM-ARCHITECTURE.md](../docs/SYSTEM-ARCHITECTURE.md)다.
- 신규 백엔드·프런트 기능은 기존 도메인과 대표 구현을 먼저 확인한 뒤 같은 경계를 따른다.
- 물리 삭제는 추가하지 않는다. 레거시를 제거할 때는 참조 검색과 빌드 결과를 확인한다.
- `com_code` 또는 공통코드를 변경하기 전에는 사용자에게 변경 예정 내용을 먼저 알린다.
- API 변경 시 HTTP 상태 코드뿐 아니라 응답의 `statusCode`와 `message`도 확인한다.
- 비밀값과 운영 설정은 환경 변수·프로필 설정을 따른다. 코드에 자격 증명을 추가하지 않는다.

## 프로젝트 기준 문서

필요한 작업에 해당하는 문서를 먼저 읽고, 그 내용을 이 파일에 복사하지 않는다.

- 구조·도메인·백엔드 패키지·레거시 기준: [SYSTEM-ARCHITECTURE.md](../docs/SYSTEM-ARCHITECTURE.md)
- Front 기능 구조·API 계약·업로드: [FRONT-FULLSTACK-SPEC.md](../docs/FRONT-FULLSTACK-SPEC.md)
- AG Grid: [GRID_GUIDE.md](../docs/GRID_GUIDE.md)
- 달력: [CALENDAR_GUIDE.md](../docs/CALENDAR_GUIDE.md)
- 권한·메뉴: [AUTH_PERMISSION_RULES.md](../docs/AUTH_PERMISSION_RULES.md)
- YouTube 라이브: [LIVE.md](../docs/LIVE.md)

## 빠른 구조 안내

- 백엔드는 `src/main/java/com/main/app/` 아래 `common`, `official`, `community`, `erp`, `mypage`, `system` 도메인으로 구성된다.
- 백엔드 기능은 기능 폴더 안에 `Controller`, `Service`, `Mapper`, `dto/`를 두며, MyBatis XML은 `src/main/resources/mapper/`의 동일한 기능 경로에 둔다.
- 프런트 진입점과 라우팅은 [frontend/src/App.tsx](../frontend/src/App.tsx), [frontend/src/router/index.tsx](../frontend/src/router/index.tsx)에서 확인한다. 공통 API·UI·Grid·Editor·첨부 모듈은 `frontend/src/common/`에 있다.
- 단순 Front 기능은 Page·Hook·Api·Model 구조를, URL로 목록·상세·작성 화면이 분리되면 List/View/Write 구조를 사용한다. 상세 계약은 [FRONT-FULLSTACK-SPEC.md](../docs/FRONT-FULLSTACK-SPEC.md)를 따른다.

## 실행과 검증

Windows PowerShell에서 저장소 루트를 기준으로 실행한다.

```powershell
.\gradlew.bat compileJava
.\gradlew.bat test
Set-Location frontend; npm run build
.\dev-server-control.ps1 -Action start
.\dev-server-control.ps1 -Action stop
```

- 백엔드는 Java 25, Spring Boot 4.0.6, Gradle, MyBatis, PostgreSQL을 사용하며 기본 포트는 `8080`이다.
- 프런트는 React 18, TypeScript, Vite를 사용하고 개발 서버 기본 포트는 `5173`이다. `/api`, `/data` 프록시는 [frontend/vite.config.ts](../frontend/vite.config.ts)에서 확인한다.
- 실행 전 `SPRING_PROFILES_ACTIVE=dev` 또는 `prod`를 지정한다. 개발 환경에는 PostgreSQL `DEV` 데이터베이스와 `data/` 경로가 필요하며, 라이브 기능에는 YouTube API 설정이 필요하다.
- 통합 개발 서버의 진입점은 [dev-server-control.ps1](../dev-server-control.ps1)다. 프런트 의존성과 실제 스크립트는 [frontend/package.json](../frontend/package.json)을 기준으로 한다.
- 테스트 커버리지는 제한적이므로 기능 변경 시 관련 테스트 추가 여부를 별도로 판단한다.

## 하네스 라우팅

하네스 설계, Agent·Skill·Orchestrator, 보안 검토, SLO, 배포 전략, 인시던트 런북 요청은 [harness-lab.instructions.md](instructions/harness-lab.instructions.md)의 라우팅을 따른다.
