import { Navigate, type RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';
import BeliefsPage from '../pages/official/about/BeliefsPage';
import HistoryPage from '../pages/official/about/HistoryPage';
import PastorPage from '../pages/official/about/PastorPage';
import VisionPage from '../pages/official/about/VisionPage';
import AdminDashboardPage from '../pages/official/admin/AdminDashboardPage';
import AdminLoginPage from '../pages/official/admin/AdminLoginPage';
import AdminRegisterPage from '../pages/official/admin/AdminRegisterPage';
import OfficialIndexPage from '../pages/official/index/OfficialIndexPage';
import ChildrenPage from '../pages/official/ministries/ChildrenPage';
import ChildrenViewPage from '../pages/official/ministries/ChildrenViewPage';
import ChildrenWritePage from '../pages/official/ministries/ChildrenWritePage';
import MissionPage from '../pages/official/ministries/MissionPage';
import MissionViewPage from '../pages/official/ministries/MissionViewPage';
import MissionWritePage from '../pages/official/ministries/MissionWritePage';
import YouthPage from '../pages/official/ministries/YouthPage';
import YouthViewPage from '../pages/official/ministries/YouthViewPage';
import YouthWritePage from '../pages/official/ministries/YouthWritePage';
import AnnouncementPage from '../pages/official/news/AnnouncementPage';
import AnnouncementViewPage from '../pages/official/news/AnnouncementViewPage';
import AnnouncementWritePage from '../pages/official/news/AnnouncementWritePage';
import BulletinPage from '../pages/official/news/BulletinPage';
import BulletinViewPage from '../pages/official/news/BulletinViewPage';
import BulletinWritePage from '../pages/official/news/BulletinWritePage';
import EventPage from '../pages/official/news/EventPage';
import RegistrationPage from '../pages/official/news/RegistrationPage';
import RegistrationViewPage from '../pages/official/news/RegistrationViewPage';
import RegistrationWritePage from '../pages/official/news/RegistrationWritePage';
import FaqPage from '../pages/official/support/FaqPage';
import LocationPage from '../pages/official/support/LocationPage';
import QnaPage from '../pages/official/support/QnaPage';
import QnaViewPage from '../pages/official/support/QnaViewPage';
import QnaWritePage from '../pages/official/support/QnaWritePage';
import LivePage from '../pages/official/worship/LivePage';
import SermonsPage from '../pages/official/worship/SermonsPage';
import SermonsViewPage from '../pages/official/worship/SermonsViewPage';
import SermonsWritePage from '../pages/official/worship/SermonsWritePage';
import WorshipTimePage from '../pages/official/worship/WorshipTimePage';

export const officialRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <OfficialIndexPage />,
      },
      {
        path: 'official',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'about',
        element: <SubmenuLayout />,
        children: [
          { path: 'pastor', element: <PastorPage /> },
          { path: 'vision', element: <VisionPage /> },
          { path: 'history', element: <HistoryPage /> },
          { path: 'beliefs', element: <BeliefsPage /> },
        ],
      },
      {
        path: 'worship',
        element: <SubmenuLayout />,
        children: [
          { path: 'time', element: <WorshipTimePage /> },
          { path: 'live', element: <LivePage /> },
          { path: 'sermons', element: <SermonsPage /> },
          { path: 'sermons/view', element: <SermonsViewPage /> },
          { path: 'sermonsView', element: <SermonsViewPage /> },
          { path: 'sermons/write', element: <SermonsWritePage /> },
          { path: 'sermonsWrite', element: <SermonsWritePage /> },
        ],
      },
      {
        path: 'ministries',
        element: <SubmenuLayout />,
        children: [
          { path: 'children', element: <ChildrenPage /> },
          { path: 'children/view', element: <ChildrenViewPage /> },
          { path: 'childrenView', element: <ChildrenViewPage /> },
          { path: 'children/write', element: <ChildrenWritePage /> },
          { path: 'childrenWrite', element: <ChildrenWritePage /> },
          { path: 'youth', element: <YouthPage /> },
          { path: 'youth/view', element: <YouthViewPage /> },
          { path: 'youthView', element: <YouthViewPage /> },
          { path: 'youth/write', element: <YouthWritePage /> },
          { path: 'youthWrite', element: <YouthWritePage /> },
          { path: 'mission', element: <MissionPage /> },
          { path: 'mission/view', element: <MissionViewPage /> },
          { path: 'missionView', element: <MissionViewPage /> },
          { path: 'mission/write', element: <MissionWritePage /> },
          { path: 'missionWrite', element: <MissionWritePage /> },
        ],
      },
      {
        path: 'news',
        element: <SubmenuLayout />,
        children: [
          { path: 'event', element: <EventPage /> },
          { path: 'announcement', element: <AnnouncementPage /> },
          { path: 'announcement/view', element: <AnnouncementViewPage /> },
          { path: 'announcementView', element: <AnnouncementViewPage /> },
          { path: 'announcement/write', element: <AnnouncementWritePage /> },
          { path: 'announcementWrite', element: <AnnouncementWritePage /> },
          { path: 'bulletin', element: <BulletinPage /> },
          { path: 'bulletin/view', element: <BulletinViewPage /> },
          { path: 'bulletinView', element: <BulletinViewPage /> },
          { path: 'bulletin/write', element: <BulletinWritePage /> },
          { path: 'bulletinWrite', element: <BulletinWritePage /> },
          { path: 'registration', element: <RegistrationPage /> },
          { path: 'registration/view', element: <RegistrationViewPage /> },
          { path: 'registrationView', element: <RegistrationViewPage /> },
          { path: 'registration/write', element: <RegistrationWritePage /> },
          { path: 'registrationWrite', element: <RegistrationWritePage /> },
        ],
      },
      {
        path: 'support',
        element: <SubmenuLayout />,
        children: [
          { path: 'location', element: <LocationPage /> },
          { path: 'faq', element: <FaqPage /> },
          { path: 'qna', element: <QnaPage /> },
          { path: 'qna/view', element: <QnaViewPage /> },
          { path: 'qnaView', element: <QnaViewPage /> },
          { path: 'qna/write', element: <QnaWritePage /> },
          { path: 'qnaWrite', element: <QnaWritePage /> },
        ],
      },

      { path: 'admin/admin', element: <AdminDashboardPage /> },
      { path: 'admin/login', element: <AdminLoginPage /> },
      { path: 'admin/register', element: <AdminRegisterPage /> },
    ],
  },
];