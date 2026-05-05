import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { menuApi } from '../api/menuApi';
import { useMenuStore } from '../store/menuStore';
import type { MenuItem } from '../types/menu.types';

const fallbackMenus: MenuItem[] = [
    {
        menuId: 'official',
        menuName: '공식',
        path: '/',
        level: 1,
        orderNo: 1,
        subMenus: [],
    },
    {
        menuId: 'community',
        menuName: '공동체',
        path: '/community',
        level: 1,
        orderNo: 2,
        subMenus: [],
    },
    {
        menuId: 'erp',
        menuName: 'ERP',
        path: '/erp',
        level: 1,
        orderNo: 3,
        subMenus: [],
    },
    {
        menuId: 'system',
        menuName: '시스템',
        path: '/system',
        level: 1,
        orderNo: 4,
        subMenus: [],
    },
];

const fallbackMenuBySystem: Record<string, MenuItem[]> = {
    official: [
        {
            menuId: 'official-about',
            menuName: '교회소개',
            path: '/about/pastor',
            level: 1,
            orderNo: 1,
            subMenus: [
                { menuId: 'official-about-pastor', menuName: '담임목사', path: '/about/pastor', parentId: 'official-about', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'official-about-vision', menuName: '비전', path: '/about/vision', parentId: 'official-about', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'official-about-history', menuName: '연혁', path: '/about/history', parentId: 'official-about', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'official-about-beliefs', menuName: '신앙고백', path: '/about/beliefs', parentId: 'official-about', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
        {
            menuId: 'official-worship',
            menuName: '예배',
            path: '/worship/time',
            level: 1,
            orderNo: 2,
            subMenus: [
                { menuId: 'official-worship-time', menuName: '예배시간', path: '/worship/time', parentId: 'official-worship', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'official-worship-live', menuName: '예배실황', path: '/worship/live', parentId: 'official-worship', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'official-worship-sermons', menuName: '주일설교', path: '/worship/sermons', parentId: 'official-worship', level: 2, orderNo: 3, subMenus: [] },
            ],
        },
        {
            menuId: 'official-ministries',
            menuName: '사역',
            path: '/ministries/children',
            level: 1,
            orderNo: 3,
            subMenus: [
                { menuId: 'official-ministries-children', menuName: '어린이사역', path: '/ministries/children', parentId: 'official-ministries', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'official-ministries-youth', menuName: '청년사역', path: '/ministries/youth', parentId: 'official-ministries', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'official-ministries-mission', menuName: '선교사역', path: '/ministries/mission', parentId: 'official-ministries', level: 2, orderNo: 3, subMenus: [] },
            ],
        },
        {
            menuId: 'official-news',
            menuName: '소식',
            path: '/news/announcement',
            level: 1,
            orderNo: 4,
            subMenus: [
                { menuId: 'official-news-announcement', menuName: '공지사항', path: '/news/announcement', parentId: 'official-news', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'official-news-bulletin', menuName: '주보', path: '/news/bulletin', parentId: 'official-news', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'official-news-registration', menuName: '새가족등록', path: '/news/registration', parentId: 'official-news', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'official-news-event', menuName: '행사안내', path: '/news/event', parentId: 'official-news', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
        {
            menuId: 'official-support',
            menuName: '안내',
            path: '/support/location',
            level: 1,
            orderNo: 5,
            subMenus: [
                { menuId: 'official-support-location', menuName: '오시는길', path: '/support/location', parentId: 'official-support', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'official-support-faq', menuName: 'FAQ', path: '/support/faq', parentId: 'official-support', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'official-support-qna', menuName: 'Q&A', path: '/support/qna', parentId: 'official-support', level: 2, orderNo: 3, subMenus: [] },
            ],
        },
    ],
    community: [
        {
            menuId: 'community-group',
            menuName: '소그룹',
            path: '/community/group/manager',
            level: 1,
            orderNo: 1,
            subMenus: [
                { menuId: 'community-group-manager', menuName: '그룹관리', path: '/community/group/manager', parentId: 'community-group', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'community-group-a1', menuName: 'A1 그룹', path: '/community/group/groupa1', parentId: 'community-group', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'community-group-b2', menuName: 'B2 그룹', path: '/community/group/groupb2', parentId: 'community-group', level: 2, orderNo: 3, subMenus: [] },
            ],
        },
        {
            menuId: 'community-facilities',
            menuName: '시설',
            path: '/community/facilities/calendar',
            level: 1,
            orderNo: 2,
            subMenus: [
                { menuId: 'community-facilities-calendar', menuName: '시설달력', path: '/community/facilities/calendar', parentId: 'community-facilities', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'community-facilities-dining', menuName: '식당안내', path: '/community/facilities/dining', parentId: 'community-facilities', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'community-facilities-prayer', menuName: '기도실', path: '/community/facilities/prayer', parentId: 'community-facilities', level: 2, orderNo: 3, subMenus: [] },
            ],
        },
        {
            menuId: 'community-saint',
            menuName: '성도지원',
            path: '/community/saint/family',
            level: 1,
            orderNo: 3,
            subMenus: [
                { menuId: 'community-saint-family', menuName: '가정', path: '/community/saint/family', parentId: 'community-saint', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'community-saint-pray', menuName: '기도', path: '/community/saint/pray', parentId: 'community-saint', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'community-saint-sales', menuName: '재정', path: '/community/saint/sales', parentId: 'community-saint', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'community-saint-job', menuName: '직업', path: '/community/saint/job', parentId: 'community-saint', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
        {
            menuId: 'community-world',
            menuName: '세상읽기',
            path: '/community/world/christian',
            level: 1,
            orderNo: 4,
            subMenus: [
                { menuId: 'community-world-christian', menuName: '기독교', path: '/community/world/christian', parentId: 'community-world', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'community-world-economic', menuName: '경제', path: '/community/world/economic', parentId: 'community-world', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'community-world-health', menuName: '건강', path: '/community/world/health', parentId: 'community-world', level: 2, orderNo: 3, subMenus: [] },
            ],
        },
        {
            menuId: 'community-support',
            menuName: '고객지원',
            path: '/community/support/board',
            level: 1,
            orderNo: 5,
            subMenus: [
                { menuId: 'community-support-board', menuName: '게시판', path: '/community/support/board', parentId: 'community-support', level: 2, orderNo: 1, subMenus: [] },
            ],
        },
    ],
    system: [
        {
            menuId: 'system-user',
            menuName: '사용자관리',
            path: '/system/user/manager',
            level: 1,
            orderNo: 1,
            subMenus: [
                { menuId: 'system-user-manager', menuName: '사용자관리', path: '/system/user/manager', parentId: 'system-user', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'system-user-role', menuName: '권한관리', path: '/system/user/role', parentId: 'system-user', level: 2, orderNo: 2, subMenus: [] },
            ],
        },
        {
            menuId: 'system-config',
            menuName: '환경설정',
            path: '/system/config/code',
            level: 1,
            orderNo: 2,
            subMenus: [
                { menuId: 'system-config-code', menuName: '코드관리', path: '/system/config/code', parentId: 'system-config', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'system-config-menu', menuName: '메뉴관리', path: '/system/config/menu', parentId: 'system-config', level: 2, orderNo: 2, subMenus: [] },
            ],
        },
        {
            menuId: 'system-log',
            menuName: '로그관리',
            path: '/system/log/system',
            level: 1,
            orderNo: 3,
            subMenus: [
                { menuId: 'system-log-system', menuName: '시스템로그', path: '/system/log/system', parentId: 'system-log', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'system-log-audit', menuName: '감사로그', path: '/system/log/audit', parentId: 'system-log', level: 2, orderNo: 2, subMenus: [] },
            ],
        },
        {
            menuId: 'system-backup',
            menuName: '백업관리',
            path: '/system/backup/policy',
            level: 1,
            orderNo: 4,
            subMenus: [
                { menuId: 'system-backup-policy', menuName: '백업정책', path: '/system/backup/policy', parentId: 'system-backup', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'system-backup-history', menuName: '백업이력', path: '/system/backup/history', parentId: 'system-backup', level: 2, orderNo: 2, subMenus: [] },
            ],
        },
    ],
    erp: [
        {
            menuId: 'erp-humen',
            menuName: '성도관리',
            path: '/erp/humen/manager',
            level: 1,
            orderNo: 1,
            subMenus: [
                { menuId: 'erp-humen-manager', menuName: '성도관리', path: '/erp/humen/manager', parentId: 'erp-humen', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'erp-humen-district', menuName: '교구관리', path: '/erp/humen/district', parentId: 'erp-humen', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'erp-humen-newcomer', menuName: '새가족관리', path: '/erp/humen/newcomer', parentId: 'erp-humen', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'erp-humen-change', menuName: '변동관리', path: '/erp/humen/change', parentId: 'erp-humen', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
        {
            menuId: 'erp-sermon',
            menuName: '설교/예배',
            path: '/erp/sermon/manager',
            level: 1,
            orderNo: 2,
            subMenus: [
                { menuId: 'erp-sermon-manager', menuName: '설교관리', path: '/erp/sermon/manager', parentId: 'erp-sermon', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'erp-sermon-archive', menuName: '설교아카이브', path: '/erp/sermon/archive', parentId: 'erp-sermon', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'erp-sermon-attendance', menuName: '출석관리', path: '/erp/sermon/attendance', parentId: 'erp-sermon', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'erp-sermon-write', menuName: '설교작성', path: '/erp/sermon/write', parentId: 'erp-sermon', level: 2, orderNo: 4, subMenus: [] },
                { menuId: 'erp-sermon-order', menuName: '예배순서', path: '/erp/sermon/order', parentId: 'erp-sermon', level: 2, orderNo: 5, subMenus: [] },
            ],
        },
        {
            menuId: 'erp-account',
            menuName: '회계관리',
            path: '/erp/account/manager',
            level: 1,
            orderNo: 3,
            subMenus: [
                { menuId: 'erp-account-manager', menuName: '회계관리', path: '/erp/account/manager', parentId: 'erp-account', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'erp-account-input', menuName: '수입입력', path: '/erp/account/input', parentId: 'erp-account', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'erp-account-budget', menuName: '예산관리', path: '/erp/account/budget', parentId: 'erp-account', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'erp-account-expense', menuName: '지출관리', path: '/erp/account/expense', parentId: 'erp-account', level: 2, orderNo: 4, subMenus: [] },
                { menuId: 'erp-account-report', menuName: '재정보고', path: '/erp/account/report', parentId: 'erp-account', level: 2, orderNo: 5, subMenus: [] },
            ],
        },
        {
            menuId: 'erp-training',
            menuName: '교육관리',
            path: '/erp/training/course',
            level: 1,
            orderNo: 4,
            subMenus: [
                { menuId: 'erp-training-course', menuName: '과정관리', path: '/erp/training/course', parentId: 'erp-training', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'erp-training-student', menuName: '수강생관리', path: '/erp/training/student', parentId: 'erp-training', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'erp-training-attendance', menuName: '교육출결', path: '/erp/training/attendance', parentId: 'erp-training', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'erp-training-complete', menuName: '수료관리', path: '/erp/training/complete', parentId: 'erp-training', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
        {
            menuId: 'erp-ministry',
            menuName: '사역관리',
            path: '/erp/ministry/department',
            level: 1,
            orderNo: 5,
            subMenus: [
                { menuId: 'erp-ministry-department', menuName: '부서관리', path: '/erp/ministry/department', parentId: 'erp-ministry', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'erp-ministry-schedule', menuName: '사역일정', path: '/erp/ministry/schedule', parentId: 'erp-ministry', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'erp-ministry-volunteer', menuName: '봉사자관리', path: '/erp/ministry/volunteer', parentId: 'erp-ministry', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'erp-ministry-report', menuName: '사역보고', path: '/erp/ministry/report', parentId: 'erp-ministry', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
        {
            menuId: 'erp-event',
            menuName: '행사관리',
            path: '/erp/event/calendar',
            level: 1,
            orderNo: 6,
            subMenus: [
                { menuId: 'erp-event-calendar', menuName: '행사일정', path: '/erp/event/calendar', parentId: 'erp-event', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'erp-event-apply', menuName: '신청관리', path: '/erp/event/apply', parentId: 'erp-event', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'erp-event-participant', menuName: '참여자관리', path: '/erp/event/participant', parentId: 'erp-event', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'erp-event-result', menuName: '행사결과', path: '/erp/event/result', parentId: 'erp-event', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
        {
            menuId: 'erp-facility',
            menuName: '시설관리',
            path: '/erp/facility/reservation',
            level: 1,
            orderNo: 7,
            subMenus: [
                { menuId: 'erp-facility-reservation', menuName: '시설예약', path: '/erp/facility/reservation', parentId: 'erp-facility', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'erp-facility-vehicle', menuName: '차량관리', path: '/erp/facility/vehicle', parentId: 'erp-facility', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'erp-facility-inventory', menuName: '비품관리', path: '/erp/facility/inventory', parentId: 'erp-facility', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'erp-facility-maintenance', menuName: '유지보수', path: '/erp/facility/maintenance', parentId: 'erp-facility', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
        {
            menuId: 'erp-comm',
            menuName: '소통관리',
            path: '/erp/comm/notice',
            level: 1,
            orderNo: 8,
            subMenus: [
                { menuId: 'erp-comm-notice', menuName: '공지발송', path: '/erp/comm/notice', parentId: 'erp-comm', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'erp-comm-message', menuName: '메시지', path: '/erp/comm/message', parentId: 'erp-comm', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'erp-comm-prayer', menuName: '기도요청', path: '/erp/comm/prayer', parentId: 'erp-comm', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'erp-comm-newsletter', menuName: '뉴스레터', path: '/erp/comm/newsletter', parentId: 'erp-comm', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
        {
            menuId: 'erp-stats',
            menuName: '통계리포트',
            path: '/erp/stats/dashboard',
            level: 1,
            orderNo: 9,
            subMenus: [
                { menuId: 'erp-stats-dashboard', menuName: '대시보드', path: '/erp/stats/dashboard', parentId: 'erp-stats', level: 2, orderNo: 1, subMenus: [] },
                { menuId: 'erp-stats-attendance', menuName: '출석통계', path: '/erp/stats/attendance', parentId: 'erp-stats', level: 2, orderNo: 2, subMenus: [] },
                { menuId: 'erp-stats-offering', menuName: '헌금통계', path: '/erp/stats/offering', parentId: 'erp-stats', level: 2, orderNo: 3, subMenus: [] },
                { menuId: 'erp-stats-ministry', menuName: '사역분석', path: '/erp/stats/ministry', parentId: 'erp-stats', level: 2, orderNo: 4, subMenus: [] },
            ],
        },
    ],
    mypage: [
        {
            menuId: 'M_MYPAGE',
            menuName: 'MYPAGE',
            path: '/mypage',
            level: 0,
            orderNo: 1,
            subMenus: [
                {
                    menuId: 'M_MYPAGE_01',
                    menuName: '마이페이지',
                    parentId: 'M_MYPAGE',
                    path: '/mypage/user/profile',
                    level: 1,
                    orderNo: 1,
                    subMenus: [
                        { menuId: 'M_MYPAGE_01_01', menuName: '내 정보 관리', parentId: 'M_MYPAGE_01', path: '/mypage/user/profile', level: 2, orderNo: 1, subMenus: [] },
                        { menuId: 'M_MYPAGE_01_02', menuName: '비밀번호 변경', parentId: 'M_MYPAGE_01', path: '/mypage/user/password', level: 2, orderNo: 2, subMenus: [] },
                        { menuId: 'M_MYPAGE_01_03', menuName: '내 활동 내역', parentId: 'M_MYPAGE_01', path: '/mypage/user/activity', level: 2, orderNo: 3, subMenus: [] },
                        { menuId: 'M_MYPAGE_01_04', menuName: '내 문의 내역', parentId: 'M_MYPAGE_01', path: '/mypage/user/inquiry', level: 2, orderNo: 4, subMenus: [] },
                        { menuId: 'M_MYPAGE_01_05', menuName: '알림 설정', parentId: 'M_MYPAGE_01', path: '/mypage/user/notifications', level: 2, orderNo: 5, subMenus: [] },
                        { menuId: 'M_MYPAGE_01_06', menuName: '회원 탈퇴', parentId: 'M_MYPAGE_01', path: '/mypage/user/withdraw', level: 2, orderNo: 6, subMenus: [] },
                    ],
                },
            ],
        },
    ],
};

const getSystemTypeByPath = (pathname: string) => {
    if (pathname.startsWith('/community')) return 'community';
    if (pathname.startsWith('/erp')) return 'erp';
    if (pathname.startsWith('/mypage')) return 'mypage';
    if (pathname.startsWith('/system')) return 'system';
    return 'official';
};

const normalizeMenusForSystem = (systemType: string, menus: MenuItem[]): MenuItem[] => {
    if (systemType !== 'mypage') {
        return menus;
    }

    const normalizePath = (path?: string): string => {
        if (!path) return '';
        return path.startsWith('/user/') ? `/mypage${path}` : path;
    };

    const normalizeItem = (menu: MenuItem): MenuItem => ({
        ...menu,
        path: normalizePath(menu.path),
        menuUrl: normalizePath(menu.menuUrl),
        subMenus: (menu.subMenus ?? []).map(normalizeItem),
    });

    return menus.map(normalizeItem);
};

export function useMenu() {
    const location = useLocation();
    const {
        menuList,
        systemType,
        currentTopMenu,
        currentSubMenus,
        currentMenu,
        submenuVisible,
        setMenuList,
        setCurrentByPath,
    } = useMenuStore();

    const resolvedSystemType = getSystemTypeByPath(location.pathname);

    useEffect(() => {
        const loadMenus = async () => {
            const menus = await menuApi.getHierarchicalMenus(resolvedSystemType);
            const normalizedMenus = normalizeMenusForSystem(resolvedSystemType, menus);
            const fallback = fallbackMenuBySystem[resolvedSystemType] ?? fallbackMenus;
            setMenuList(resolvedSystemType, normalizedMenus.length > 0 ? normalizedMenus : fallback);
        };

        if (menuList.length === 0 || systemType !== resolvedSystemType) {
            void loadMenus();
        }
    }, [menuList.length, resolvedSystemType, setMenuList, systemType]);

    useEffect(() => {
        setCurrentByPath(location.pathname);
    }, [location.pathname, setCurrentByPath, menuList.length, systemType]);

    return {
        menuList,
        currentTopMenu,
        currentSubMenus,
        currentMenu,
        submenuVisible,
    };
}
