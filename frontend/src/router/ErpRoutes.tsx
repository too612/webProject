import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ErpLayout from '../layouts/ErpLayout';
import ErpIndexPage from '../pages/erp/ErpIndexPage';

// humen
import HumenManagerPage from '../pages/erp/humen/manager';
import HumenDistrictPage from '../pages/erp/humen/district';
import HumenNewcomerPage from '../pages/erp/humen/newcomer';
import HumenChangePage from '../pages/erp/humen/change';

// sermon
import SermonManagerPage from '../pages/erp/sermon/manager';
import SermonArchivePage from '../pages/erp/sermon/archive';
import SermonAttendancePage from '../pages/erp/sermon/attendance';
import SermonWritePage from '../pages/erp/sermon/write';
import SermonOrderPage from '../pages/erp/sermon/order';

// account
import AccountManagerPage from '../pages/erp/account/manager';
import AccountInputPage from '../pages/erp/account/input';
import AccountBudgetPage from '../pages/erp/account/budget';
import AccountExpensePage from '../pages/erp/account/expense';
import AccountReportPage from '../pages/erp/account/report';

// training
import TrainingCoursePage from '../pages/erp/training/course';
import TrainingStudentPage from '../pages/erp/training/student';
import TrainingAttendancePage from '../pages/erp/training/attendance';
import TrainingCompletePage from '../pages/erp/training/complete';

// ministry
import MinistryDepartmentPage from '../pages/erp/ministry/department';
import MinistrySchedulePage from '../pages/erp/ministry/schedule';
import MinistryVolunteerPage from '../pages/erp/ministry/volunteer';
import MinistryReportPage from '../pages/erp/ministry/report';

// event
import EventCalendarPage from '../pages/erp/event/calendar';
import EventApplyPage from '../pages/erp/event/apply';
import EventParticipantPage from '../pages/erp/event/participant';
import EventResultPage from '../pages/erp/event/result';

// facility
import FacilityReservationPage from '../pages/erp/facility/reservation';
import FacilityVehiclePage from '../pages/erp/facility/vehicle';
import FacilityInventoryPage from '../pages/erp/facility/inventory';
import FacilityMaintenancePage from '../pages/erp/facility/maintenance';

// comm
import CommNoticePage from '../pages/erp/comm/notice';
import CommMessagePage from '../pages/erp/comm/message';
import CommPrayerPage from '../pages/erp/comm/prayer';
import CommNewsletterPage from '../pages/erp/comm/newsletter';

// stats
import StatsDashboardPage from '../pages/erp/stats/dashboard';
import StatsAttendancePage from '../pages/erp/stats/attendance';
import StatsOfferingPage from '../pages/erp/stats/offering';
import StatsMinistryPage from '../pages/erp/stats/ministry';

// admin
import AdminCertificatePage from '../pages/erp/admin/certificate';
import AdminApprovalPage from '../pages/erp/admin/approval';
import AdminMinutesPage from '../pages/erp/admin/minutes';
import AdminArchivePage from '../pages/erp/admin/archive';

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