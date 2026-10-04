# 공통 그리드 엑셀 다운로드

인사관리의 `조회 → 신규 등록 → 엑셀 다운로드` 순서로 배치한다. 상세 패널은 대상이 아니다.
프론트는 AG Grid API로 표시 열의 순서·너비와 현재 캐시 행의 서버 조회 참조만 전달한다.
Java는 같은 세션·사용자의 조회 토큰을 검증하고 원본을 재조회한 뒤 Apache POI로 XLSX를 생성한다.
조회 당시와 원본/내부 이미지가 다르면 최신 값으로 대체하거나 일부를 생략하지 않고 전체 다운로드를 중단한다.
외부 URL 등 지원하지 않는 이미지 위치만 예외로 해당 이미지 셀을 비우고 다운로드를 계속한다.
해당 행과 다른 셀·열은 유지하며 제외한 이미지 셀 수를 서버 경고 로그에 남긴다.

## 개발자 사용

공통 진입점은 [frontend/src/common/excel/index.ts](../../../frontend/src/common/excel/index.ts)이다.

```tsx
const excel = useExcelExport();
const source = useMemo<ExcelGridSource<Row>>(() => ({
  scope: excel.scope, id: "staff-grid", sheetName: "직원",
  getRowRef: row => row.excelRef,
  getEmptyToken: () => queryToken.current,
}), [excel.scope]);

<ErpDataGrid excel={source} {...gridProps} />
<ActionButton action="excel" loading={excel.exporting}
  onClick={() => void excel.exportExcel("#staff-grid", "직원목록")} />
```

직접 호출은 `fn_exportExcel("#staff-grid", "직원목록", { scope })`이다.
등록된 ID(또는 `#ID`), `classNames`에 등록한 `.className`을 받으며 대상이 정확히 하나여야 한다.
DOM을 검색하거나 가상화된 셀에서 문자열을 수집하지 않는다.
다중 시트는 같은 부모의 hook/scope를 공유하고 다음처럼 호출한다.

```tsx
excel.exportExcel([
  { target: "#staff-grid", sheetName: "직원" },
  { target: "#department-grid", sheetName: "부서" },
  { target: "#history-grid", sheetName: "이력" },
], "인사자료");
```

방문 후 내부 탭이 언마운트되어도 마지막 유효 조회를 보관한다.
미조회, 조회 중, 오류, 조건 변경, 만료된 대상이 하나라도 있으면 전체 요청을 중단한다.
부모 화면 종료 시 scope를 정리한다. 외부 상태 변경으로 비활성 탭의 조회 조건이 달라지면
`invalidateExcelGrid(scope, id, message)`를 호출해야 한다.

## 다른 도메인 연결

- 서버 도메인 제공자가 `ExcelDataProvider`로 화면 표시 값과 허용 열을 정의한다.
- 목록 API가 `ExcelSnapshotStore.issue`로 조회 토큰을 발급한다.
- 프론트 행에 `{ token, index }`를 연결하고 빈 결과에도 조회 토큰을 보관한다.
- 실제 생성 API는 `POST /api/common/excel/download`이며 로그인 세션이 필수다.
- 숨긴 열은 제외하지만 NO, 상세보기 문구, 배지 표시 값, 지원하는 프로필을 임의 삭제하지 않는다.
  상세보기 버튼 동작이나 상세 패널 자체는 엑셀에 포함하지 않는다.
- 셀 문자열은 수식으로 해석하지 않는다. 프로필은 내부 PNG/JPEG만 지원하며 외부 URL은 요청하지 않는다.
  지원하지 않는 이미지 위치는 빈 셀로 출력한다. 내부 파일의 손상·경로 오류·변경이나
  용량 제한 초과는 이 예외에 포함되지 않으며 기존대로 전체 다운로드를 중단한다.

## 범위와 운영 제한

전체 검색 결과를 추가 조회하는 기능이 아니다. 현재 그리드 캐시에 남아 있는 행 전체가 대상이다.
인사관리 기본 캐시는 50행 × 6블록으로 최대 약 300행이며 캐시에서 제거된 행은 포함되지 않는다.
서버 재검증은 조회 블록 전체 및 총 건수의 변경도 확인하므로 선택하지 않은 행의 변경으로도 중단될 수 있다.

| 설정 (`app.excel.` 접두사) | 기본값 |
| --- | --- |
| max-rows | 파일 전체 데이터 100,000행 |
| max-cells | 헤더 포함 2,000,000셀 |
| max-image-rows | 실제 내부 이미지 포함 파일 전체 데이터 5,000행 |
| max-sheets | 10 |
| max-image-bytes | 개별 2MB |
| max-total-image-bytes | 중복 제거 후 합계 20MB |
| max-text-bytes | UTF-8 텍스트 합계 50MB |
| max-request-bytes | 요청 본문 10MB |
| concurrent-exports | 서버 인스턴스당 2 |
| snapshot-ttl-seconds | 1,800초 |
| max-snapshots-per-session | 256블록 |

한도를 넘으면 잘라내지 않고 오류를 반환한다. 이미지는 최대 2천만 픽셀이다.
동일 이미지 데이터는 재사용하며 SXSSF로 행을 스트리밍하고 임시 파일을 정리한다.
조회 토큰과 재조회 함수는 서버 세션 메모리에 보관하므로 다중 서버에서는 sticky session이 필요하다.
서버 재시작·세션 종료 후 다시 조회해야 한다. 브라우저 취소가 서버 생성 작업을 즉시 중단시키지는 않는다.