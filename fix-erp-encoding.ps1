$enc = [System.Text.UTF8Encoding]::new($false)
$base = "c:\privWork\workspace\webProject\frontend\src\pages\erp"

# ── AccountBudgetPage ──────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\account\AccountBudgetPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'budgetYear', label: '회계연도' },
  { key: 'category', label: '구분' },
  { key: 'budgetAmount', label: '예산액' },
  { key: 'executedAmount', label: '집행액' },
  { key: 'remainAmount', label: '잔액' },
];

export default function AccountBudgetPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.account.getBudget>[0]) => erpApi.account.getBudget(q), []);
  return (
    <ErpListPage<Row>
      title="예산 관리"
      description="연간 예산 편성 및 집행 현황을 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: AccountBudgetPage"

# ── AccountExpensePage ─────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\account\AccountExpensePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'expenseDate', label: '지출일' },
  { key: 'category', label: '구분' },
  { key: 'amount', label: '금액' },
  { key: 'payee', label: '지급처' },
  { key: 'approver', label: '결재자' },
];

export default function AccountExpensePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.account.getExpense>[0]) => erpApi.account.getExpense(q), []);
  return (
    <ErpListPage<Row>
      title="지출결의"
      description="지출결의서 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: AccountExpensePage"

# ── AccountManagerPage ─────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\account\AccountManagerPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'transDate', label: '거래일' },
  { key: 'category', label: '구분' },
  { key: 'transType', label: '유형' },
  { key: 'amount', label: '금액' },
  { key: 'memo', label: '비고' },
];

export default function AccountManagerPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.account.getManager>[0]) => erpApi.account.getManager(q), []);
  return (
    <ErpListPage<Row>
      title="회계 관리"
      description="수입/지출 내역을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: AccountManagerPage"

# ── AdminApprovalPage ──────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\admin\AdminApprovalPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'docNo', label: '문서번호' },
  { key: 'title', label: '제목' },
  { key: 'requester', label: '기안자' },
  { key: 'approver', label: '결재자' },
  { key: 'status', label: '결재상태' },
  { key: 'requestedAt', label: '기안일' },
];

export default function AdminApprovalPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.admin.getApproval>[0]) => erpApi.admin.getApproval(q), []);
  return (
    <ErpListPage<Row>
      title="결재 관리"
      description="문서 결재 신청 및 처리 현황을 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: AdminApprovalPage"

# ── AdminCertificatePage ───────────────────────────────────────
[System.IO.File]::WriteAllText("$base\admin\AdminCertificatePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'certNo', label: '증명서번호' },
  { key: 'memberName', label: '성도명' },
  { key: 'certType', label: '종류' },
  { key: 'issuedAt', label: '발급일' },
  { key: 'status', label: '상태' },
];

export default function AdminCertificatePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.admin.getCertificate>[0]) => erpApi.admin.getCertificate(q), []);
  return (
    <ErpListPage<Row>
      title="증명서 발급"
      description="성도 증명서 발급 내역을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: AdminCertificatePage"

# ── AdminMinutesPage ───────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\admin\AdminMinutesPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'minuteNo', label: '회의록번호' },
  { key: 'title', label: '회의 제목' },
  { key: 'meetingDate', label: '회의일' },
  { key: 'author', label: '작성자' },
  { key: 'attendeeCount', label: '참석 인원' },
];

export default function AdminMinutesPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.admin.getMinutes>[0]) => erpApi.admin.getMinutes(q), []);
  return (
    <ErpListPage<Row>
      title="회의록 관리"
      description="각종 회의록을 작성하고 조회합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: AdminMinutesPage"

# ── CommMessagePage ────────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\comm\CommMessagePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '제목' },
  { key: 'recipient', label: '수신자' },
  { key: 'sentAt', label: '발송일시' },
  { key: 'status', label: '상태' },
];

export default function CommMessagePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.comm.getMessage>[0]) => erpApi.comm.getMessage(q), []);
  return (
    <ErpListPage<Row>
      title="문자발송"
      description="문자 발송 내역을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: CommMessagePage"

# ── CommNewsletterPage ─────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\comm\CommNewsletterPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '소식지 제목' },
  { key: 'period', label: '발행기간' },
  { key: 'publishedAt', label: '발행일' },
  { key: 'viewCount', label: '조회수' },
];

export default function CommNewsletterPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.comm.getNewsletter>[0]) => erpApi.comm.getNewsletter(q), []);
  return (
    <ErpListPage<Row>
      title="소식지"
      description="발행된 소식지 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: CommNewsletterPage"

# ── CommNoticePage ─────────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\comm\CommNoticePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '제목' },
  { key: 'author', label: '작성자' },
  { key: 'createdAt', label: '작성일' },
  { key: 'viewCount', label: '조회수' },
];

export default function CommNoticePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.comm.getNotice>[0]) => erpApi.comm.getNotice(q), []);
  return (
    <ErpListPage<Row>
      title="공지사항"
      description="전체 공지사항을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: CommNoticePage"

# ── CommPrayerPage ─────────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\comm\CommPrayerPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'requester', label: '신청자' },
  { key: 'content', label: '기도 내용' },
  { key: 'createdAt', label: '신청일' },
  { key: 'status', label: '상태' },
];

export default function CommPrayerPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.comm.getPrayer>[0]) => erpApi.comm.getPrayer(q), []);
  return (
    <ErpListPage<Row>
      title="기도신청"
      description="기도 신청 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: CommPrayerPage"

# ── EventApplyPage ─────────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\event\EventApplyPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'eventName', label: '행사명' },
  { key: 'applicantName', label: '신청자' },
  { key: 'applyDate', label: '신청일' },
  { key: 'status', label: '상태' },
];

export default function EventApplyPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.event.getApply>[0]) => erpApi.event.getApply(q), []);
  return (
    <ErpListPage<Row>
      title="행사 신청"
      description="행사 신청 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: EventApplyPage"

# ── EventParticipantPage ───────────────────────────────────────
[System.IO.File]::WriteAllText("$base\event\EventParticipantPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'eventName', label: '행사명' },
  { key: 'name', label: '참가자' },
  { key: 'participantDate', label: '참가일' },
  { key: 'attendanceStatus', label: '참석 여부' },
];

export default function EventParticipantPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.event.getParticipant>[0]) => erpApi.event.getParticipant(q), []);
  return (
    <ErpListPage<Row>
      title="참가자 관리"
      description="행사별 참가자 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: EventParticipantPage"

# ── EventResultPage ────────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\event\EventResultPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'eventName', label: '행사명' },
  { key: 'eventDate', label: '행사일' },
  { key: 'totalParticipants', label: '참가인원' },
  { key: 'result', label: '결과' },
  { key: 'author', label: '작성자' },
];

export default function EventResultPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.event.getResult>[0]) => erpApi.event.getResult(q), []);
  return (
    <ErpListPage<Row>
      title="행사 결과"
      description="행사 결과 보고서를 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: EventResultPage"

# ── FacilityInventoryPage ──────────────────────────────────────
[System.IO.File]::WriteAllText("$base\facility\FacilityInventoryPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'itemName', label: '비품명' },
  { key: 'category', label: '종류' },
  { key: 'quantity', label: '수량' },
  { key: 'location', label: '보관위치' },
  { key: 'purchaseDate', label: '구입일' },
];

export default function FacilityInventoryPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.facility.getInventory>[0]) => erpApi.facility.getInventory(q), []);
  return (
    <ErpListPage<Row>
      title="비품 재고"
      description="교회 비품 및 재고 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: FacilityInventoryPage"

# ── FacilityMaintenancePage ────────────────────────────────────
[System.IO.File]::WriteAllText("$base\facility\FacilityMaintenancePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'facilityName', label: '시설명' },
  { key: 'maintenanceDate', label: '점검일' },
  { key: 'description', label: '점검내용' },
  { key: 'engineer', label: '담당자' },
  { key: 'cost', label: '비용' },
  { key: 'status', label: '상태' },
];

export default function FacilityMaintenancePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.facility.getMaintenance>[0]) => erpApi.facility.getMaintenance(q), []);
  return (
    <ErpListPage<Row>
      title="시설 점검"
      description="시설 점검 및 보수 내역을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: FacilityMaintenancePage"

# ── FacilityReservationPage ────────────────────────────────────
[System.IO.File]::WriteAllText("$base\facility\FacilityReservationPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'facilityName', label: '시설명' },
  { key: 'reservantName', label: '신청자' },
  { key: 'reserveDate', label: '예약일' },
  { key: 'startTime', label: '시작시간' },
  { key: 'endTime', label: '종료시간' },
  { key: 'status', label: '상태' },
];

export default function FacilityReservationPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.facility.getReservation>[0]) => erpApi.facility.getReservation(q), []);
  return (
    <ErpListPage<Row>
      title="시설 예약"
      description="시설 예약 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: FacilityReservationPage"

# ── FacilityVehiclePage ────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\facility\FacilityVehiclePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'vehicleName', label: '차량명' },
  { key: 'plateNumber', label: '차량번호' },
  { key: 'driverName', label: '담당운전자' },
  { key: 'status', label: '상태' },
  { key: 'lastInspectionDate', label: '최근점검일' },
];

export default function FacilityVehiclePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.facility.getVehicle>[0]) => erpApi.facility.getVehicle(q), []);
  return (
    <ErpListPage<Row>
      title="차량 관리"
      description="교회 차량 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: FacilityVehiclePage"

# ── HumenChangePage ────────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\humen\HumenChangePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'changeType', label: '변경유형' },
  { key: 'changeDate', label: '변경일' },
  { key: 'reason', label: '사유' },
];

export default function HumenChangePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.humen.getChange>[0]) => erpApi.humen.getChange(q), []);
  return (
    <ErpListPage<Row>
      title="이동 현황"
      description="성도 이동(등록/이적/전입/전출) 현황을 조회합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: HumenChangePage"

# ── HumenDistrictPage ──────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\humen\HumenDistrictPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'districtName', label: '구역명' },
  { key: 'leaderName', label: '구역장' },
  { key: 'memberCount', label: '인원수' },
  { key: 'meetingDay', label: '모임요일' },
];

export default function HumenDistrictPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.humen.getDistrict>[0]) => erpApi.humen.getDistrict(q), []);
  return (
    <ErpListPage<Row>
      title="구역 관리"
      description="구역 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: HumenDistrictPage"

# ── HumenManagerPage ───────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\humen\HumenManagerPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'district', label: '구역' },
  { key: 'phone', label: '연락처' },
  { key: 'registeredAt', label: '등록일' },
];

export default function HumenManagerPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.humen.getManager>[0]) => erpApi.humen.getManager(q), []);
  return (
    <ErpListPage<Row>
      title="성도 관리"
      description="등록된 성도 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: HumenManagerPage"

# ── HumenNewcomerPage ──────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\humen\HumenNewcomerPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'phone', label: '연락처' },
  { key: 'visitDate', label: '방문일' },
  { key: 'invitedBy', label: '인도자' },
  { key: 'status', label: '상태' },
];

export default function HumenNewcomerPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.humen.getNewcomer>[0]) => erpApi.humen.getNewcomer(q), []);
  return (
    <ErpListPage<Row>
      title="새신자 관리"
      description="새신자 등록 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: HumenNewcomerPage"

# ── MinistryDepartmentPage ─────────────────────────────────────
[System.IO.File]::WriteAllText("$base\ministry\MinistryDepartmentPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'deptName', label: '부서명' },
  { key: 'leader', label: '담당자' },
  { key: 'memberCount', label: '인원수' },
  { key: 'category', label: '종류' },
];

export default function MinistryDepartmentPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.ministry.getDepartment>[0]) => erpApi.ministry.getDepartment(q), []);
  return (
    <ErpListPage<Row>
      title="부서 관리"
      description="사역 부서 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: MinistryDepartmentPage"

# ── MinistryReportPage ─────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\ministry\MinistryReportPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'reportDate', label: '보고일' },
  { key: 'deptName', label: '부서명' },
  { key: 'title', label: '보고 제목' },
  { key: 'author', label: '작성자' },
];

export default function MinistryReportPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.ministry.getReport>[0]) => erpApi.ministry.getReport(q), []);
  return (
    <ErpListPage<Row>
      title="사역 보고"
      description="부서별 사역 보고서를 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: MinistryReportPage"

# ── MinistrySchedulePage ───────────────────────────────────────
[System.IO.File]::WriteAllText("$base\ministry\MinistrySchedulePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'scheduleDate', label: '일정일' },
  { key: 'deptName', label: '부서명' },
  { key: 'title', label: '일정 제목' },
  { key: 'location', label: '장소' },
  { key: 'status', label: '상태' },
];

export default function MinistrySchedulePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.ministry.getSchedule>[0]) => erpApi.ministry.getSchedule(q), []);
  return (
    <ErpListPage<Row>
      title="사역 일정"
      description="부서별 사역 일정을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: MinistrySchedulePage"

# ── MinistryVolunteerPage ──────────────────────────────────────
[System.IO.File]::WriteAllText("$base\ministry\MinistryVolunteerPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'deptName', label: '부서명' },
  { key: 'role', label: '역할' },
  { key: 'startDate', label: '시작일' },
  { key: 'status', label: '상태' },
];

export default function MinistryVolunteerPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.ministry.getVolunteer>[0]) => erpApi.ministry.getVolunteer(q), []);
  return (
    <ErpListPage<Row>
      title="봉사자 관리"
      description="부서별 봉사자 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: MinistryVolunteerPage"

# ── SermonArchivePage ──────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\sermon\SermonArchivePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '설교 제목' },
  { key: 'preacher', label: '설교자' },
  { key: 'mediaType', label: '미디어유형' },
  { key: 'uploadDate', label: '업로드일' },
  { key: 'viewCount', label: '조회수' },
];

export default function SermonArchivePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.sermon.getArchive>[0]) => erpApi.sermon.getArchive(q), []);
  return (
    <ErpListPage<Row>
      title="설교 아카이브"
      description="설교 영상 및 아카이브를 보관하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: SermonArchivePage"

# ── SermonAttendancePage ───────────────────────────────────────
[System.IO.File]::WriteAllText("$base\sermon\SermonAttendancePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'worshipDate', label: '예배일' },
  { key: 'worshipType', label: '예배 종류' },
  { key: 'attendanceCount', label: '출석인원' },
  { key: 'totalMembers', label: '전체인원' },
  { key: 'attendanceRate', label: '출석률' },
];

export default function SermonAttendancePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.sermon.getAttendance>[0]) => erpApi.sermon.getAttendance(q), []);
  return (
    <ErpListPage<Row>
      title="예배 출석"
      description="예배별 출석 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: SermonAttendancePage"

# ── SermonManagerPage ──────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\sermon\SermonManagerPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'title', label: '설교 제목' },
  { key: 'preacher', label: '설교자' },
  { key: 'scripture', label: '본문' },
  { key: 'sermonDate', label: '설교일' },
];

export default function SermonManagerPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.sermon.getManager>[0]) => erpApi.sermon.getManager(q), []);
  return (
    <ErpListPage<Row>
      title="설교 관리"
      description="등록된 설교 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: SermonManagerPage"

# ── SermonOrderPage ────────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\sermon\SermonOrderPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'worshipDate', label: '예배일' },
  { key: 'worshipType', label: '예배 종류' },
  { key: 'orderTitle', label: '순서 제목' },
  { key: 'officiant', label: '담당자' },
];

export default function SermonOrderPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.sermon.getOrder>[0]) => erpApi.sermon.getOrder(q), []);
  return (
    <ErpListPage<Row>
      title="예배 순서"
      description="예배 순서를 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: SermonOrderPage"

# ── TrainingAttendancePage ─────────────────────────────────────
[System.IO.File]::WriteAllText("$base\training\TrainingAttendancePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'classDate', label: '수업일' },
  { key: 'courseName', label: '과정명' },
  { key: 'attendanceCount', label: '출석인원' },
  { key: 'totalStudents', label: '전체인원' },
  { key: 'attendanceRate', label: '출석률' },
];

export default function TrainingAttendancePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.training.getAttendance>[0]) => erpApi.training.getAttendance(q), []);
  return (
    <ErpListPage<Row>
      title="훈련 출석"
      description="과정별 출석 현황을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: TrainingAttendancePage"

# ── TrainingCompletePage ───────────────────────────────────────
[System.IO.File]::WriteAllText("$base\training\TrainingCompletePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'courseName', label: '과정명' },
  { key: 'completeDate', label: '수료일' },
  { key: 'grade', label: '성적' },
];

export default function TrainingCompletePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.training.getComplete>[0]) => erpApi.training.getComplete(q), []);
  return (
    <ErpListPage<Row>
      title="수료 현황"
      description="훈련 과정 수료자 현황을 조회합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: TrainingCompletePage"

# ── TrainingCoursePage ─────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\training\TrainingCoursePage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'courseName', label: '과정명' },
  { key: 'instructor', label: '강사' },
  { key: 'startDate', label: '시작일' },
  { key: 'endDate', label: '종료일' },
  { key: 'capacity', label: '정원' },
];

export default function TrainingCoursePage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.training.getCourse>[0]) => erpApi.training.getCourse(q), []);
  return (
    <ErpListPage<Row>
      title="훈련 과정"
      description="훈련 과정 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: TrainingCoursePage"

# ── TrainingStudentPage ────────────────────────────────────────
[System.IO.File]::WriteAllText("$base\training\TrainingStudentPage.tsx", @'
import { useCallback } from 'react';
import ErpListPage from '../shared/ErpListPage';
import { erpApi } from '../../../api/erpApi';

type Row = Record<string, unknown>;

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'courseName', label: '수강 과정' },
  { key: 'enrollDate', label: '등록일' },
  { key: 'status', label: '수강 상태' },
];

export default function TrainingStudentPage() {
  const fetchFn = useCallback((q: Parameters<typeof erpApi.training.getStudent>[0]) => erpApi.training.getStudent(q), []);
  return (
    <ErpListPage<Row>
      title="수강자 관리"
      description="수강자 목록을 조회하고 관리합니다."
      columns={COLUMNS}
      fetchFn={fetchFn}
      searchable
    />
  );
}
'@, $enc); Write-Host "OK: TrainingStudentPage"

Write-Host "`n완료: 33개 파일 수정됨"
