# Grid Guide

## 1. 개요 및 목적

이 문서는 프로젝트에서 공통으로 사용하는 `common/grid` 컴포넌트의 사용법과 아키텍처를 설명합니다.

`common/grid`는 AG Grid를 기반으로 한 **재사용 가능한 DataGrid 컴포넌트**로, 게시판부터 ERP 대용량 데이터까지 다양한 화면에서 일관된 UX와 성능을 제공합니다.

### 1.1. 왜 AG Grid인가?

- **대용량 데이터 처리**: 가상 스크롤링(Virtual Scrolling)으로 10만 건 이상도 부드럽게 렌더링
- **풍부한 기능**: 정렬, 필터, 컬럼 리사이즈/이동, 셀 렌더링 커스터마이징 등 내장
- **React 친화적**: React 생태계와 완벽하게 통합되며, `cellRenderer`로 JSX 자유롭게 사용 가능
- **무료(MIT)**: Community 버전으로 충분한 기능 제공, 상업적 사용도 무료

### 1.2. 이 컴포넌트가 해결하는 문제

| 문제 | 해결 방식 |
| :--- | :--- |
| 매 페이지마다 테이블 HTML 복사-붙여넣기 | `DataGrid` 컴포넌트 하나로 모든 목록 처리 |
| 디자인 불일치 | `gridTheme.css`로 일관된 디자인 시스템 적용 |
| 정렬/필터 로직 중복 | 모드별(`basic`/`server`/`infinite`/`client`) 분기 처리로 중복 제거 |
| 성능 이슈 | AG Grid의 가상 스크롤링과 Infinite 모드로 대응 |

---

## 2. 설치 및 설정

### 2.1. 패키지 설치

프로젝트 `frontend/` 디렉토리에서 실행:

```bash
npm install ag-grid-react ag-grid-community
```

### 2.2. 파일 구조

```
frontend/src/
├── common/grid/
│   ├── index.ts          # 외부 노출
│   ├── grid.tsx          # 메인 컴포넌트
│   └── gridModel.ts      # 타입 정의
└── styles/
    └── gridTheme.css     # Tailwind 통합 테마
```

### 2.3. 전역 설정 (이미 완료)

- `gridTheme.css`는 `src/styles/`에 위치하며, AG Grid의 CSS 변수를 오버라이드하여 Tailwind 디자인 시스템과 통합됨
- `grid.tsx`에서 `ModuleRegistry.registerModules([AllCommunityModule])`로 Community 모듈 등록 완료

---

## 3. 주요 개념: 4가지 운영 모드

`common/grid`는 **4가지 운영 모드**를 지원합니다. 각 모드는 `mode` prop으로 전환됩니다.

| 모드 | 설명 | 사용처 | 정렬/필터 | 데이터 로드 방식 |
| :--- | :--- | :--- | :--- | :--- |
| **`basic`** | 게시판용. 정렬/필터 비활성화 | 공지사항, 설교, Q&A 등 | ❌ OFF | 부모가 `rows`를 직접 전달 |
| **`server`** | ERP 목록용. 헤더 클릭 시 서버 API 호출 | 회원 목록, 거래 내역 등 | ✅ ON (서버 처리) | 부모가 `rows` 전달 + `onSortChanged`로 정렬 기준 전달 |
| **`infinite`** | 대용량 데이터 무한 스크롤 | 전체 거래 내역, 시스템 로그 등 | ✅ ON (서버 처리) | `onLoadData` 콜백으로 블록 단위 로드 |
| **`client`** | 소량 데이터 완전 제어 (클라이언트 정렬/필터) | 코드 관리, 설정 화면 등 | ✅ ON (클라이언트 처리) | 부모가 전체 `rows`를 전달 |

---

## 4. 소스 파일 구조 및 설명

### 4.1. `gridModel.ts` - 타입 정의

```tsx
export interface GridProps {
  // ===== 필수 =====
  columns: ColDef[];          // AG Grid 컬럼 정의
  rows?: any[];              // 표시할 데이터 (basic/client 모드)

  // ===== 운영 모드 =====
  mode?: 'basic' | 'server' | 'infinite' | 'client'; // 기본: 'basic'

  // ===== 공통 =====
  loading?: boolean;         // 로딩 상태
  pagination?: boolean;      // 페이지네이션 사용 여부 (기본: true)
  pageSize?: number;         // 페이지당 행 수 (기본: 10)
  rowHeight?: number;        // 행 높이 (기본: 44px)
  emptyMessage?: string;     // 데이터 없을 때 메시지
  defaultColDef?: ColDef;    // 기본 컬럼 속성 (sortable, filter 등)
  gridOptions?: GridOptions; // AG Grid 추가 옵션

  // ===== 서버 모드 전용 =====
  totalCount?: number;                              // 전체 데이터 건수
  onSortChanged?: (sortModel: SortModel) => void;   // 정렬 변경 콜백
  onFilterChanged?: (filterModel: FilterModel) => void; // 필터 변경 콜백

  // ===== Infinite 모드 전용 =====
  onLoadData?: (params: { startRow, endRow, sortModel, filterModel }) => Promise<{
    rows: any[];
    totalCount: number;
  }>;

  // ===== 부가 기능 =====
  responsive?: boolean | { breakpoints: { [key: number]: string[] } };
  saveState?: boolean;       // 컬럼 상태를 localStorage에 저장
  stateKey?: string;         // 상태 저장 고유 키 (saveState=true 필수)
}
```

### 4.2. `grid.tsx` - 메인 컴포넌트

| 섹션 | 설명 |
| :--- | :--- |
| **모듈 등록** | `ModuleRegistry.registerModules([AllCommunityModule])` |
| **모드별 defaultColDef** | `basic`은 `sortable: false, filter: false`, 나머지는 `true` |
| **서버 모드 이벤트** | `onSortChanged`, `onFilterChanged`를 Props로 전달 |
| **Infinite Datasource** | `onLoadData` 콜백을 AG Grid `datasource`로 변환 |
| **상태 저장** | `saveState`/`stateKey`로 컬럼 상태를 localStorage에 저장/복원 |
| **로딩/빈 화면** | Props로 커스터마이징 가능 |

### 4.3. `gridTheme.css` - 디자인 통합

AG Grid의 CSS 변수를 오버라이드하여 프로젝트 디자인 시스템에 통합:

| CSS 변수 | Tailwind 대응 | 설명 |
| :--- | :--- | :--- |
| `--ag-header-background-color` | `bg-slate-50` | 헤더 배경색 |
| `--ag-header-foreground-color` | `text-slate-500` | 헤더 텍스트 색상 |
| `--ag-border-color` | `border-slate-200` | 테두리 색상 |
| `--ag-row-hover-color` | `bg-slate-50` | 행 호버 색상 |
| `--ag-cell-horizontal-padding` | `px-3` | 셀 좌우 패딩 |
| `--ag-row-height` | `44px` | 행 높이 |

---

## 5. 주요 기능 (Props 상세)

### 5.1. 컬럼 정의 (`columns`)

각 컬럼은 `ColDef` 타입으로 정의합니다.

```tsx
const columnDefs: GridColumnDef[] = [
  {
    field: 'id',               // 데이터 필드명
    headerName: '번호',         // 헤더 표시명
    width: 80,                 // 고정 너비
    flex: 1,                   // 남은 공간 비율로 채움
    sortable: true,            // 정렬 가능 여부
    filter: true,              // 필터 가능 여부
    headerClass: 'text-center', // 헤더 정렬 클래스
    cellClass: 'text-center',   // 셀 정렬 클래스
    cellRenderer: (params) => <CustomComponent data={params.data} />, // 커스텀 렌더러
  },
];
```

### 5.2. 셀 정렬 제어

`headerClass`와 `cellClass`에 Tailwind 클래스를 사용합니다.

```tsx
// 가운데 정렬
{ headerClass: 'text-center', cellClass: 'text-center' }

// 왼쪽 정렬 (기본값, 별도 지정 불필요)
{ headerClass: 'text-left', cellClass: 'text-left' }

// 오른쪽 정렬 (숫자 컬럼에 주로 사용)
{ headerClass: 'text-right', cellClass: 'text-right' }
```

### 5.3. 커스텀 셀 렌더러 (`cellRenderer`)

데이터에 따라 복잡한 UI를 렌더링할 때 사용합니다.

```tsx
{
  field: 'title',
  headerName: '제목',
  cellRenderer: (params: any) => {
    const post = params.data;
    return (
      <div className="flex items-center gap-1">
        {post.depth > 0 && (
          <span className="material-icons text-sm">subdirectory_arrow_right</span>
        )}
        <Link to={`/view/${post.id}`}>{post.title}</Link>
        {post.commentCount > 0 && (
          <span className="text-red-500">[{post.commentCount}]</span>
        )}
      </div>
    );
  },
}
```

### 5.4. 서버 정렬 (`onSortChanged`)

`mode="server"`일 때 헤더 클릭 시 호출됩니다.

```tsx
const handleSortChanged = (sortModel: Array<{ colId: string; sort: 'asc' | 'desc' | null }>) => {
  const sortField = sortModel.length > 0 ? sortModel[0].colId : undefined;
  const sortOrder = sortModel.length > 0 ? sortModel[0].sort?.toUpperCase() : undefined;
  fetchData({ sortField, sortOrder });
};
```

### 5.5. 무한 스크롤 (`onLoadData`)

`mode="infinite"`일 때 스크롤 시 호출됩니다.

```tsx
<DataGrid
  mode="infinite"
  columns={columnDefs}
  onLoadData={async ({ startRow, endRow, sortModel, filterModel }) => {
    const res = await api.getList({
      start: startRow,
      end: endRow,
      sort: sortModel?.[0]?.colId,
      order: sortModel?.[0]?.sort,
    });
    return { rows: res.items, totalCount: res.total };
  }}
/>
```

### 5.6. 상태 저장 (`saveState`)

컬럼 너비, 정렬, 필터 상태를 브라우저 localStorage에 저장합니다.

```tsx
<DataGrid
  saveState={true}
  stateKey="sermon-list"  // 페이지별 고유 키 필요
  columns={columnDefs}
  rows={data}
/>
```

---

## 6. 사용 예제

### 6.1. 기본 게시판 (`mode="basic"`)

```tsx
import { DataGrid } from '../../../common/grid';
import type { GridColumnDef } from '../../../common/grid';

const columnDefs: GridColumnDef[] = [
  { field: 'id', headerName: '번호', width: 80, cellClass: 'text-center' },
  { field: 'title', headerName: '제목', flex: 1 },
  { field: 'author', headerName: '작성자', width: 120, cellClass: 'text-center' },
  { field: 'date', headerName: '작성일', width: 130, cellClass: 'text-center' },
];

function BoardListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 데이터 로드 함수...
  useEffect(() => { fetchData(); }, []);

  return (
    <DataGrid
      mode="basic"
      columns={columnDefs}
      rows={data}
      loading={loading}
      pagination={false}
      defaultColDef={{ sortable: false, filter: false }}
    />
  );
}
```

### 6.2. ERP 목록 (`mode="server"`)

```tsx
function ErpListPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const sortField = sortModel.length > 0 ? sortModel[0].colId : undefined;
      const sortOrder = sortModel.length > 0 ? sortModel[0].sort?.toUpperCase() : undefined;
      const res = await api.getList({ page, size: 20, sortField, sortOrder });
      setData(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, sortModel]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSortChanged = (newSortModel) => {
    setSortModel(newSortModel);
    setPage(0);
  };

  return (
    <DataGrid
      mode="server"
      columns={columnDefs}
      rows={data}
      totalCount={total}
      loading={loading}
      onSortChanged={handleSortChanged}
      pageSize={20}
      defaultColDef={{ sortable: true, filter: true }}
    />
  );
}
```

### 6.3. 무한 스크롤 (`mode="infinite"`)

```tsx
function InfiniteScrollPage() {
  const columnDefs = [...];

  const handleLoadData = async ({ startRow, endRow, sortModel, filterModel }) => {
    const sortField = sortModel?.[0]?.colId;
    const sortOrder = sortModel?.[0]?.sort?.toUpperCase();
    const res = await api.getList({
      start: startRow,
      end: endRow,
      sortField,
      sortOrder,
      // filterModel 처리...
    });
    return { rows: res.items, totalCount: res.total };
  };

  return (
    <DataGrid
      mode="infinite"
      columns={columnDefs}
      onLoadData={handleLoadData}
      defaultColDef={{ sortable: true, filter: true }}
    />
  );
}
```

---

## 7. 성능 최적화 및 주의사항

### 7.1. 데이터 크기별 권장 모드

| 데이터 건수 | 권장 모드 | 이유 |
| :--- | :--- | :--- |
| ~ 100건 | `basic` 또는 `client` | 간단한 렌더링, 클라이언트 정렬/필터로 충분 |
| 100 ~ 1,000건 | `server` | 서버 정렬/필터로 응답 속도 확보 |
| 1,000 ~ 10,000건 | `server` (페이징 필수) | 페이지네이션으로 한 번에 보이는 데이터 제한 |
| 10,000건 이상 | `infinite` | 스크롤 시 블록 단위 로드로 초기 로딩 속도 개선 |

### 7.2. `cellRenderer` 성능 주의사항

- `cellRenderer` 내부에서 **무거운 연산**을 하지 마세요. (매 행마다 실행됨)
- 복잡한 컴포넌트는 `React.memo()`로 감싸서 불필요한 리렌더링 방지

```tsx
const TitleRenderer = React.memo(({ data }) => {
  return <Link to={`/view/${data.id}`}>{data.title}</Link>;
});

// 사용
{ field: 'title', cellRenderer: (params) => <TitleRenderer data={params.data} /> }
```

### 7.3. 정렬/필터 화이트리스트 (백엔드)

서버 정렬 시 **SQL Injection 방지**를 위해 정렬 필드를 화이트리스트로 검증하세요.

```java
// Service 계층에서 검증
private static final List<String> ALLOWED_SORT_FIELDS = Arrays.asList(
    "created_at", "view_count", "title", "author_id"
);

if (!ALLOWED_SORT_FIELDS.contains(sortField)) {
    sortField = "created_at"; // 기본값 사용
}
```

### 7.4. 상태 저장(`saveState`) 사용 시 주의사항

- `stateKey`는 **페이지마다 고유한 값**을 사용하세요. (중복 시 상태 충돌)
- 저장되는 데이터: 컬럼 너비, 정렬 상태, 필터 상태 (민감 정보 제외)

---

## 8. 개발자가 알아야 할 추가 정보

### 8.1. AG Grid 공식 문서 참고

더 복잡한 요구사항(셀 병합, 피벗, 차트 등)이 있다면 AG Grid 공식 문서를 참고하세요.

- **공식 문서**: https://www.ag-grid.com/react-data-grid/
- **커뮤니티 버전 기능**: 정렬, 필터, 페이지네이션, 셀 렌더링, 컬럼 그룹핑 등
- **Enterprise 기능**: 피벗, 통합 차트, Excel 내보내기 등 (유료)

### 8.2. `gridOptions`로 고급 기능 추가

`gridOptions` Props로 AG Grid의 모든 옵션을 전달할 수 있습니다.

```tsx
<DataGrid
  columns={columnDefs}
  rows={data}
  gridOptions={{
    enableCellTextSelection: true,       // 셀 텍스트 복사 허용
    ensureDomOrder: true,                // DOM 순서 보장
    onCellDoubleClicked: (params) => {   // 셀 더블클릭 이벤트
      navigate(`/detail/${params.data.id}`);
    },
    // 등록된 콜백은 gridOptions에 전달
  }}
/>
```

### 8.3. 반응형 컬럼 (모바일 대응)

`responsive` Props로 화면 너비에 따라 표시할 컬럼을 제어할 수 있습니다.

```tsx
<DataGrid
  responsive={true}
  columns={columnDefs}
  rows={data}
/>
```

내부적으로 `window.addEventListener('resize')`를 통해 화면 너비가 640px 미만이면 일부 컬럼을 숨깁니다.

### 8.4. 기존 `sermonsPage`와의 호환성

기존 `sermonsPage`는 `mode="basic"`이 기본값이므로, 별도 수정 없이 계속 동작합니다.  
필요 시 `mode="server"`로 전환하여 정렬 기능을 활성화할 수 있습니다.

### 8.5. 디자인 커스터마이징

`gridTheme.css`에서 CSS 변수를 수정하면 전체 그리드 디자인을 일괄 변경할 수 있습니다.

```css
.ag-theme-custom {
  --ag-header-background-color: #your-color;
  --ag-row-height: 50px;
  --ag-font-size: 15px;
}
```

### 8.6. 로딩/빈 화면 커스터마이징

`loadingComponent`와 `emptyComponent` Props로 커스텀 UI를 전달할 수 있습니다.

```tsx
<DataGrid
  loadingComponent={<CustomSpinner />}
  emptyComponent={<CustomEmptyState message="데이터가 없습니다." />}
  // ...
/>
```

---

## 9. 자주 묻는 질문 (FAQ)

### Q1. 기존 `sermonsPage`에 영향이 있나요?

**A.** 없습니다. `mode` 기본값이 `'basic'`이므로 기존 코드를 수정하지 않아도 정상 동작합니다.

### Q2. 정렬/필터를 활성화하려면 어떻게 하나요?

**A.** `mode="server"`로 변경하고, `onSortChanged`/`onFilterChanged` 콜백을 구현하여 서버 API를 호출하세요.

### Q3. AG Grid가 무료인가요?

**A.** Community 버전은 MIT 라이선스로 완전 무료입니다. Enterprise 기능(피벗, 차트 등)은 유료입니다.

### Q4. 무한 스크롤과 페이지네이션 중 어떤 것을 선택해야 하나요?

**A.** 
- 사용자에게 전체 데이터 양을 명확히 보여줘야 한다면 → **페이지네이션**
- 연속적인 탐색이 자연스러운 경우(예: 피드, 로그) → **무한 스크롤**

### Q5. `saveState`는 어떤 데이터를 저장하나요?

**A.** 컬럼 너비, 정렬 상태, 필터 상태를 localStorage에 저장합니다. 민감 정보는 포함되지 않습니다.

---

## 10. 변경 이력

| 버전 | 날짜 | 변경 내용 |
| :--- | :--- | :--- |
| v1.0 | 2026-06-17 | 최초 작성. 4가지 모드 지원, 서버 정렬/필터, 무한 스크롤, 상태 저장 기능 포함 |