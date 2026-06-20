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
const PeoplePage = lazy(() => import('../official/about/people/peoplePage'));
const HistoryPage = lazy(() => import('../official/about/history/historyPage'));
const CellGroupPage = lazy(() => import('../official/training/cellgroup/cellGroupPage'));
const CoursePage = lazy(() => import('../official/training/course/coursePage'));
const ServiceGroupPage = lazy(() => import('../official/training/servicegroup/serviceGroupPage'));
const WorshipTimePage = lazy(() => import('../official/worship/time/worshipTimePage'));
const LivePage = lazy(() => import('../official/worship/live/livePage'));
const SermonsList = lazy(() => import('../official/worship/sermons/sermonsList'));
const SermonsView = lazy(() => import('../official/worship/sermons/sermonsView'));
const SermonsWrite = lazy(() => import('../official/worship/sermons/sermonsWrite'));
const ChildrenPage = lazy(() => import('../official/nextgen/school/childrenPage'));
const ChildrenViewPage = lazy(() => import('../official/nextgen/school/childrenPage').then((m) => ({ default: m.ChildrenViewPage })));
const YouthPage = lazy(() => import('../official/nextgen/youth/youthPage'));
const YouthViewPage = lazy(() => import('../official/nextgen/youth/youthPage').then((m) => ({ default: m.YouthViewPage })));
const YouthWritePage = lazy(() => import('../official/nextgen/youth/youthPage').then((m) => ({ default: m.YouthWritePage })));
const NoticePage = lazy(() => import('../official/news/notice/noticePage'));
const NoticeViewPage = lazy(() => import('../official/news/notice/noticePage').then((m) => ({ default: m.NoticeViewPage })));
const NoticeWritePage = lazy(() => import('../official/news/notice/noticePage').then((m) => ({ default: m.NoticeWritePage })));
const BulletinPage = lazy(() => import('../official/news/bulletin/bulletinPage'));
const BulletinViewPage = lazy(() => import('../official/news/bulletin/bulletinPage').then((m) => ({ default: m.BulletinViewPage })));
const BulletinWritePage = lazy(() => import('../official/news/bulletin/bulletinPage').then((m) => ({ default: m.BulletinWritePage })));
const OutreachPage = lazy(() => import('../official/training/outreach/outreachPage'));
const GalleryPage = lazy(() => import('../official/news/gallery/galleryPage'));
const MissionPage = lazy(() => import('../official/news/mission/missionPage'));
const NextstepsPage = lazy(() => import('../official/news/nextsteps/nextstepsPage'));
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
          { path: 'pastor', element: <PastorPage /> }, { path: 'people', element: <PeoplePage /> },
          { path: 'history', element: <HistoryPage /> },
          { path: 'location', element: <LocationPage /> }, { path: 'qna', element: <QnaPage title="Q&A" breadcrumb="Q&A" viewPath="/about/qna/view" writePath="/about/qna/write" /> },
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
        path: 'training', element: <SubmenuLayout />,
        children: [
          { path: 'cellgroup', element: <CellGroupPage /> },
          { path: 'course', element: <CoursePage /> },
          { path: 'servicegroup', element: <ServiceGroupPage /> },
          { path: 'outreach', element: <OutreachPage /> },
        ],
      },
      {
        path: 'nextgen', element: <SubmenuLayout />,
        children: [
          { path: 'school', element: <ChildrenPage title="아동사역" breadcrumb="아동사역" viewPath="/nextgen/school/view" writePath="/nextgen/school/write" /> }, { path: 'school/view', element: <ChildrenViewPage /> },
          { path: 'youth', element: <YouthPage title="청년사역" breadcrumb="청년사역" viewPath="/nextgen/youth/view" writePath="/nextgen/youth/write" /> }, { path: 'youth/view', element: <YouthViewPage /> }, { path: 'youth/write', element: <YouthWritePage /> },
        ],
      },
      {
        path: 'news', element: <SubmenuLayout />,
        children: [
          { path: 'notice', element: <NoticePage title="공지사항" breadcrumb="공지사항" viewPath="/news/notice/view" writePath="/news/notice/write" /> }, { path: 'notice/view', element: <NoticeViewPage /> }, { path: 'notice/write', element: <NoticeWritePage /> },
          { path: 'bulletin', element: <BulletinPage title="주보" breadcrumb="주보" viewPath="/news/bulletin/view" writePath="/news/bulletin/write" /> }, { path: 'bulletin/view', element: <BulletinViewPage /> }, { path: 'bulletin/write', element: <BulletinWritePage /> },
          { path: 'gallery', element: <GalleryPage /> },
          { path: 'mission', element: <MissionPage /> },
          { path: 'nextsteps', element: <NextstepsPage /> },
        ],
      },
    ],
  },
];