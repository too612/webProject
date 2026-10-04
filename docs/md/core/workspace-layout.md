# 작업공간 레이아웃

## 적용 경계

- ERP, 마이페이지, 커뮤니티, 시스템관리 라우트는 [WorkspaceLayout](../../../frontend/src/layouts/workspace/WorkspaceLayout.tsx)을 공유한다. 기존 경로, 메뉴 API와 권한 계약은 유지한다.
- ERP, 마이페이지, 시스템관리는 기존 ProtectedRoute를 유지한다. 커뮤니티는 기존처럼 공개 접근을 허용하며 비로그인 시 작업공간 헤더에 로그인 링크를 표시한다.
- 일반 사이트와 인증 화면은 기존 shared/site 레이아웃을 유지한다. 각 업무 화면의 도메인 스타일은 기존 CSS를 유지한다.
- 다른 그룹에 적용할 때는 basePath, 표시명, 선택적인 menuPresentation을 전달한다. 도메인별 아이콘과 짧은 이름은 해당 라우트가 소유한다.
- 메뉴 링크는 buildMenuLink를 사용하고, 메뉴 경로는 경로 길이, param 부분 일치도, 트리 깊이 순으로 매칭한다.
- 데스크톱에서 메뉴 영역을 접으면 66px 대분류 영역은 유지하고 세부 메뉴 패널만 숨긴다. 대분류나 즐겨찾기를 선택하거나 대분류 영역의 펼치기 버튼을 누르면 패널이 다시 열린다. 모바일은 기존 전체 메뉴 드로어를 사용한다.
- 세부 메뉴 트리는 글자 크기 13px, 기본 줄 높이 28px, 하위 단계별 들여쓰기 16px와 연결선으로 간결하게 표시한다. 하위 메뉴가 있는 항목은 접힌 상태에서 오른쪽 화살표, 펼친 상태에서 아래 화살표를 표시하고, 단일 메뉴는 문서 아이콘으로 구분한다. 아이콘 칸은 모두 24px로 통일해 같은 depth의 메뉴 이름을 정렬한다. 긴 메뉴 이름은 필요 시 줄바꿈한다.

## 탭과 입력 상태

- 탭 키는 경로와 키 순서로 정렬한 쿼리다. 동일 조건은 기존 탭으로 이동하고 다른 조건은 새 탭으로 열린다.
- 최대 8개이며 초과 시 안내만 표시한다. 현재/나머지/전체 닫기를 제공한다.
- 방문한 탭의 콘텐츠와 폼 값은 메모리에만 유지한다. 비활성 탭은 숨기되 언마운트하지 않는다. 복원된 미방문 탭은 선택할 때 로드한다.
- 데이터 입력 폼은 [useWorkspaceDirty](../../../frontend/src/common/workspace/workspaceHook.tsx)에 변경 여부를 전달한다. 저장 성공 후 기준값을 갱신해 미저장 표시를 해제한다. 검색 폼은 미저장으로 취급하지 않는다.
- 설교 작성, 인사 신규 등록, 마이페이지의 내 정보 관리, 비밀번호 변경, 알림 설정, 회원 탈퇴 입력이 연결되어 있다. 새 입력 폼, 에디터, 그리드 편집 기능에도 이 훅을 연결해야 한다.
- 미저장 탭 닫기와 작업공간 이탈은 확인을 받고, 새로고침/브라우저 종료는 beforeunload 경고를 사용한다.
- 현재 메뉴 경로는 콘텐츠 밖의 전역 네비게이션 영역에 표시한다. 이 영역에는 화면 작업 버튼을 배치하지 않는다.
- 비활성 탭의 포털 팝업은 useWorkspaceTab의 active를 확인해 숨긴다. 화면 작업 버튼은 WorkspaceActions로 해당 탭의 콘텐츠 내부 우측 상단에 표시한다. 버튼 대상 영역은 각 WorkspacePanel이 소유하며 전역 네비게이션과 공유하지 않는다. 폼 외부 제출 버튼에는 해당 폼의 고유 ID를 연결한다.

## ERP 목록과 상세 표시 기준

- [인사관리 화면](../../../frontend/src/erp/humen/manager/managerPage.tsx)을 목록 기준 구현으로 사용한다. 화면 제목과 주요 작업은 기존 ListPageShell에 맡기고, 검색·결과·상세는 [공통 shell 조합](../../../frontend/src/common/ui/shell/index.ts)으로 구성한다.
- SearchPanel은 테두리 밖 검색조건 제목과 변경 안내를 제공하고, SearchField는 고유 ID로 라벨과 입력을 연결한다. 조회 버튼은 formId로 검색 폼에 연결해 주요 작업 영역에 배치한다. 인사 화면은 상단 우측에 조회 → 신규 등록 순서와 일정한 간격을 사용하며 초기화 버튼을 제공하지 않는다.
- 공통 영역은 `data-ui`로 식별하며 여러 탭에서 동일한 HTML ID를 사용하지 않는다. 검색항목은 모바일 2열, 충분한 검색영역 폭에서 3열로 배치한다. SearchField의 `width`를 `compact`(10rem), `medium`(14rem), `keyword`(좁은 영역 10rem/넓은 영역 14rem), `range`(20rem)로 선언하고 좁은 영역에서는 줄어든다. 라벨 폭과 반응형 배치를 화면별 CSS로 다시 구현하지 않는다.
- 일반 업무 목록은 입력 중 조건과 적용 조건을 분리하고 조회 버튼 또는 Enter로 일괄 적용한다. 메뉴 쿼리로 전달된 조건은 최초 조회에 적용한다. 같은 조건으로 다시 조회해도 서버 데이터를 갱신한다.
- 검색 접기는 SearchPanel의 기본 동작이며 접혀도 입력값·적용 여부와 외부 조회 버튼을 유지한다. 필요 없는 업무는 `collapsible={false}`로 명시한다. 자동 접기나 검색조건 브라우저 저장은 하지 않는다.
- ResultPanel은 검색결과 제목과 서버 전체 건수를 그리드 위에 표시한다. 건수를 모르면 미확정으로 표시하고 0건으로 대체하지 않는다. 선택 건수는 조회 결과 전체 건수와 별도로 표시한다.
- [ERP 컬럼 헬퍼](../../../frontend/src/common/grid/erpGrid.ts)는 NO와 데이터 의미별 셀 정렬을 제공한다. 코드·상태·날짜는 가운데, 숫자는 오른쪽, 이름·설명은 왼쪽을 기본값으로 한다. NO는 조회·정렬 결과 순번이며 행 식별자로 사용하지 않는다.
- 일반 ERP 탐색은 [ErpDataGrid](../../../frontend/src/common/grid/ErpDataGrid.tsx)를 사용한다. NO, infinite 모드, 50행 블록, 최대 6블록 캐시, 최대 2개 동시 요청, 52px 행 높이, 다중 정렬·컬럼 필터 제외가 기본이다. `onLoadData`, 도메인 고유키를 반환하는 `getRowId`, 모바일 부가 컬럼의 ID 목록 `mobileHiddenColumns`를 반드시 제공한다. NO를 columns에 중복 추가하지 않는다. 검색 시 캐시·스크롤을 초기화하고 이전 조회를 취소한다. 실패는 결과 없음과 구분해 표시하고 재시도를 제공한다.
- [그리드 상태 계약](../../../frontend/src/common/grid/gridModel.ts)의 `onDataStateChanged`는 최초 로딩, 추가 로딩, 준비, 빈 결과, 오류와 미확정 전체 건수를 구분한다. 추가 블록 조회 중에는 조회 버튼을 막지 않는다. 검색·정렬 변경 전 응답은 무시하고, 동시에 요청한 다른 블록의 실패를 성공으로 덮지 않는다. 기존 DataGrid의 boolean 로딩 콜백은 호환용으로 유지한다.
- NO는 그리드 맨 왼쪽에 고정한다. 선택 체크박스와 선택 건수는 일괄 수정 등 실제 후속 작업이 있는 화면에서만 개발자가 명시적으로 추가한다. 인사 조회 화면에는 선택 컬럼·선택 건수·스크롤 안내 문구를 표시하지 않는다. ResultPanel의 actions 확장점은 다른 업무의 선택 작업 등에 유지한다.
- 인사 목록 API는 기존 page/size 응답을 유지하고 허용된 sortField/sortDirection만 서버에 적용한다. 같은 정렬값의 순서는 사번·고유키로 고정한다. 동시 데이터 변경에 대한 조회 스냅샷은 제공하지 않는다. 그룹·집계·확정 결과가 필요한 업무는 별도 조회 정책을 정의하며 infinite 모드를 일괄 강제하지 않는다.
- 인사 목록의 직급과 직위는 별도 컬럼·서버 정렬이다. 좁은 그리드(640px 미만)에서는 NO·성명·사번만 표시하며 부가 정보는 상세에서 확인한다. 컬럼 의미·표시 순서·모바일 제외 여부·서버 정렬 허용 목록은 도메인이 선언하며 공통 코드가 필드명을 추측하지 않는다.
- DetailPanelLayout은 충분한 콘텐츠 폭에서 부모를 조작할 수 있는 오른쪽 분할 조회 패널을 제공한다. 경계는 마우스와 키보드로 조절하며, 확대하거나 콘텐츠 폭이 좁으면 배경을 차단하는 Sheet로 전환한다. 상세 로딩·오류는 패널 내부에 표시하고 닫으면 호출 위치로 포커스를 복귀시킨다. 상세 확대·축소 시 선택한 상세 탭은 유지한다.
- [useGridDetail](../../../frontend/src/common/grid/useGridDetail.ts)의 `gridOptions`와 DetailPanelLayout의 `navigation`을 함께 사용해 행 클릭/Enter, 현재 행 표시, 이전·다음과 포커스 복귀를 연결한다. 이동 범위는 현재 캐시에 있는 바로 인접한 행이며 추가 블록을 자동 조회하지 않는다. 검색·정렬 시 상세를 닫고, 모바일 전환으로 호출 컬럼이 숨겨지면 같은 행의 표시된 핵심 컬럼으로 복귀한다. 원래 행이 캐시에서 사라졌으면 현재 표시된 행으로 복귀한다.
- 인사 신규 등록은 중앙 Dialog를 유지한다. 저장 중에는 입력·닫기를 막고, 미저장 입력이 있으면 취소 확인을 받는다. 비활성 workspace 탭의 포털은 숨긴다. 별도 상세 업무 탭·라우트는 이번 기준 구현에서 추가하지 않는다.
- 등록 폼은 [FormField](../../../frontend/src/common/ui/form/FormField.tsx)로 라벨·필수 표시·`aria-invalid`·오류 설명을 연결한다. 공통 [검증 함수](../../../frontend/src/common/ui/form/formValidation.ts)는 필수 문자열·길이·달력상 유효한 날짜를 지원한다. [인사 검증 규칙](../../../frontend/src/erp/humen/manager/managerValidation.ts)은 도메인에 유지한다. 검증 실패 시 최초 오류 필드로 이동하고, 저장 중 중복 제출을 막으며, 서버 오류는 입력을 보존한 채 안내한다. 성공 시 미저장 상태를 해제하고 목록을 갱신하며 적용 검색조건이 있으면 새 데이터가 보이지 않을 수 있음을 안내한다. 프론트 검증만 믿지 않고 서버에서도 필수값·스키마 길이·날짜를 검증한다.
- 검색조건, 조회 데이터, 상세 내용과 패널 크기는 브라우저 저장소에 저장하지 않는다. 일반 공식 게시판 등의 basic 그리드를 ERP 정책으로 일괄 전환하지 않는다.
- [인사 조회 테스트](../../../src/test/java/com/main/app/erp/humen/manager/ManagerDatabaseTest.java)는 실제 DB에서 읽기 전용으로 블록 연결·정렬·건수와 응답 계약을 검증한다. [서비스 테스트](../../../src/test/java/com/main/app/erp/humen/manager/ManagerServiceTest.java)는 조회 조건 전달, 정렬 허용 목록과 페이지 범위를 검증한다.

### 새 ERP 목록의 필수 조합

| 책임 | 공통 요소 | 화면에서 선언할 내용 |
| --- | --- | --- |
| 제목·작업 | ListPageShell + [ListPageActions](../../../frontend/src/common/ui/shell/ListPageActions.tsx) | 검색 폼 ID, 등록 동작, 실제 승인된 권한값 |
| 검색 적용 | [useSearchQuery](../../../frontend/src/common/ui/useSearchQuery.ts) + SearchPanel/SearchField | 초기 메뉴 조건, 조건 비교·정규화, 항목별 폭 |
| 선택 옵션 | [useAsyncResource](../../../frontend/src/common/ui/useAsyncResource.ts) + [CodeSelect](../../../frontend/src/common/ui/CodeSelect.tsx) + [AsyncFeedback](../../../frontend/src/common/ui/AsyncFeedback.tsx) | 안정적인 loader, 오류 메시지, 옵션 코드·명칭 |
| 목록 | ErpDataGrid + ResultPanel | 안정적인 조회 함수, 컬럼 정의, 고유키, 모바일 부가 컬럼 ID, 서버 건수 |
| 상세 | useGridDetail + DetailPanelLayout | 선택 행, 조회·닫기 동작, 상세 내용과 제목, 조회 변경 키 |
| 등록 | FormField + 도메인 검증 + useWorkspaceDirty | 필드 규칙, 요청 정규화, 미저장 기준, 저장 성공·실패 처리 |

- loader는 모듈 함수 또는 `useCallback`으로, columns는 `useMemo`로 안정화한다. 매 렌더마다 새 조회 함수를 만들면 캐시가 재생성된다. `useSearchQuery.revision`을 조회 함수의 의존성에 넣어 같은 조건의 재조회·저장 후 갱신도 수행한다.
- useAsyncResource는 로딩·오류·재시도·요청 취소·늦게 도착한 응답 무시를 제공한다. 옵션 로딩/실패 시 해당 선택 입력을 비활성화하고 AsyncFeedback을 표시한다. 빈 옵션 배열로 실패를 숨기지 않는다. CodeSelect는 가시적 라벨과 연결하고 긴 선택값의 전체 명칭을 툴팁으로 제공한다.
- ListPageActions는 조회 → 신규 등록 순서와 간격을 제공한다. `searchAllowed`/`createAllowed`는 표시 정책일 뿐 서버 인가를 대체하지 않는다. DB에 연결된 프로그램 권한이 확인된 화면만 실제 권한값과 API 인가를 함께 연결한다. 인사 화면의 기존 권한 정책은 유지하며 임의 프로그램 ID·역할을 추가하지 않는다.
- 전역화 대상은 **표시·동작 규칙**이며 업무 데이터가 아니다. 검색·옵션·폼·상세 상태는 화면 인스턴스에 유지하고 전역 저장소에 개인정보를 옮기지 않는다. 공식 게시판이나 기존 basic/client 그리드는 이 프리셋으로 강제 이전하지 않는다.
- 조합과 콜백의 실제 예제는 [인사 화면](../../../frontend/src/erp/humen/manager/managerPage.tsx)과 [인사 훅](../../../frontend/src/erp/humen/manager/managerHook.ts)을 기준으로 한다. 새로운 ERP 목록은 개별 스타일·로딩·행 클릭 로직을 복사하는 대신 위 조합으로 시작한다.

### 반복 검증

프론트엔드 디렉터리에서 실행한다. Windows PowerShell 실행 정책이 npm 스크립트를 차단하면 `npm.cmd`를 사용한다.

```powershell
npm.cmd run test:erp
npm.cmd exec playwright -- install chromium
npm.cmd run test:erp:ui
npm.cmd run build
```

- Chromium 설치는 테스트 런타임 최초 준비 시 필요하다. UI 테스트는 Node 20 이상을 사용한다. 테스트 설정이 전용 서버(기본 5187 포트)와 임시 Vite 캐시를 시작·종료하므로 기존 5173 개발 서버를 재사용하거나 캐시를 변경하지 않는다. 포트 충돌 시 `ERP_TEST_PORT` 환경 변수로 테스트 포트만 바꾼다.
- [공통 계약 테스트](../../../frontend/tests/erp-standard.test.mjs)는 검증 경계, 오류 계약, 연속 NO, 동시 요청·정렬 경쟁·요청 취소와 접근성 마크업을 검증한다.
- [브라우저 회귀 테스트](../../../frontend/tests/manager.ui.spec.ts)는 검색 옵션 실패·재시도, 수동 적용·접기·0건 결과, 추가 로딩 중 재검색, 서버 정렬, 모바일 2열·핵심 컬럼·긴 명칭, 상세 이동·크기 조절·확대·포커스, 메뉴 조건별 탭 상태와 비활성 포털 차단, 등록 오류·중복 제출·성공 안내·미저장 취소를 검증한다. 인증·API는 각 격리된 브라우저 컨텍스트에서 가짜 데이터로 대체하므로 실제 DB에 등록하지 않는다. 실제 DB 정렬·응답은 위 읽기 전용 백엔드 테스트로 별도 확인한다.

## 브라우저 저장 정책

- 키는 workspace:v1, 사용자 ID, basePath로 분리한다. 다른 계정이나 다른 그룹의 설정을 읽지 않는다.
- localStorage에는 즐겨찾기 메뉴 ID, 숨긴 대분류 ID, 메뉴 영역 접힘 설정만 저장한다.
- sessionStorage에는 열린 탭의 URL과 활성 URL만 저장한다. 새로고침 시 기본 경로에서 마지막 활성 탭을 복원하고, SPA에서 다른 화면으로 나갔다가 그룹 기본 경로로 재진입하면 기존 탭을 비우고 그룹 홈을 표시한다. 직접 업무 URL로 진입하면 해당 URL을 우선한다. 그룹별 열린 탭, 즐겨찾기, 메뉴 접힘 설정은 서로 섞이지 않는다.
- 저장 가능한 쿼리는 page, size, sort, type, category, view, status, tab, year, month다. 그 외 조건은 실행 중에 유지하지만 저장/복원 대상에서 제외한다. 새로운 조건은 보안 검토 후 workspaceModel의 허용 목록에 추가한다.
- 폼 입력값, 검색어, 개인정보, 인증 토큰, 미저장 표시, 서버 데이터, 파일은 작업공간 저장소에 넣지 않는다. 새로고침하면 미저장 입력은 복원되지 않는다.
- URL에 없는 페이지 내부 상태는 새로고침 복원 대상이 아니다. 기존 화면의 URL 해석과 API 요청 로직은 변경하지 않는다.
- 손상된 데이터, 외부 URL, 다른 그룹 경로, 중복 탭과 8개 초과 데이터는 복원 시 걸러낸다. 저장소가 차단되면 안내 후 메모리 상태로 동작한다.
- 설정은 해당 브라우저의 계정별 로컬 설정이다. 다른 기기나 계정 간 동기화, 백엔드/DB 저장은 구현하지 않는다.

## 기존 API 경계

- 이번 적용은 프론트 작업공간 확장이다. 백엔드, DB, 계정 권한 정책은 변경하지 않는다.
- 마이페이지의 프로필, 비밀번호, 알림, 탈퇴 API는 현재 서버 호출 없이 완료되는 기존 임시 구현을 유지한다. 작업공간의 저장 완료 표시와 미저장 해제는 이 기존 계약에 연결되어 있으며, 실제 계정 정보를 서버에 저장하려면 별도 백엔드 연결 작업이 필요하다.
- 비밀번호와 탈퇴 확인 입력은 성공/취소 시 메모리 상태에서 정리하며 작업공간 브라우저 저장소에는 저장하지 않는다.

## ERP 홈 대시보드 데이터

- [ERP 홈](../../../frontend/src/erp/index/erpIndexPage.tsx)은 [index Mapper](../../../src/main/resources/mapper/erp/index/ErpIndexMapper.xml)를 통해 [인사 기본정보](../../table/hrm_person.sql), [조직](../../table/hrm_department.sql), [공통코드](../../table/com_code.sql)의 실제 집계만 표시한다. 대시보드 응답에는 이름·생년월일 등 개인 식별 정보를 포함하지 않는다.
- 전체 등록 인원은 인사 기본정보 전체, 활성 인원은 재직구분 `101-010`, 운영 조직은 사용여부 `Y` 기준이다. 신규 등록과 최근 6개월 추이는 `reg_dtm` 기준이며 입사일이나 새가족 방문일을 의미하지 않는다. 등록이 없는 월도 0건으로 반환한다.
- 재직구분과 고용형태 차트는 전체 등록 인원 기준이며 명칭은 DB 공통코드를 조회한다. 조직별 현황은 활성 인원 기준으로 집계하며 차트에는 상위 8개, 표에는 전체 집계를 표시한다.
- 차트 클릭은 인사 목록으로 연결한다. 재직구분·고용형태는 해당 조건을, 조직은 부서와 재직 조건을 함께 전달한다. 등록 추이는 인사 목록에 기간 필터가 없으므로 전체 목록으로만 이동한다. 미분류 항목도 별도 미분류 필터가 없어 전체 목록으로 이동한다.
- `erp_member`, `erp_offering`, `erp_expense`, `erp_attendance`, `erp_worship`는 이 대시보드의 데이터 원천으로 사용하지 않는다. 재정·출석·설교 현황은 실제 스키마 및 데이터가 확인된 후 별도로 연결해야 한다.
- [DB 회귀 테스트](../../../src/test/java/com/main/app/erp/index/ErpIndexDatabaseTest.java)는 프로젝트에 설정된 DB에서 읽기 전용으로 API의 조회 경로, 요약값, 6개월 구간과 분류별 합계를 검증한다. 스키마나 seed를 생성·변경하지 않는다.

## 스타일과 검증

### 시스템 첫 진입 대시보드

- [시스템 홈](../../../frontend/src/system/index/systemIndexPage.tsx)은 기존 [index API](../../../src/main/java/com/main/app/system/index/SystemIndexController.java)와 [Mapper XML](../../../src/main/resources/mapper/system/index/SystemIndexMapper.xml)을 확장한다. `source=LIVE`로 실제 `sys_menu`, `sys_program`, `sys_role`, `sys_role_program_permission`, `com_code`만 읽으며 XML 데모는 사용하지 않는다. 기존 게시판 기반 계정·경고·백업 지표와 고정 정상 운영 표시는 제거한다.
- 등록 메뉴는 그룹 포함 전체 행이며 경로 지정 수를 함께 표시한다. 프로그램은 미사용 포함 전체, 사용 역할은 `is_active=true`, 사용 코드는 `use_yn='Y'`이며 루트도 포함한다. 해당 테이블에는 별도 삭제 플래그가 없고 미사용 설정을 활성 집계에서만 제외한다. 사용자 이름·연락처·사용자 식별키는 조회하지 않는다.
- 최근 6개월 등록 추이는 DB 시간대의 `reg_dtm` 기준으로 미사용 포함 코드·프로그램을 집계하고 빈 월도 0건으로 반환한다. 기간은 시작 월 1일부터 현재 월 다음 달 1일 미만이다. 프로그램 구성비의 합계는 전체 프로그램 수, 각 추이 합계는 해당 기간 수와 일치한다. 한 응답의 조회는 읽기 전용 repeatable-read 트랜잭션으로 묶는다.
- 역할별 조회/등록 허용 수는 사용 역할·사용 프로그램·`is_open=true`인 권한 기준이다. 역할 간 같은 프로그램이 중복될 수 있으며 사용자 수나 실효 사용자 권한을 의미하지 않는다. 차트는 정렬순 앞 8개, 표는 전체 사용 역할을 표시하고 등록 권한 비율의 분모는 사용 프로그램 전체다.
- 최근 설정은 메뉴·코드·역할·프로그램의 `upd_dtm`, 없으면 `reg_dtm` 기준 최신 8건이며 감사 로그가 아니다. 바로가기와 차트/기록 이동은 현재 시스템 메뉴와 `buildMenuLink`를 사용한다. 대상 Hook에서 URL 필터를 지원하지 않으므로 새로운 조건/상세 ID를 만들지 않고 전체 관리 화면으로 이동한다. 기존 관리 화면 일부는 참조 데이터 목록이므로 실제 대시보드와 원천이 다를 수 있음을 화면에도 표시한다.
- [DB 테스트](../../../src/test/java/com/main/app/system/index/SystemIndexDatabaseTest.java)는 기존 프로파일/datasource로 테이블·컬럼 존재, 실제 SQL 매핑, 기간 및 집계 합계를 읽기 전용으로 검증한다. 프론트 응답 타입·집계 합계·기간 검증은 index Model/API에서 수행한다. SQL 실패를 0이나 데모로 바꾸지 않으며 화면에 오류와 재시도를 제공한다.

### 마이페이지 첫 진입 대시보드

- [마이페이지 홈](../../../frontend/src/mypage/index/mypageIndexPage.tsx)은 기존 [index API](../../../src/main/java/com/main/app/mypage/index/MypageIndexController.java)와 [Mapper XML](../../../src/main/resources/mapper/mypage/index/MypageIndexMapper.xml)을 확장한다. 화면은 `mode=DEMO`로 고정하며 데이터 선택 대신 다시 불러오기 버튼을 제공한다. 기존 API의 `LIVE` 조회는 서버 세션의 사용자와 `board.rqst_id`가 일치하는 기록만 조회하며, 작성자 식별키·연락처는 반환하지 않는다.
- 전체 작성 기록에는 문의 `QNA`가 포함된다. 구성비는 문의와 그 외 게시글로 중복 없이 나누며, 월별 추이와 기간 KPI는 DB `ins_dt` 기준 이번 달 포함 6개월(시작 포함, 다음 달 시작 제외)이다. 삭제·활성 컬럼은 현재 실제 `board` 스키마에 없으므로 별도의 상태를 추정하지 않는다.
- 실제 DB의 테이블·컬럼을 읽기 전용으로 확인했으며 현재 게시글은 0건이다. 화면은 실제 기록 대신 XML CTE에서 비식별 가상 기록 24건(월별 4건, 문의 6건)을 생성하며 각 KPI·차트·최근 목록에 데모 표시를 한다. 데모도 기존 로그인 정책을 유지하고 SQL 실패 시 자동 대체하지 않는다.
- 차트·최근 기록은 기존 메뉴의 `buildMenuLink`를 사용해 활동/문의 전체 목록으로 이동한다. 대상 목록은 기간·분류 필터를 지원하지 않아 임의 쿼리나 상세 ID를 만들지 않는다. 프로필·비밀번호·알림 입력 화면은 기존 임시 구현으로 서버 저장 미연결 안내를 표시한다. 알림 수·일정 등 원천이 없는 지표는 표시하지 않는다.
- [읽기 전용 DB 테스트](../../../src/test/java/com/main/app/mypage/index/MypageIndexDatabaseTest.java)는 실조회와 XML 데모, 6개월 구간·합계·인증 식별자 필수 조건을 검증한다. HTTP 성공 응답과 화면 상호작용은 실제 로그인 세션에서 `/api/mypage/index?mode=LIVE` 및 `mode=DEMO`로 확인한다. 인증 우회나 seed 실행은 하지 않는다.
- 조회 실패는 서버 메시지와 응답 검증 오류를 보존하고 단일 오류 화면에서 재시도와 로그인 확인 링크를 제공한다. 대시보드 조회 실패만으로 전역 로그인 상태를 삭제하지 않는다. 데모도 같은 서버 인증 정책을 적용한다.
- 공통 모델 속성 조회와 인증 확인(`/auth/check`, `/auth/me`), 마이페이지 index는 `getSession(false)`로 기존 세션만 읽는다. 공개 조회가 새 익명 세션 쿠키를 발급해 로그인 쿠키를 덮어쓰지 않도록 한다. 로그인·인증코드 발급의 세션 생성과 명시적 로그아웃은 유지한다. [세션 회귀 테스트](../../../src/test/java/com/main/app/common/auth/SessionReadTest.java)로 세션 미생성 및 기존 세션 보존을 검증한다.

### 공동체 첫 진입 대시보드

- [공동체 홈](../../../frontend/src/community/index/communityIndexPage.tsx)은 [index Mapper](../../../src/main/resources/mapper/community/index/CommunityIndexMapper.xml)의 실제 `board` 조회를 사용한다. `sys_menu`에서 분류명과 `param`을 조회하고 기존 `buildMenuLink`로 목록 링크를 생성한다. 기존 회원 수·가상 게시글 수·갤러리·공지·운영시간 표시는 제거했다.
- 기존 목록 Mapper와 일치하는 13개 게시판 분류 중 `secret = 'N'`이고 비밀번호가 없는 글만 포함한다. 현재 DB의 `board`에는 삭제·활성 컬럼이 없음을 확인했다. 작성 계정은 고유 작성 참여자 집계에만 사용하고 응답에는 계정·레코드 식별자·본문·연락처를 포함하지 않는다.
- 전체 공개 글, 이번 달 공개 글, 고유 작성 참여자(전체 회원 수가 아님), 공개 글 누적 조회수를 표시한다. 음수 조회수는 0으로 정규화한다. 최근 6개월은 DB 현재 월을 포함한 6개 달, 등록일 기준이며 종료일은 다음 달 1일 미포함이다. KPI·차트·분류별 표는 동일 공개 기준을 사용한다.
- 응답의 `source = LIVE`는 모든 위젯이 실데이터임을 뜻한다. XML 데모 데이터는 사용하지 않으며 실제 0건은 빈 차트·최근 목록과 0값으로 표시한다. API 실패는 0값으로 치환하지 않고 오류와 재시도를 제공한다.
- 기존 목록은 URL 기간 필터를 지원하지 않으므로 모든 차트와 최근 글은 분류의 전체 목록으로만 이동한다. 추이의 점은 가장 최근 공개 글의 분류 목록으로 이동하며 공개 글이 없으면 클릭하지 않는다. 가짜 상세 ID와 미지원 필터를 만들지 않는다.
- [읽기 전용 DB 테스트](../../../src/test/java/com/main/app/community/index/CommunityIndexDatabaseTest.java)는 기존 datasource/profile로 원천 컬럼, 공개 글 집계, 6개월 구간과 위젯 합계를 검증한다. 운영 프로파일의 기존 API 인증 정책은 변경하지 않는다. 스키마·seed 변경은 없다.

- global.css는 기본 스타일과 기존 공통 기반을 유지하고, layouts CSS를 import한다.
- 기존 레이아웃 CSS는 shared, site, shared-footer, shared-responsive 순서로 분리했다. 푸터와 반응형을 별도 파일로 둔 것은 기존 레이아웃 간 선언 순서를 유지하기 위해서다.
- workspace.css의 모든 선택자는 .workspace 영역에 한정한다. ERP 업무 화면 스타일은 erp.css의 data-workspace=/erp 영역에 둔다.
- frontend에서 npm run build로 검증한다. 브라우저에서는 네 그룹의 직접 URL 및 최초 홈, 일반 사이트, 커뮤니티 공개 접근, 보호된 그룹의 로그인 이동, 조건별 탭/폼 격리, 8개 제한, 미저장 닫기, 저장 성공, 그룹별 복원, 메뉴 검색/설정, 모바일 메뉴/탭을 확인한다.
