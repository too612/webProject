import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SubmenuLayout from '../layouts/SubmenuLayout';

const OfficialIndexPage = lazy(() => import('../official/index/officialIndexPage'));
const PastorPage = lazy(() => import('../official/about/pastor/pastorPage'));
const VisionPage = lazy(() => import('../official/about/vision/visionPage'));
const HistoryPage = lazy(() => import('../official/about/history/historyPage'));
const CongregationPage = lazy(() => import('../official/about/congregation/congregationPage'));
const WorshipTimePage = lazy(() => import('../official/worship/time/worshipTimePage'));
const LivePage = lazy(() => import('../official/worship/live/livePage'));
const SermonsPage = lazy(() => import('../official/worship/sermons/sermonsPage'));
const SermonsViewPage = lazy(() => import('../official/worship/sermons/sermonsPage').then((module) => ({ default: module.SermonsViewPage })));
const SermonsWritePage = lazy(() => import('../official/worship/sermons/sermonsPage').then((module) => ({ default: module.SermonsWritePage })));
const ChildrenPage = lazy(() => import('../official/ministries/children/childrenPage'));
const ChildrenViewPage = lazy(() => import('../official/ministries/children/childrenPage').then((module) => ({ default: module.ChildrenViewPage })));
const ChildrenWritePage = lazy(() => import('../official/ministries/children/childrenPage').then((module) => ({ default: module.ChildrenWritePage })));
const YouthPage = lazy(() => import('../official/ministries/youth/youthPage'));
const YouthViewPage = lazy(() => import('../official/ministries/youth/youthPage').then((module) => ({ default: module.YouthViewPage })));
const YouthWritePage = lazy(() => import('../official/ministries/youth/youthPage').then((module) => ({ default: module.YouthWritePage })));
const MissionPage = lazy(() => import('../official/ministries/mission/missionPage'));
const MissionViewPage = lazy(() => import('../official/ministries/mission/missionPage').then((module) => ({ default: module.MissionViewPage })));
const MissionWritePage = lazy(() => import('../official/ministries/mission/missionPage').then((module) => ({ default: module.MissionWritePage })));
const AnnouncementPage = lazy(() => import('../official/news/announcement/announcementPage'));
const AnnouncementViewPage = lazy(() => import('../official/news/announcement/announcementPage').then((module) => ({ default: module.AnnouncementViewPage })));
const AnnouncementWritePage = lazy(() => import('../official/news/announcement/announcementPage').then((module) => ({ default: module.AnnouncementWritePage })));
const BulletinPage = lazy(() => import('../official/news/bulletin/bulletinPage'));
const BulletinViewPage = lazy(() => import('../official/news/bulletin/bulletinPage').then((module) => ({ default: module.BulletinViewPage })));
const BulletinWritePage = lazy(() => import('../official/news/bulletin/bulletinPage').then((module) => ({ default: module.BulletinWritePage })));
const EventPage = lazy(() => import('../official/news/event/eventPage'));
const RegistrationPage = lazy(() => import('../official/news/registration/registrationPage'));
const RegistrationViewPage = lazy(() => import('../official/news/registration/registrationPage').then((module) => ({ default: module.RegistrationViewPage })));
const RegistrationWritePage = lazy(() => import('../official/news/registration/registrationPage').then((module) => ({ default: module.RegistrationWritePage })));
const FaqPage = lazy(() => import('../official/support/faq/faqPage'));
const LocationPage = lazy(() => import('../official/support/location/locationPage'));
const QnaPage = lazy(() => import('../official/support/qna/qnaPage'));
const QnaViewPage = lazy(() => import('../official/support/qna/qnaPage').then((module) => ({ default: module.QnaViewPage })));
const QnaWritePage = lazy(() => import('../official/support/qna/qnaPage').then((module) => ({ default: module.QnaWritePage })));

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
          { path: 'congregation', element: <CongregationPage /> },
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
    ],
  },
];