import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';
import ErpIndexPage from '../erp/index/erpIndexPage';

// humen
import HumenManagerPage from '../erp/humen/manager/managerPage';
import HumenDistrictPage from '../erp/humen/district/districtPage';
import HumenNewcomerPage from '../erp/humen/newcomer/newcomerPage';
import HumenChangePage from '../erp/humen/change/changePage';

// sermon
import SermonManagerPage from '../erp/sermon/manager/managerPage';
import SermonArchivePage from '../erp/sermon/archive/archivePage';
import SermonAttendancePage from '../erp/sermon/attendance/attendancePage';
import SermonWritePage from '../erp/sermon/write/writePage';
import SermonOrderPage from '../erp/sermon/order/orderPage';

// account
import AccountManagerPage from '../erp/account/manager/managerPage';
import AccountInputPage from '../erp/account/input/inputPage';
import AccountBudgetPage from '../erp/account/budget/budgetPage';
import AccountExpensePage from '../erp/account/expense/expensePage';
import AccountReportPage from '../erp/account/report/reportPage';

// training
import TrainingCoursePage from '../erp/training/course/coursePage';
import TrainingStudentPage from '../erp/training/student/studentPage';
import TrainingAttendancePage from '../erp/training/attendance/attendancePage';
import TrainingCompletePage from '../erp/training/complete/completePage';

// ministry
import MinistryDepartmentPage from '../erp/ministry/department/departmentPage';
import MinistrySchedulePage from '../erp/ministry/schedule/schedulePage';
import MinistryVolunteerPage from '../erp/ministry/volunteer/volunteerPage';
import MinistryReportPage from '../erp/ministry/report/reportPage';

// event
import EventCalendarPage from '../erp/event/calendar/calendarPage';
import EventApplyPage from '../erp/event/apply/applyPage';
import EventParticipantPage from '../erp/event/participant/participantPage';
import EventResultPage from '../erp/event/result/resultPage';

// facility
import FacilityReservationPage from '../erp/facility/reservation/reservationPage';
import FacilityVehiclePage from '../erp/facility/vehicle/vehiclePage';
import FacilityInventoryPage from '../erp/facility/inventory/inventoryPage';
import FacilityMaintenancePage from '../erp/facility/maintenance/maintenancePage';

// comm
import CommNoticePage from '../erp/comm/notice/noticePage';
import CommMessagePage from '../erp/comm/message/messagePage';
import CommPrayerPage from '../erp/comm/prayer/prayerPage';
import CommNewsletterPage from '../erp/comm/newsletter/newsletterPage';

// stats
import StatsDashboardPage from '../erp/stats/dashboard/dashboardPage';
import StatsAttendancePage from '../erp/stats/attendance/attendancePage';
import StatsOfferingPage from '../erp/stats/offering/offeringPage';
import StatsMinistryPage from '../erp/stats/ministry/ministryPage';

// admin
import AdminCertificatePage from '../erp/admin/certificate/certificatePage';
import AdminApprovalPage from '../erp/admin/approval/approvalPage';
import AdminMinutesPage from '../erp/admin/minutes/minutesPage';
import AdminArchivePage from '../erp/admin/archive/archivePage';

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