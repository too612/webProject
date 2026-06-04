import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';

const ErpIndexPage = lazy(() => import('../erp/index/erpIndexPage'));
const HumenManagerPage = lazy(() => import('../erp/humen/manager/managerPage'));
const HumenDistrictPage = lazy(() => import('../erp/humen/district/districtPage'));
const HumenNewcomerPage = lazy(() => import('../erp/humen/newcomer/newcomerPage'));
const HumenChangePage = lazy(() => import('../erp/humen/change/changePage'));
const SermonManagerPage = lazy(() => import('../erp/sermon/manager/managerPage'));
const SermonArchivePage = lazy(() => import('../erp/sermon/archive/archivePage'));
const SermonAttendancePage = lazy(() => import('../erp/sermon/attendance/attendancePage'));
const SermonWritePage = lazy(() => import('../erp/sermon/write/writePage'));
const SermonOrderPage = lazy(() => import('../erp/sermon/order/orderPage'));
const AccountManagerPage = lazy(() => import('../erp/account/manager/managerPage'));
const AccountInputPage = lazy(() => import('../erp/account/input/inputPage'));
const AccountBudgetPage = lazy(() => import('../erp/account/budget/budgetPage'));
const AccountExpensePage = lazy(() => import('../erp/account/expense/expensePage'));
const AccountReportPage = lazy(() => import('../erp/account/report/reportPage'));
const TrainingCoursePage = lazy(() => import('../erp/training/course/coursePage'));
const TrainingStudentPage = lazy(() => import('../erp/training/student/studentPage'));
const TrainingAttendancePage = lazy(() => import('../erp/training/attendance/attendancePage'));
const TrainingCompletePage = lazy(() => import('../erp/training/complete/completePage'));
const MinistryDepartmentPage = lazy(() => import('../erp/ministry/department/departmentPage'));
const MinistrySchedulePage = lazy(() => import('../erp/ministry/schedule/schedulePage'));
const MinistryVolunteerPage = lazy(() => import('../erp/ministry/volunteer/volunteerPage'));
const MinistryReportPage = lazy(() => import('../erp/ministry/report/reportPage'));
const EventCalendarPage = lazy(() => import('../erp/event/calendar/calendarPage'));
const EventApplyPage = lazy(() => import('../erp/event/apply/applyPage'));
const EventParticipantPage = lazy(() => import('../erp/event/participant/participantPage'));
const EventResultPage = lazy(() => import('../erp/event/result/resultPage'));
const FacilityReservationPage = lazy(() => import('../erp/facility/reservation/reservationPage'));
const FacilityVehiclePage = lazy(() => import('../erp/facility/vehicle/vehiclePage'));
const FacilityInventoryPage = lazy(() => import('../erp/facility/inventory/inventoryPage'));
const FacilityMaintenancePage = lazy(() => import('../erp/facility/maintenance/maintenancePage'));
const CommNoticePage = lazy(() => import('../erp/comm/notice/noticePage'));
const CommMessagePage = lazy(() => import('../erp/comm/message/messagePage'));
const CommPrayerPage = lazy(() => import('../erp/comm/prayer/prayerPage'));
const CommNewsletterPage = lazy(() => import('../erp/comm/newsletter/newsletterPage'));
const StatsDashboardPage = lazy(() => import('../erp/stats/dashboard/dashboardPage'));
const StatsAttendancePage = lazy(() => import('../erp/stats/attendance/attendancePage'));
const StatsOfferingPage = lazy(() => import('../erp/stats/offering/offeringPage'));
const StatsMinistryPage = lazy(() => import('../erp/stats/ministry/ministryPage'));
const AdminCertificatePage = lazy(() => import('../erp/admin/certificate/certificatePage'));
const AdminApprovalPage = lazy(() => import('../erp/admin/approval/approvalPage'));
const AdminMinutesPage = lazy(() => import('../erp/admin/minutes/minutesPage'));
const AdminArchivePage = lazy(() => import('../erp/admin/archive/archivePage'));

export const erpRoutes: RouteObject[] = [
  {
    path: '/erp',
    element: (
      <ProtectedRoute>
        <MainLayout showChatbot={false} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ErpIndexPage /> },

      // humen
      {
        path: 'humen',
        element: <SubmenuLayout />,
        children: [
          { path: 'manager', element: <HumenManagerPage /> },
          { path: 'district', element: <HumenDistrictPage /> },
          { path: 'newcomer', element: <HumenNewcomerPage /> },
          { path: 'change', element: <HumenChangePage /> },
        ],
      },

      // sermon
      {
        path: 'sermon',
        element: <SubmenuLayout />,
        children: [
          { path: 'manager', element: <SermonManagerPage /> },
          { path: 'archive', element: <SermonArchivePage /> },
          { path: 'attendance', element: <SermonAttendancePage /> },
          { path: 'write', element: <SermonWritePage /> },
          { path: 'order', element: <SermonOrderPage /> },
        ],
      },

      // account
      {
        path: 'account',
        element: <SubmenuLayout />,
        children: [
          { path: 'manager', element: <AccountManagerPage /> },
          { path: 'input', element: <AccountInputPage /> },
          { path: 'budget', element: <AccountBudgetPage /> },
          { path: 'expense', element: <AccountExpensePage /> },
          { path: 'report', element: <AccountReportPage /> },
        ],
      },

      // training
      {
        path: 'training',
        element: <SubmenuLayout />,
        children: [
          { path: 'course', element: <TrainingCoursePage /> },
          { path: 'student', element: <TrainingStudentPage /> },
          { path: 'attendance', element: <TrainingAttendancePage /> },
          { path: 'complete', element: <TrainingCompletePage /> },
        ],
      },

      // ministry
      {
        path: 'ministry',
        element: <SubmenuLayout />,
        children: [
          { path: 'department', element: <MinistryDepartmentPage /> },
          { path: 'schedule', element: <MinistrySchedulePage /> },
          { path: 'volunteer', element: <MinistryVolunteerPage /> },
          { path: 'report', element: <MinistryReportPage /> },
        ],
      },

      // event
      {
        path: 'event',
        element: <SubmenuLayout />,
        children: [
          { path: 'calendar', element: <EventCalendarPage /> },
          { path: 'apply', element: <EventApplyPage /> },
          { path: 'participant', element: <EventParticipantPage /> },
          { path: 'result', element: <EventResultPage /> },
        ],
      },

      // facility
      {
        path: 'facility',
        element: <SubmenuLayout />,
        children: [
          { path: 'reservation', element: <FacilityReservationPage /> },
          { path: 'vehicle', element: <FacilityVehiclePage /> },
          { path: 'inventory', element: <FacilityInventoryPage /> },
          { path: 'maintenance', element: <FacilityMaintenancePage /> },
        ],
      },

      // comm
      {
        path: 'comm',
        element: <SubmenuLayout />,
        children: [
          { path: 'notice', element: <CommNoticePage /> },
          { path: 'message', element: <CommMessagePage /> },
          { path: 'prayer', element: <CommPrayerPage /> },
          { path: 'newsletter', element: <CommNewsletterPage /> },
        ],
      },

      // stats
      {
        path: 'stats',
        element: <SubmenuLayout />,
        children: [
          { path: 'dashboard', element: <StatsDashboardPage /> },
          { path: 'attendance', element: <StatsAttendancePage /> },
          { path: 'offering', element: <StatsOfferingPage /> },
          { path: 'ministry', element: <StatsMinistryPage /> },
        ],
      },

      // admin
      {
        path: 'admin',
        element: <SubmenuLayout />,
        children: [
          { path: 'certificate', element: <AdminCertificatePage /> },
          { path: 'approval', element: <AdminApprovalPage /> },
          { path: 'minutes', element: <AdminMinutesPage /> },
          { path: 'archive', element: <AdminArchivePage /> },
        ],
      },
    ],
  },
];