# official 도메인 구조 가이드

## 기준 표준

현재 프로젝트에서 가장 신뢰할 수 있는 표준은 `official/about/pastor` 입니다.
이 구조를 기준으로 다른 기능과 다른 도메인을 확장해야 합니다.

## 표준 원칙

- 기능은 `domain/feature` 구조로 만든다.
- 역할별 하위 폴더(`controller`, `service`, `mapper`)를 만들지 않는다.
- 기능 단위 파일은 아래 형식을 따른다.
- 다른 대분류 도메인은 이 표준을 복제해 확장한다.
- 프론트 기능 경로와 API, Controller, Service, Mapper, XML은 동일한 도메인/기능 이름으로 연결한다.
- 조회 SQL이 같더라도 기능 간 API/Service/Mapper를 공유하지 않고 각 기능의 XML에서 독립 관리한다.
- Mapper Java는 XML 연결 인터페이스로 사용하며 SQL은 어노테이션에 작성하지 않는다.

### 선교 화면 조회 흐름

- `official/training/outreach` → `/api/official/training/outreach/getInfo` → `OutreachController` → `OutreachService` → `OutreachMapper.getInfo` → `mapper/official/training/outreach/OutreachMapper.xml`
- `official/news/mission` → `/api/official/news/mission/getInfo` → `MissionController` → `MissionService` → `MissionMapper.getInfo` → `mapper/official/news/mission/MissionMapper.xml`
- 두 조회 응답은 각각 `ApiResponse<OutreachDto[]>`, `ApiResponse<MissionDto[]>`이며 프론트에서 화면 모델로 변환한다.
- 기존 `/api/official/missionaries` API와 `official/missionary` 백엔드는 제거했다.
- 두 XML은 동일한 인사(`hrm_person`)·발령(`hrm_assignment`)·국가(`sys_country_code`) JOIN을 각각 독립 관리한다. 응답의 `city`, `region`은 실제 파견 지역을 관리하지 않으므로 NULL이다.
- 삭제되지 않은 선교사 파견(`105-030`, 발령 직급 `102-060`) 중 시작일이 오늘 이하, 종료일이 없거나 오늘 이상인 발령을 대상으로 한다. 인물별 발령일 → 등록일시 → 발령키 내림차순으로 최신 한 건을 선택한다. 인사 재직코드 `101-010`이고 퇴직일이 없거나 오늘 이후인 인물, 사용 중인 국가(`use_yn = 'Y'`)만 표시한다.
- 이는 **현재 유효한 파견 중 최신 한 건**이며 전체 최신 발령(면직·휴직 등)을 해석하는 조회가 아니다. 종료 발령과 복수 국가 동시 파견 이력은 표시하지 않는다. 파견 종료 시 종료일 및 인사 재직 상태를 올바르게 관리해야 한다.
- 국가의 `map_latitude`, `map_longitude`는 WGS84 십진수 지도 대표 좌표이며 수도나 실제 사역지를 뜻하지 않는다. 같은 국가의 선교사는 하나의 좌표 그룹에 묶인다. 좌표가 없는 인물도 목록에는 유지하고 지도에서 제외되었음을 안내한다. 비활성 국가는 조회에서 제외하며 이전 국가로 되돌아가 표시하지 않는다.
- 회귀 검증: 루트에서 `.\gradlew.bat test --tests "com.main.app.official.MissionDomainFlowTest"`, 프론트 폴더에서 `node --test tests\official-mission-api.test.mjs`를 실행한다.

### 국가 대표 좌표와 DB 재생성

- [국가 DDL](../../table/sys_country_code.sql)에 선택적 대표 좌표와 위도(-90~90), 경도(-180~180), 두 좌표의 쌍 입력 제약을 둔다. 국가 선택 API의 기존 코드/이름 계약과 발령 테이블 구조는 바꾸지 않는다.
- [국가 seed](../../table/sys_country_code_seed.sql)는 기존 국가/영토 **200개 고유 코드**를 유지한다. 기존 INSERT 202행의 중복 AR/BQ는 `ON CONFLICT DO NOTHING`으로 처리하며 좌표는 코드별 1건만 갱신한다.
- 대표 좌표 출처는 [Google Public Data countries.csv](https://developers.google.com/public-data/docs/canonical/countries_csv)이다. 누락된 AX, BQ, SS는 GeoNames 국가/영토 레코드 [661882](https://www.geonames.org/661882/), [7626844](https://www.geonames.org/7626844/), [7909807](https://www.geonames.org/7909807/)를 사용한다. 2026-10-05 확인 자료이며 CC BY 4.0 출처를 seed와 공개 지도에 표시한다. 수학적 중심 또는 최신 국경/영토의 정확성을 보장하지 않는 현황 표시용 지점이다.
- 좌표를 지도 조회 때마다 외부 API로 검색하지 않는다. 새 국가를 등록할 때만 출처와 좌표를 검증하고 두 값을 함께 저장한다.
- 기존 DB를 재생성할 때는 백업 및 추가 국가/참조 데이터 확인 후 **국가 DDL → 국가 seed → [국가 FK 복구](../../table/sys_country_code_restore_fks.sql)** 순서로 실행한다. 실제 DB 변경은 운영자가 수행한다.
- `DROP ... CASCADE`는 기존 발령·학력 테이블 자체를 삭제하지 않지만 국가 FK를 제거한다. 복구 SQL은 기존 두 테이블이 있으면 누락 FK를 재등록하고 참조값도 검증한다. seed에 없는 사용자 추가 국가가 참조되어 있으면 복구는 오류로 중단되므로 해당 국가를 먼저 복원한다. 다른 환경의 추가 FK·뷰 등 종속 객체는 DROP 전에 확인하고 별도로 복구해야 한다. 인사/발령/학력 테이블을 다시 DROP할 필요는 없다.
- 프론트 폴더에서 `node --test tests\mission-country-sql.test.mjs`로 전체 seed 좌표 매핑과 두 SQL의 동일성을 검증한다. 실제 PostgreSQL 검증은 **별도 폐기 가능한 DB**에 연결하도록 `MISSION_SQL_TEST_PSQL`(psql 실행파일 절대경로)과 `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`를 설정한 후 같은 명령을 실행한다. 지정하지 않으면 DB 실행 테스트는 명시적으로 skip된다. 테스트는 트랜잭션 내 전용 스키마에서 실제 DDL/seed, 기본 5명, 최신/동일일 발령, 종료일 경계, 퇴직, 비활성 국가, 좌표 누락 및 재생성/FK 복구를 검증하고 롤백한다.
- 전체 인사 seed와 별개로 최소 인사 fixture를 사용한다. 기존 `hrm_person_seed.sql`의 날짜 리터럴 이상은 이번 작업 범위에서 수정하지 않는다.

## 예배시간 조회/편집 화면

- [조회 화면](../../../frontend/src/official/worship/time/worshipTimeView.tsx)은 `/worship/time`, [편집 화면](../../../frontend/src/official/worship/time/worshipTimeWrite.tsx)은 `/worship/time/write`를 담당한다.
- 편집 버튼은 작성/수정 권한이 있을 때 표시한다. 편집 URL에 직접 접근하더라도 권한이 없으면 조회 화면으로 돌아간다.
- 기존 항목 추가·수정·순서 변경·삭제 및 전체 삭제 기능을 유지한다. 저장/전체 삭제 성공 시 알림 후 조회 화면으로 돌아가며, 취소 시 변경을 저장하지 않는다. 조회 실패 시 재시도하고, 저장/삭제 실패 시 오류와 편집값을 유지한다.
- 편집은 예배별 접이식 카드로 제공한다. 카드 요약에 예배명·시간·장소를 표시하고, 첫 항목과 새 항목은 자동으로 펼친다. 모두 펼치기/접기, 모바일 세로 입력, 비고 다중 행 입력, 하단 고정 저장/취소 동작을 제공한다.
- 조회 구역은 현재 예배명과의 정확한 일치로 결정된다. `구분` 입력은 조회 구역 선택 기능이 아니며, 명시적인 구역 선택은 별도 데이터 모델 개선이 필요하다.

## 공식 홈 공지 팝업

- [공식 홈 팝업](../../../frontend/src/official/index/officialIndexPopup.tsx)은 기존 공지 조회 응답을 사용한다. DB/API 및 공통 Dialog 계약은 변경하지 않는다.
- 팝업은 공식 홈 전용 패널로 유지하며 범용 `common/popup`을 별도로 만들지 않는다. 조회 모델·팝업 타입·숨김 정책·순수 크기 계산은 [홈 모델](../../../frontend/src/official/index/officialIndexModel.ts)에 모으고, DOM 측정·브라우저 저장소 접근·이미지 상태는 패널에서 관리한다. 배너 관리/편집 모델은 홈 조회 계약과 별도로 유지한다.
- [팝업 CSS](../../../frontend/src/styles/officialIndexPopup.css)는 `styles`에서 관리하되 팝업 컴포넌트에서만 import하고 `official-popup` 선택자 범위를 유지한다. `global.css`에 추가하지 않는다. 전역/화면별 책임과 새 파일 생성 판단은 [프론트 구조 기준](../core/system-architecture.md#관리-범위와-파일-생성-기준)을 따른다.
- 모바일은 한 장씩, 데스크톱은 가용 폭에 맞춰 최대 두 장씩 수동 전환한다. 첫 배너부터 순서대로 묶음을 만들고 현재 배너가 포함된 묶음을 표시하므로 모바일에서 두 번째 배너를 보다가 PC로 바꾸면 첫 두 장을 함께 표시한다. PC·모바일 넘버링은 모두 `페이지 현재 / 전체`로 통일하며 한 묶음이나 단일 배너도 `페이지 1 / 1`로 표시한다. 나머지를 중복 표시해 두 장을 채우지 않는다.
- 홈 팝업 조회의 기존 5건 제한을 제거해 게시된 배너를 관리 순서대로 탐색할 수 있다. 예를 들어 표시 대상이 20건이고 PC에서 두 장씩 들어가면 10페이지로 탐색하며, 중요도에 따른 임의 제외나 자동 전환은 하지 않는다.
- 이미지 원본 비율과 가용 화면 높이로 크기를 계산한다. 모바일은 긴 세로형도 전체 이미지를 축소해 이미지 스크롤 없이 표시하고 카드 폭은 버튼 조작을 위해 유지한다. 긴 이미지의 작은 글씨는 새 탭 상세 링크에서 확인할 수 있다. PC의 긴 세로형은 이미지 내부 스크롤을 유지한다. 일반 모바일의 헤더·하단 버튼·전환 버튼은 화면 안에 유지한다.
- 화면을 채우지 않도록 전체 카드 높이는 화면의 78% 이내(모바일 최대 600px, 데스크톱 최대 640px)로 제한한다. 모바일 폭은 화면의 86%·최대 320px, 데스크톱 전체 폭은 최대 656px·배너별 최대 320px이다. 외곽 라운드는 4px과 약한 그림자로 정돈한다. 팝업 딤/콘텐츠는 사이트 헤더·모바일 메뉴보다 높은 2100/2101 레이어에 표시해 이미지 상단이 가려지지 않게 한다.
- 숨김 정책은 `com_post.popup_dismiss_option` → `BannerItem.dismissOption`의 `NONE / HOURS_4 / DAY / WEEK`를 따른다. `NONE`은 기간 숨김 버튼을 제공하지 않는다. 나머지는 선택 시점부터 4시간·24시간·7일간 숨기며, 배너 ID·정책·만료 시각을 localStorage에 저장해 브라우저 재실행 후에도 유지한다.
- 일반 `닫기`와 전체 닫기는 저장하지 않는다. 정책이 달라지거나 기간이 만료된 기록은 다시 노출한다. 기존 배열 순번 기반 sessionStorage 기록은 ID로 대응할 수 없어 이관하지 않는다.
- 이미지 로드 실패는 재시도와 상세 링크를 제공하고, 저장소 접근 실패는 알림으로 표시한다. 기간 숨김 저장이 실패하면 팝업을 유지하며 일반 닫기는 계속 사용할 수 있다.
- 프론트 폴더에서 `node --test tests\official-popup.test.mjs`, `npx tsc --project tests\official-popup.tsconfig.json --pretty false`, `npx playwright test --config tests\official-popup.playwright.config.ts` 및 `npm run build`로 검증한다. 팝업 UI 테스트는 기존 ERP 테스트 구성과 별도로 실행한다.

## 백엔드 표준

### 경로

src/main/java/com/main/app/official/about/pastor/

- PastorController.java
- PastorService.java
- PastorMapper.java
- dto/
  - PastorDto.java
  - PastorRequest.java

### mapper XML 경로

src/main/resources/mapper/official/about/pastor/

- PastorMapper.xml

### 네임스페이스 규칙

- XML namespace는 Java Mapper 전체 경로와 1:1로 맞춘다.
- 예: `com.main.app.official.about.pastor.PastorMapper`

### 메서드 규칙

- 조회: `getInfo`
- 생성: `setCreate`
- 수정: `setUpdate`
- 삭제: `delRemove`
- 삭제는 물리 삭제가 아니라 소프트 삭제를 사용한다.

## 프론트엔드 표준

### 경로

frontend/src/official/about/pastor/

- pastorPage.tsx
- pastorHook.ts
- pastorApi.ts
- pastorModel.ts

### 구조 규칙

- 화면 단일화면이면 `Page` 중심 구조로 만든다.
- 목록/상세/작성 화면이 나뉘면 `List/View/Write` 구조를 우선한다.
- 공통 로직은 `frontend/src/common`을 확인하고 재사용한다.

## 복붙용 템플릿

### 백엔드 템플릿

```text
src/main/java/com/main/app/official/{domain}/{feature}/
- {Feature}Controller.java
- {Feature}Service.java
- {Feature}Mapper.java
- dto/
  - {Feature}Dto.java
  - {Feature}Request.java
```

### mapper XML 템플릿

```text
src/main/resources/mapper/official/{domain}/{feature}/
- {Feature}Mapper.xml
```

### 프론트 템플릿

```text
frontend/src/official/{domain}/{feature}/
- {feature}Page.tsx
- {feature}Hook.ts
- {feature}Api.ts
- {feature}Model.ts
```

## 실전 사용 방법

1. 표준 구현인 `official/about/pastor`를 확인한다.
2. 같은 패턴으로 새 기능 폴더를 만든다.
3. `Feature` 이름만 바꿔서 파일명을 맞춘다.
4. API 경로와 DB 테이블명을 도메인 구조에 맞게 조정한다.
5. 권한, 메뉴, 라우트는 DB 기준을 우선으로 확인한다.

## 사용 목적

이 문서는 현재 작업의 기준 문서이며, 다른 도메인 확장 시 가장 먼저 복사해서 재사용하는 템플릿입니다.
