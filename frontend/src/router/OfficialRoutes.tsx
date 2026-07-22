/**
 * File Name   : OfficialRoutes
 * Description : official 도메인 라우트 정의
 */
import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SubmenuLayout from "../layouts/SubmenuLayout";

const OfficialIndexPage = lazy(
  () => import("../official/index/officialIndexPage"),
);
const PastorPage = lazy(() => import("../official/about/pastor/pastorPage"));
const PeoplePage = lazy(() => import("../official/about/people/peoplePage"));
const HistoryPage = lazy(() => import("../official/about/history/historyPage"));
const CellGroupPage = lazy(
  () => import("../official/training/cellgroup/cellGroupPage"),
);
const CoursePage = lazy(() => import("../official/training/course/coursePage"));
const ServiceGroupPage = lazy(
  () => import("../official/training/servicegroup/serviceGroupPage"),
);
const WorshipTimePage = lazy(
  () => import("../official/worship/time/worshipTimePage"),
);
const LivePage = lazy(() => import("../official/worship/live/livePage"));
const SermonsList = lazy(
  () => import("../official/worship/sermons/sermonsList"),
);
const SermonsView = lazy(
  () => import("../official/worship/sermons/sermonsView"),
);
const SermonsWrite = lazy(
  () => import("../official/worship/sermons/sermonsWrite"),
);
const SchoolPage = lazy(() => import("../official/nextgen/school/schoolPage"));
const SchoolView = lazy(() => import("../official/nextgen/school/schoolView"));
const SchoolWrite = lazy(
  () => import("../official/nextgen/school/schoolWrite"),
);
const YouthPage = lazy(() => import("../official/nextgen/youth/youthPage"));
const YouthView = lazy(() => import("../official/nextgen/youth/youthView"));
const YouthWrite = lazy(() => import("../official/nextgen/youth/youthWrite"));

const NoticeList = lazy(() => import("../official/news/notice/noticeList"));
const NoticeView = lazy(() => import("../official/news/notice/noticeView"));
const NoticeWrite = lazy(() => import("../official/news/notice/noticeWrite"));

const GalleryList = lazy(() => import("../official/news/gallery/galleryList"));
const GalleryView = lazy(() => import("../official/news/gallery/galleryView"));
const GalleryWrite = lazy(
  () => import("../official/news/gallery/galleryWrite"),
);

const BulletinList = lazy(
  () => import("../official/news/bulletin/bulletinList"),
);
const BulletinView = lazy(
  () => import("../official/news/bulletin/bulletinView"),
);
const BulletinWrite = lazy(
  () => import("../official/news/bulletin/bulletinWrite"),
);

// ★ 배너 관리 (List/View/Write 분리)
const BannerList = lazy(() => import("../official/news/banner/bannerList"));
const BannerView = lazy(() => import("../official/news/banner/bannerView"));
const BannerWrite = lazy(() => import("../official/news/banner/bannerWrite"));

const OutreachPage = lazy(
  () => import("../official/training/outreach/outreachPage"),
);
const OutreachView = lazy(
  () => import("../official/training/outreach/outreachView"),
);
const OutreachWrite = lazy(
  () => import("../official/training/outreach/outreachWrite"),
);
const MissionPage = lazy(() => import("../official/news/mission/missionPage"));
const NextstepsPage = lazy(
  () => import("../official/news/nextsteps/nextstepsPage"),
);
const LocationPage = lazy(
  () => import("../official/about/location/locationPage"),
);

export const officialRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <OfficialIndexPage /> },
      { path: "official", element: <Navigate to="/" replace /> },
      {
        path: "about",
        element: <SubmenuLayout />,
        children: [
          { path: "pastor", element: <PastorPage /> },
          { path: "people", element: <PeoplePage /> },
          { path: "history", element: <HistoryPage /> },
          { path: "location", element: <LocationPage /> },
        ],
      },
      {
        path: "worship",
        element: <SubmenuLayout />,
        children: [
          { path: "time", element: <WorshipTimePage /> },
          { path: "live", element: <LivePage /> },
          { path: "sermons", element: <SermonsList /> },
          { path: "sermons/view", element: <SermonsView /> },
          { path: "sermons/write", element: <SermonsWrite /> },
        ],
      },
      {
        path: "training",
        element: <SubmenuLayout />,
        children: [
          { path: "cellgroup", element: <CellGroupPage /> },
          { path: "course", element: <CoursePage /> },
          { path: "servicegroup", element: <ServiceGroupPage /> },
          { path: "outreach", element: <OutreachPage /> },
          { path: "outreach/view", element: <OutreachView /> },
          { path: "outreach/write", element: <OutreachWrite /> },
        ],
      },
      {
        path: "nextgen",
        element: <SubmenuLayout />,
        children: [
          {
            path: "school",
            element: <SchoolPage />,
          },
          { path: "school/view", element: <SchoolView /> },
          { path: "school/write", element: <SchoolWrite /> },
          {
            path: "youth",
            element: <YouthPage />,
          },
          { path: "youth/view", element: <YouthView /> },
          { path: "youth/write", element: <YouthWrite /> },
        ],
      },
      {
        path: "news",
        element: <SubmenuLayout />,
        children: [
          { path: "notice", element: <NoticeList /> },
          { path: "notice/view", element: <NoticeView /> },
          { path: "notice/write", element: <NoticeWrite /> },
          { path: "gallery", element: <GalleryList /> },
          { path: "gallery/view", element: <GalleryView /> },
          { path: "gallery/write", element: <GalleryWrite /> },
          { path: "bulletin", element: <BulletinList /> },
          { path: "bulletin/view", element: <BulletinView /> },
          { path: "bulletin/write", element: <BulletinWrite /> },
          // ★ 배너 관리
          { path: "banner", element: <BannerList /> },
          { path: "banner/view", element: <BannerView /> },
          { path: "banner/write", element: <BannerWrite /> },
          { path: "mission", element: <MissionPage /> },
          { path: "nextsteps", element: <NextstepsPage /> },
        ],
      },
    ],
  },
];
