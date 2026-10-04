import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import WorkspaceLayout from "../layouts/workspace/WorkspaceLayout";
import {
  Users,
  BookOpen,
  Wallet,
  GraduationCap,
  HandHeart,
  CalendarDays,
  Building2,
  MessageSquare,
  ChartNoAxesCombined,
  ClipboardList,
} from "lucide-react";
import type { WorkspaceMenuPresentation } from "../common/workspace/workspace.types";

const erpMenuPresentation: WorkspaceMenuPresentation = {
  "/erp/humen": { label: "성도", icon: Users },
  "/erp/sermon": { label: "예배", icon: BookOpen },
  "/erp/account": { label: "재정", icon: Wallet },
  "/erp/training": { label: "교육", icon: GraduationCap },
  "/erp/ministry": { label: "조직", icon: HandHeart },
  "/erp/event": { label: "일정", icon: CalendarDays },
  "/erp/facility": { label: "자원", icon: Building2 },
  "/erp/comm": { label: "소통", icon: MessageSquare },
  "/erp/stats": { label: "통계", icon: ChartNoAxesCombined },
  "/erp/admin": { label: "행정", icon: ClipboardList },
};

const ErpIndexPage = lazy(() => import("../erp/index/erpIndexPage"));
const HumenManagerPage = lazy(() => import("../erp/humen/manager/managerPage"));
const HumenDistrictPage = lazy(
  () => import("../erp/humen/district/districtPage"),
);
const HumenMyProfilePage = lazy(
  () => import("../erp/humen/myprofile/myprofilePage"),
);
const HumenPersonnelMovePage = lazy(
  () => import("../erp/humen/personnelmove/personnelmovePage"),
);
const SermonManagerPage = lazy(
  () => import("../erp/sermon/manager/managerPage"),
);
const SermonArchivePage = lazy(
  () => import("../erp/sermon/archive/archivePage"),
);
const SermonAttendancePage = lazy(
  () => import("../erp/sermon/attendance/attendancePage"),
);
const SermonWritePage = lazy(() => import("../erp/sermon/write/writePage"));
const SermonOrderPage = lazy(() => import("../erp/sermon/order/orderPage"));
const AccountManagerPage = lazy(
  () => import("../erp/account/manager/managerPage"),
);
const AccountInputPage = lazy(() => import("../erp/account/input/inputPage"));
const AccountBudgetPage = lazy(
  () => import("../erp/account/budget/budgetPage"),
);
const AccountExpensePage = lazy(
  () => import("../erp/account/expense/expensePage"),
);
const AccountReportPage = lazy(
  () => import("../erp/account/report/reportPage"),
);
const TrainingCoursePage = lazy(
  () => import("../erp/training/course/coursePage"),
);
const TrainingStudentPage = lazy(
  () => import("../erp/training/student/studentPage"),
);
const TrainingAttendancePage = lazy(
  () => import("../erp/training/attendance/attendancePage"),
);
const TrainingCompletePage = lazy(
  () => import("../erp/training/complete/completePage"),
);
const MinistryDepartmentPage = lazy(
  () => import("../erp/ministry/department/departmentPage"),
);
const MinistrySchedulePage = lazy(
  () => import("../erp/ministry/schedule/schedulePage"),
);
const MinistryVolunteerPage = lazy(
  () => import("../erp/ministry/volunteer/volunteerPage"),
);
const MinistryReportPage = lazy(
  () => import("../erp/ministry/report/reportPage"),
);
const EventCalendarPage = lazy(
  () => import("../erp/event/calendar/calendarPage"),
);
const EventApplyPage = lazy(() => import("../erp/event/apply/applyPage"));
const EventParticipantPage = lazy(
  () => import("../erp/event/participant/participantPage"),
);
const EventResultPage = lazy(() => import("../erp/event/result/resultPage"));
const FacilityReservationPage = lazy(
  () => import("../erp/facility/reservation/reservationPage"),
);
const FacilityVehiclePage = lazy(
  () => import("../erp/facility/vehicle/vehiclePage"),
);
const FacilityInventoryPage = lazy(
  () => import("../erp/facility/inventory/inventoryPage"),
);
const FacilityMaintenancePage = lazy(
  () => import("../erp/facility/maintenance/maintenancePage"),
);
const CommNoticePage = lazy(() => import("../erp/comm/notice/noticePage"));
const CommMessagePage = lazy(() => import("../erp/comm/message/messagePage"));
const CommPrayerPage = lazy(() => import("../erp/comm/prayer/prayerPage"));
const CommNewsletterPage = lazy(
  () => import("../erp/comm/newsletter/newsletterPage"),
);
const StatsDashboardPage = lazy(
  () => import("../erp/stats/dashboard/dashboardPage"),
);
const StatsAttendancePage = lazy(
  () => import("../erp/stats/attendance/attendancePage"),
);
const StatsOfferingPage = lazy(
  () => import("../erp/stats/offering/offeringPage"),
);
const StatsMinistryPage = lazy(
  () => import("../erp/stats/ministry/ministryPage"),
);
const AdminCertificatePage = lazy(
  () => import("../erp/admin/certificate/certificatePage"),
);
const AdminApprovalPage = lazy(
  () => import("../erp/admin/approval/approvalPage"),
);
const AdminMinutesPage = lazy(() => import("../erp/admin/minutes/minutesPage"));
const AdminArchivePage = lazy(() => import("../erp/admin/archive/archivePage"));

export const erpRoutes: RouteObject[] = [
  {
    path: "/erp",
    element: (
      <ProtectedRoute>
        <WorkspaceLayout
          basePath="/erp"
          name="ERP"
          menuPresentation={erpMenuPresentation}
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ErpIndexPage /> },

      // humen
      {
        path: "humen",
        children: [
          { path: "manager", element: <HumenManagerPage /> },
          { path: "district", element: <HumenDistrictPage /> },
          { path: "myprofile", element: <HumenMyProfilePage /> },
          { path: "personnelmove", element: <HumenPersonnelMovePage /> },
        ],
      },

      // sermon
      {
        path: "sermon",
        children: [
          { path: "manager", element: <SermonManagerPage /> },
          { path: "archive", element: <SermonArchivePage /> },
          { path: "attendance", element: <SermonAttendancePage /> },
          { path: "write", element: <SermonWritePage /> },
          { path: "order", element: <SermonOrderPage /> },
        ],
      },

      // account
      {
        path: "account",
        children: [
          { path: "manager", element: <AccountManagerPage /> },
          { path: "input", element: <AccountInputPage /> },
          { path: "budget", element: <AccountBudgetPage /> },
          { path: "expense", element: <AccountExpensePage /> },
          { path: "report", element: <AccountReportPage /> },
        ],
      },

      // training
      {
        path: "training",
        children: [
          { path: "course", element: <TrainingCoursePage /> },
          { path: "student", element: <TrainingStudentPage /> },
          { path: "attendance", element: <TrainingAttendancePage /> },
          { path: "complete", element: <TrainingCompletePage /> },
        ],
      },

      // ministry
      {
        path: "ministry",
        children: [
          { path: "department", element: <MinistryDepartmentPage /> },
          { path: "schedule", element: <MinistrySchedulePage /> },
          { path: "volunteer", element: <MinistryVolunteerPage /> },
          { path: "report", element: <MinistryReportPage /> },
        ],
      },

      // event
      {
        path: "event",
        children: [
          { path: "calendar", element: <EventCalendarPage /> },
          { path: "apply", element: <EventApplyPage /> },
          { path: "participant", element: <EventParticipantPage /> },
          { path: "result", element: <EventResultPage /> },
        ],
      },

      // facility
      {
        path: "facility",
        children: [
          { path: "reservation", element: <FacilityReservationPage /> },
          { path: "vehicle", element: <FacilityVehiclePage /> },
          { path: "inventory", element: <FacilityInventoryPage /> },
          { path: "maintenance", element: <FacilityMaintenancePage /> },
        ],
      },

      // comm
      {
        path: "comm",
        children: [
          { path: "notice", element: <CommNoticePage /> },
          { path: "message", element: <CommMessagePage /> },
          { path: "prayer", element: <CommPrayerPage /> },
          { path: "newsletter", element: <CommNewsletterPage /> },
        ],
      },

      // stats
      {
        path: "stats",
        children: [
          { path: "dashboard", element: <StatsDashboardPage /> },
          { path: "attendance", element: <StatsAttendancePage /> },
          { path: "offering", element: <StatsOfferingPage /> },
          { path: "ministry", element: <StatsMinistryPage /> },
        ],
      },

      // admin
      {
        path: "admin",
        children: [
          { path: "certificate", element: <AdminCertificatePage /> },
          { path: "approval", element: <AdminApprovalPage /> },
          { path: "minutes", element: <AdminMinutesPage /> },
          { path: "archive", element: <AdminArchivePage /> },
        ],
      },
    ],
  },
];
