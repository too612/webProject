import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ErpLayout from '../layouts/ErpLayout';
import ErpIndexPage from '../pages/erp/ErpIndexPage';

// humen
import HumenManagerPage from '../pages/erp/humen/HumenManagerPage';
import HumenDistrictPage from '../pages/erp/humen/HumenDistrictPage';
import HumenNewcomerPage from '../pages/erp/humen/HumenNewcomerPage';
import HumenChangePage from '../pages/erp/humen/HumenChangePage';

// sermon
import SermonManagerPage from '../pages/erp/sermon/SermonManagerPage';
import SermonArchivePage from '../pages/erp/sermon/SermonArchivePage';
import SermonAttendancePage from '../pages/erp/sermon/SermonAttendancePage';
import SermonWritePage from '../pages/erp/sermon/SermonWritePage';
import SermonOrderPage from '../pages/erp/sermon/SermonOrderPage';

// account
import AccountManagerPage from '../pages/erp/account/AccountManagerPage';
import AccountInputPage from '../pages/erp/account/AccountInputPage';
import AccountBudgetPage from '../pages/erp/account/AccountBudgetPage';
import AccountExpensePage from '../pages/erp/account/AccountExpensePage';
import AccountReportPage from '../pages/erp/account/AccountReportPage';

// training
import TrainingCoursePage from '../pages/erp/training/TrainingCoursePage';
import TrainingStudentPage from '../pages/erp/training/TrainingStudentPage';
import TrainingAttendancePage from '../pages/erp/training/TrainingAttendancePage';
import TrainingCompletePage from '../pages/erp/training/TrainingCompletePage';

// ministry
import MinistryDepartmentPage from '../pages/erp/ministry/MinistryDepartmentPage';
import MinistrySchedulePage from '../pages/erp/ministry/MinistrySchedulePage';
import MinistryVolunteerPage from '../pages/erp/ministry/MinistryVolunteerPage';
import MinistryReportPage from '../pages/erp/ministry/MinistryReportPage';

// event
import EventCalendarPage from '../pages/erp/event/EventCalendarPage';
import EventApplyPage from '../pages/erp/event/EventApplyPage';
import EventParticipantPage from '../pages/erp/event/EventParticipantPage';
import EventResultPage from '../pages/erp/event/EventResultPage';

// facility
import FacilityReservationPage from '../pages/erp/facility/FacilityReservationPage';
import FacilityVehiclePage from '../pages/erp/facility/FacilityVehiclePage';
import FacilityInventoryPage from '../pages/erp/facility/FacilityInventoryPage';
import FacilityMaintenancePage from '../pages/erp/facility/FacilityMaintenancePage';

// comm
import CommNoticePage from '../pages/erp/comm/CommNoticePage';
import CommMessagePage from '../pages/erp/comm/CommMessagePage';
import CommPrayerPage from '../pages/erp/comm/CommPrayerPage';
import CommNewsletterPage from '../pages/erp/comm/CommNewsletterPage';

// stats
import StatsDashboardPage from '../pages/erp/stats/StatsDashboardPage';
import StatsAttendancePage from '../pages/erp/stats/StatsAttendancePage';
import StatsOfferingPage from '../pages/erp/stats/StatsOfferingPage';
import StatsMinistryPage from '../pages/erp/stats/StatsMinistryPage';

// admin
import AdminCertificatePage from '../pages/erp/admin/AdminCertificatePage';
import AdminApprovalPage from '../pages/erp/admin/AdminApprovalPage';
import AdminMinutesPage from '../pages/erp/admin/AdminMinutesPage';
import AdminArchivePage from '../pages/erp/admin/AdminArchivePage';

export const erpRoutes: RouteObject[] = [
  {
    path: '/erp',
    element: (
      <ProtectedRoute>
        <ErpLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ErpIndexPage /> },

      // humen
      { path: 'humen/manager', element: <HumenManagerPage /> },
      { path: 'humen/district', element: <HumenDistrictPage /> },
      { path: 'humen/newcomer', element: <HumenNewcomerPage /> },
      { path: 'humen/change', element: <HumenChangePage /> },

      // sermon
      { path: 'sermon/manager', element: <SermonManagerPage /> },
      { path: 'sermon/archive', element: <SermonArchivePage /> },
      { path: 'sermon/attendance', element: <SermonAttendancePage /> },
      { path: 'sermon/write', element: <SermonWritePage /> },
      { path: 'sermon/order', element: <SermonOrderPage /> },

      // account
      { path: 'account/manager', element: <AccountManagerPage /> },
      { path: 'account/input', element: <AccountInputPage /> },
      { path: 'account/budget', element: <AccountBudgetPage /> },
      { path: 'account/expense', element: <AccountExpensePage /> },
      { path: 'account/report', element: <AccountReportPage /> },

      // training
      { path: 'training/course', element: <TrainingCoursePage /> },
      { path: 'training/student', element: <TrainingStudentPage /> },
      { path: 'training/attendance', element: <TrainingAttendancePage /> },
      { path: 'training/complete', element: <TrainingCompletePage /> },

      // ministry
      { path: 'ministry/department', element: <MinistryDepartmentPage /> },
      { path: 'ministry/schedule', element: <MinistrySchedulePage /> },
      { path: 'ministry/volunteer', element: <MinistryVolunteerPage /> },
      { path: 'ministry/report', element: <MinistryReportPage /> },

      // event
      { path: 'event/calendar', element: <EventCalendarPage /> },
      { path: 'event/apply', element: <EventApplyPage /> },
      { path: 'event/participant', element: <EventParticipantPage /> },
      { path: 'event/result', element: <EventResultPage /> },

      // facility
      { path: 'facility/reservation', element: <FacilityReservationPage /> },
      { path: 'facility/vehicle', element: <FacilityVehiclePage /> },
      { path: 'facility/inventory', element: <FacilityInventoryPage /> },
      { path: 'facility/maintenance', element: <FacilityMaintenancePage /> },

      // comm
      { path: 'comm/notice', element: <CommNoticePage /> },
      { path: 'comm/message', element: <CommMessagePage /> },
      { path: 'comm/prayer', element: <CommPrayerPage /> },
      { path: 'comm/newsletter', element: <CommNewsletterPage /> },

      // stats
      { path: 'stats/dashboard', element: <StatsDashboardPage /> },
      { path: 'stats/attendance', element: <StatsAttendancePage /> },
      { path: 'stats/offering', element: <StatsOfferingPage /> },
      { path: 'stats/ministry', element: <StatsMinistryPage /> },

      // admin
      { path: 'admin/certificate', element: <AdminCertificatePage /> },
      { path: 'admin/approval', element: <AdminApprovalPage /> },
      { path: 'admin/minutes', element: <AdminMinutesPage /> },
      { path: 'admin/archive', element: <AdminArchivePage /> },
    ],
  },
];