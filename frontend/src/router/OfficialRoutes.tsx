/**
 * File Name   : OfficialRoutes
 * Description : official 도메인 라우트 정의
 */
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
const SermonsList = lazy(() => import('../official/worship/sermons/sermonsList'));
const SermonsView = lazy(() => import('../official/worship/sermons/sermonsView'));
const SermonsWrite = lazy(() => import('../official/worship/sermons/sermonsWrite'));
const ChildrenPage = lazy(() => import('../official/news/children/childrenPage'));
const ChildrenViewPage = lazy(() => import('../official/news/children/childrenPage').then((m) => ({ default: m.ChildrenViewPage })));
const ChildrenWritePage = lazy(() => import('../official/news/children/childrenPage').then((m) => ({ default: m.ChildrenWritePage })));
const YouthPage = lazy(() => import('../official/news/youth/youthPage'));
const YouthViewPage = lazy(() => import('../official/news/youth/youthPage').then((m) => ({ default: m.YouthViewPage })));
const YouthWritePage = lazy(() => import('../official/news/youth/youthPage').then((m) => ({ default: m.YouthWritePage })));
const MissionPage = lazy(() => import('../official/news/mission/missionPage'));
const MissionViewPage = lazy(() => import('../official/news/mission/missionPage').then((m) => ({ default: m.MissionViewPage })));
const MissionWritePage = lazy(() => import('../official/news/mission/missionPage').then((m) => ({ default: m.MissionWritePage })));
const AnnouncementPage = lazy(() => import('../official/support/announcement/announcementPage'));
const AnnouncementViewPage = lazy(() => import('../official/support/announcement/announcementPage').then((m) => ({ default: m.AnnouncementViewPage })));
const AnnouncementWritePage = lazy(() => import('../official/support/announcement/announcementPage').then((m) => ({ default: m.AnnouncementWritePage })));
const BulletinPage = lazy(() => import('../official/support/bulletin/bulletinPage'));
const BulletinViewPage = lazy(() => import('../official/support/bulletin/bulletinPage').then((m) => ({ default: m.BulletinViewPage })));
const BulletinWritePage = lazy(() => import('../official/support/bulletin/bulletinPage').then((m) => ({ default: m.BulletinWritePage })));
const EventPage = lazy(() => import('../official/news/event/eventPage'));
const RegistrationPage = lazy(() => import('../official/ministries/registration/registrationPage'));
const RegistrationViewPage = lazy(() => import('../official/ministries/registration/registrationPage').then((m) => ({ default: m.RegistrationViewPage })));
const RegistrationWritePage = lazy(() => import('../official/ministries/registration/registrationPage').then((m) => ({ default: m.RegistrationWritePage })));
const FaqPage = lazy(() => import('../official/support/faq/faqPage'));
const LocationPage = lazy(() => import('../official/about/location/locationPage'));
const QnaPage = lazy(() => import('../official/about/qna/qnaPage'));
const QnaViewPage = lazy(() => import('../official/about/qna/qnaPage').then((m) => ({ default: m.QnaViewPage })));
const QnaWritePage = lazy(() => import('../official/about/qna/qnaPage').then((m) => ({ default: m.QnaWritePage })));

export const officialRoutes: RouteObject[] = [
  {
    path: '/', element: <MainLayout />,
    children: [
      { index: true, element: <OfficialIndexPage /> },
      { path: 'official', element: <Navigate to="/" replace /> },
      {
        path: 'about', element: <SubmenuLayout />,
        children: [
          { path: 'pastor', element: <PastorPage /> }, { path: 'vision', element: <VisionPage /> },
          { path: 'history', element: <HistoryPage /> }, { path: 'congregation', element: <CongregationPage /> },
          { path: 'location', element: <LocationPage /> }, { path: 'qna', element: <QnaPage /> },
          { path: 'qna/view', element: <QnaViewPage /> }, { path: 'qna/write', element: <QnaWritePage /> },
        ],
      },
      {
        path: 'worship', element: <SubmenuLayout />,
        children: [
          { path: 'time', element: <WorshipTimePage /> }, { path: 'live', element: <LivePage /> },
          { path: 'sermons', element: <SermonsList /> }, { path: 'sermons/view', element: <SermonsView /> },
          { path: 'sermons/write', element: <SermonsWrite /> },
        ],
      },
      {
        path: 'ministries', element: <SubmenuLayout />,
        children: [
          { path: 'registration', element: <RegistrationPage /> }, { path: 'registration/view', element: <RegistrationViewPage /> },
          { path: 'registration/write', element: <RegistrationWritePage /> },
        ],
      },
      {
        path: 'news', element: <SubmenuLayout />,
        children: [
          { path: 'event', element: <EventPage /> },
          { path: 'children', element: <ChildrenPage /> }, { path: 'children/view', element: <ChildrenViewPage /> }, { path: 'children/write', element: <ChildrenWritePage /> },
          { path: 'youth', element: <YouthPage /> }, { path: 'youth/view', element: <YouthViewPage /> }, { path: 'youth/write', element: <YouthWritePage /> },
          { path: 'mission', element: <MissionPage /> }, { path: 'mission/view', element: <MissionViewPage /> }, { path: 'mission/write', element: <MissionWritePage /> },
        ],
      },
      {
        path: 'support', element: <SubmenuLayout />,
        children: [
          { path: 'faq', element: <FaqPage /> },
          { path: 'announcement', element: <AnnouncementPage /> }, { path: 'announcement/view', element: <AnnouncementViewPage /> }, { path: 'announcement/write', element: <AnnouncementWritePage /> },
          { path: 'bulletin', element: <BulletinPage /> }, { path: 'bulletin/view', element: <BulletinViewPage /> }, { path: 'bulletin/write', element: <BulletinWritePage /> },
        ],
      },
    ],
  },
];