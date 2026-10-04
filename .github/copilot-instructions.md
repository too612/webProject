# Copilot 지침

## 프로젝트 구조와 요청 흐름

- 백엔드는 Java 25 / Spring Boot 앱이며 진입 패키지는 `src/main/java/com/main/app`, 데이터베이스는 PostgreSQL이다. 기능은 도메인별로 구성하고 MyBatis XML은 `src/main/resources/mapper/` 아래에서 찾는다.
- 프론트엔드는 React 18 / TypeScript / Vite 앱이다. `frontend/src/App.tsx`가 router를 마운트하고 도메인별 route 모듈이 URL과 화면을 연결한다. 기능 코드는 보통 `Page` / `Hook` / `Api` / `Model`로 분리하며, 화면이 나뉘는 기능은 `List` / `View` / `Write` 구조를 사용한다. 공통 UI/API/workspace 기능은 `frontend/src/common`을 먼저 확인한다.
- 새 도메인 기능의 기준은 `official/about/pastor`다. 백엔드 Controller/Service/Mapper/DTO, 대응하는 Mapper XML, 프론트 Page/Hook/Api/Model이 요청의 전체 흐름을 보여준다.
- ERP, 마이페이지, 커뮤니티, 시스템 라우트는 `WorkspaceLayout`을 공유한다. 탭, URL, 저장, 미저장 폼 계약을 바꾸기 전 [workspace-layout.md](../docs/md/core/workspace-layout.md)를 확인한다.

## 빌드 및 테스트

저장소 루트에서 백엔드 명령을 실행한다.

```powershell
.\gradlew.bat compileJava
.\gradlew.bat test
.\gradlew.bat test --tests "com.main.app.common.chatbot.ChatbotTextUtilTest"
.\gradlew.bat test --tests "com.main.app.common.chatbot.ChatbotTextUtilTest.testMethodName"
```

세 번째 명령은 단일 테스트 클래스, 네 번째는 단일 JUnit 메서드를 실행한다. 실제 테스트의 전체 클래스명과 메서드명으로 바꿔 사용한다.

저장소 루트에서 프론트엔드 명령을 실행한다.

```powershell
Set-Location frontend; npm run build
Set-Location frontend; npm run dev
```

`npm run build`는 `tsc -b`와 Vite 프로덕션 빌드를 차례로 실행한다. 프론트엔드 스크립트 목록은 [frontend/package.json](../frontend/package.json)을 기준으로 한다.

## 코드베이스 규칙

- 백엔드 기능 파일은 `FeatureController.java`, `FeatureService.java`, `FeatureMapper.java`, `dto/` 형식을 따른다. Mapper XML은 같은 도메인 경로에 두고, XML `namespace`는 Mapper의 전체 Java 경로와 일치시키며 각 `id`는 Mapper 메서드와 일치시킨다. MyBatis XML 비교 연산자는 `!=` 또는 `&lt;&gt;`를 사용한다.
- 표준 CRUD 메서드명은 조회 `getInfo`, 생성 `setCreate`, 수정 `setUpdate`, 삭제 `delRemove`다. 삭제는 물리 삭제 대신 `is_deleted = TRUE`, `is_active = FALSE` 소프트 삭제를 사용한다. 레거시 코드는 참조가 없고 빌드가 통과하더라도 물리 삭제하지 않는다.
- 프론트 API는 공통 client와 `ApiResponse` 계약(`success`, `data`, `message`, `statusCode`, 선택적 `timestamp`)을 사용한다. 응답을 바꾸기 전 [ApiResponse.java](../src/main/java/com/main/app/common/dto/ApiResponse.java)와 [api.types.ts](../frontend/src/common/api/api.types.ts)를 함께 확인한다.
- 메뉴와 권한의 기준은 DB다. 메뉴 경로, 프론트 route, API URL을 일치시키고 SQL/seed를 수정하기 전 테이블 스키마, NOT NULL/FK 제약, 날짜 타입, seed 순서를 확인한다.
- 같은 경로를 여러 메뉴가 공유할 수 있다. `sys_menu.param`과 URL 쿼리 파라미터를 부분 일치시켜 메뉴를 판별하고, 경로 길이 → param 일치도 → 하위 메뉴 깊이 순으로 우선한다. 네비게이션/사이드바/브레드크럼의 링크는 `buildMenuLink`를 사용해 메뉴 param과 쿼리를 보존한다.
- 공식 페이지의 제목/설명은 `ListPageShell`, `DetailPageShell`, `FormPageShell`이 담당한다. `currentMenu`의 DB 값을 우선하고 화면에서 `PageTitle`, `title`, `description`을 추가하지 않는다. 필요한 경우 route에서 `titleSuffix`와 `actions`만 전달한다.
- 편집 가능한 workspace 폼은 `useWorkspaceDirty`에 변경 여부를 연결하고, 탭 상태와 저장 경계는 workspace 문서를 따른다.
- 새 ERP 목록은 [ERP 목록과 상세 표시 기준](../docs/md/core/workspace-layout.md#erp-목록과-상세-표시-기준)의 필수 조합을 사용한다. 검색·옵션·그리드·상세·폼의 로딩, 재시도, 검증, 모바일, 키보드 동작을 개별 화면에 복제하지 않고 도메인 조건·컬럼·검증 규칙만 선언한다. 공통화 변경 시 `npm run test:erp`, `npm run test:erp:ui`, 프론트 빌드를 실행한다.
- 같은 이름의 Controller/Service가 공존하는지 확인해 Spring bean 이름 충돌을 방지한다. `common_code`나 공통 API를 바꾸기 전에는 영향 범위와 변경 내용을 사용자에게 먼저 알린다.
- 설정을 변경할 때 [application-dev.properties](../src/main/resources/application-dev.properties)와 [application-prod.properties](../src/main/resources/application-prod.properties)를 확인한다. DB 접속 정보, 자격 증명, 실행 profile을 코드에 하드코딩하지 않는다.

## 문서와 작업 방식

- 문서 인덱스: [README.md](../docs/md/README.md)
- 전체 구조: [system-architecture.md](../docs/md/core/system-architecture.md)
- 공식 도메인 기준: [official-domain-guide.md](../docs/md/official/official-domain-guide.md)
- 자동 변환 규칙: [AI_AUTO_RULES.md](../.ai/AI_AUTO_RULES.md)
- 요청에 필요한 문서만 읽고, 수정 전 지정 파일과 직접 호출부 및 가장 가까운 기준 구현을 확인한다. 관련 없는 리팩터링이나 메타데이터 변경, 커밋, 브랜치 생성을 하지 않는다. 범위를 좁혀 변경하고 관련 빌드/테스트를 검증한 뒤 결과와 남은 위험을 간단히 보고한다. 생성 작업은 명령 종료 코드만으로 성공을 단정하지 말고 실제 산출물을 확인한다.
- 답변은 한국어로 작성하고 변경 내용과 검증 결과를 간결하게 정리한다.
