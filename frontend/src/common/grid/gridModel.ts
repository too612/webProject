/**
 * @fileoverview 공통 DataGrid 컴포넌트의 타입 정의
 * 
 * 이 컴포넌트는 4가지 운영 모드를 지원합니다:
 * - 'basic'   : 게시판용 (정렬/필터 비활성화, 부모가 rows를 직접 전달)
 * - 'server'  : ERP 목록용 (헤더 클릭 시 서버 API 호출)
 * - 'infinite': 대용량 데이터 탐색용 (무한 스크롤)
 * - 'client'  : 소량 데이터 완전 제어용 (클라이언트 정렬/필터)
 */
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';

export interface GridProps {
  // ===== 필수 Props =====
  /** 컬럼 정의 (각 페이지에서 정의) */
  columns: ColDef[];
  /** 표시할 데이터 (basic/client 모드에서는 rows를 직접 전달) */
  rows?: any[];
  
  // ===== 운영 모드 =====
  /**
   * - 'basic'   : 게시판 모드 (정렬/필터 OFF, rows 직접 전달)
   * - 'server'  : 서버 모드 (정렬/필터 ON, API 호출로 데이터 갱신)
   * - 'infinite': 무한 스크롤 모드 (스크롤 시 블록 단위 로드)
   * - 'client'  : 클라이언트 모드 (전체 데이터 클라이언트 정렬/필터)
   * @default 'basic'
   */
  mode?: 'basic' | 'server' | 'infinite' | 'client';
  
  // ===== 공통 Props =====
  /** 로딩 상태 (basic/client 모드에서 사용) */
  loading?: boolean;
  /** 페이지네이션 사용 여부 (기본: true) */
  pagination?: boolean;
  /** 페이지당 행 수 (기본: 10) */
  pageSize?: number;
  /** 행 높이 (기본: 44px) */
  rowHeight?: number;
  /** 데이터 없을 때 표시할 메시지 */
  emptyMessage?: string;
  /** AG Grid 추가 옵션 (고급 설정용) */
  gridOptions?: GridOptions;
  /** 기본 컬럼 속성 (sortable, filter 등) - 페이지별 제어 가능 */
  defaultColDef?: ColDef;
  
  // ===== 서버 모드 전용 (mode='server' 또는 'infinite') =====
  /** 전체 데이터 건수 (서버에서 받아온 total) */
  totalCount?: number;
  
  /**
   * 정렬 변경 시 호출될 콜백 (mode='server' 전용)
   * @param sortModel AG Grid의 정렬 모델 [{ colId: 'title', sort: 'asc' }]
   */
  onSortChanged?: (sortModel: Array<{ colId: string; sort: 'asc' | 'desc' | null }>) => void;
  
  /**
   * 필터 변경 시 호출될 콜백 (mode='server' 전용)
   * @param filterModel AG Grid의 필터 모델 { colId: { filterType: 'text', type: 'contains', filter: 'keyword' } }
   */
  onFilterChanged?: (filterModel: Record<string, any>) => void;
  
  /**
   * Infinite 모드 데이터 로드 콜백 (mode='infinite' 전용)
   * @param params.startRow 시작 행 번호
   * @param params.endRow 종료 행 번호
   * @param params.sortModel 현재 정렬 모델
   * @param params.filterModel 현재 필터 모델
   * @returns { rows: any[], totalCount: number }
   */
  onLoadData?: (params: {
    startRow: number;
    endRow: number;
    sortModel?: Array<{ colId: string; sort: 'asc' | 'desc' | null }>;
    filterModel?: Record<string, any>;
  }) => Promise<{ rows: any[]; totalCount: number }>;
  
  // ===== 반응형/상태 저장 =====
  /** 반응형 컬럼 표시/숨김 설정 (true: 기본 breakpoint 적용) */
  responsive?: boolean | { breakpoints: { [key: number]: string[] } };
  /** 컬럼 상태(너비, 정렬)를 localStorage에 저장할지 여부 */
  saveState?: boolean;
  /** 상태 저장 시 사용할 고유 키 (saveState=true 필수) */
  stateKey?: string;
  
  // ===== UI 커스터마이징 =====
  /** 로딩 시 표시할 커스텀 컴포넌트 */
  loadingComponent?: React.ReactNode;
  /** 빈 데이터 시 표시할 커스텀 컴포넌트 */
  emptyComponent?: React.ReactNode;
  
  // ===== 이벤트 =====
  /** 그리드 초기화 완료 콜백 (AG Grid API 획득용) */
  onGridReady?: (params: any) => void;
}

export type GridCellRendererParams<TData = any> = ICellRendererParams<TData>;
export type GridColumnDef = ColDef;