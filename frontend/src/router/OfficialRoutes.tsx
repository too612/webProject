import { Navigate, type RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PastorPage from '../official/about/pastor/pastorPage';
import BeliefsPage from '../official/about/beliefs/beliefsPage';
import HistoryPage from '../official/about/history/historyPage';
import VisionPage from '../official/about/vision/visionPage';
import SubmenuLayout from '../layouts/SubmenuLayout';
import OfficialIndexPage from '../official/index/officialIndexPage';
import ChildrenPage from '../official/ministries/children/childrenPage';
import { ChildrenViewPage, ChildrenWritePage } from '../official/ministries/children/childrenPage';
import MissionPage, { MissionViewPage, MissionWritePage } from '../official/ministries/mission/missionPage';
import YouthPage from '../official/ministries/youth/youthPage';
import { YouthViewPage, YouthWritePage } from '../official/ministries/youth/youthPage';
import AnnouncementPage from '../official/news/announcement/announcementPage';
import { AnnouncementViewPage, AnnouncementWritePage } from '../official/news/announcement/announcementPage';
import BulletinPage from '../official/news/bulletin/bulletinPage';
import { BulletinViewPage, BulletinWritePage } from '../official/news/bulletin/bulletinPage';
import EventPage from '../official/news/event/eventPage';
import RegistrationPage from '../official/news/registration/registrationPage';
import { RegistrationViewPage, RegistrationWritePage } from '../official/news/registration/registrationPage';
import FaqPage from '../official/support/faq/faqPage';
import LocationPage from '../official/support/location/locationPage';
import QnaPage from '../official/support/qna/qnaPage';
import { QnaViewPage, QnaWritePage } from '../official/support/qna/qnaPage';
import LivePage from '../official/worship/live/livePage';
import SermonsPage, { SermonsViewPage, SermonsWritePage } from '../official/worship/sermons/sermonsPage';
import WorshipTimePage from '../official/worship/time/worshipTimePage';

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
    ],
  },
];