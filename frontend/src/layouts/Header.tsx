import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useAuthStore } from '../store/authStore';
import type { MenuItem } from '../types/menu.types';

export default function Header() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const location = useLocation();
  const { menuList } = useMenu();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openedSubmenus, setOpenedSubmenus] = useState<Record<string, boolean>>({});

  const isErpRoute = location.pathname.startsWith('/erp');
  const topMenusFromApi = (() => {
    const sortedMenus = [...menuList].sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0));

    if (!isErpRoute) {
      return sortedMenus;
    }

    const erpTopIdPattern = /^M_SYS_\d{2}$/;
    const erpChildIdPattern = /^M_SYS_\d{2}_\d{2}$/;
    const erpTopMenus = sortedMenus.filter((menu) => erpTopIdPattern.test(String(menu.menuId ?? '')));

    if (erpTopMenus.length > 0) {
      const erpChildrenByTopId = sortedMenus.reduce<Record<string, MenuItem[]>>((acc, menu) => {
        const id = String(menu.menuId ?? '');
        if (!erpChildIdPattern.test(id)) return acc;

        const parts = id.split('_');
        const topId = `M_SYS_${parts[2]}`;
        if (!acc[topId]) acc[topId] = [];
        acc[topId].push(menu);
        return acc;
      }, {});

      return erpTopMenus.map((menu) => {
        const fallbackChildren = erpChildrenByTopId[menu.menuId] ?? [];
        const mergedSubMenus = (menu.subMenus && menu.subMenus.length > 0 ? menu.subMenus : fallbackChildren)
          .slice()
          .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0));

        return {
          ...menu,
          subMenus: mergedSubMenus,
        };
      });
    }

    const topLevelMenus = sortedMenus.filter((menu) => menu.level === 1 || !menu.parentId);
    const childrenByParent = sortedMenus.reduce<Record<string, MenuItem[]>>((acc, menu) => {
      if (!menu.parentId) return acc;
      if (!acc[menu.parentId]) acc[menu.parentId] = [];
      acc[menu.parentId].push(menu);
      return acc;
    }, {});

    return topLevelMenus.map((menu) => {
      const fallbackChildren = childrenByParent[menu.menuId] ?? [];
      const mergedSubMenus = (menu.subMenus && menu.subMenus.length > 0 ? menu.subMenus : fallbackChildren)
        .slice()
        .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0));

      return {
        ...menu,
        subMenus: mergedSubMenus,
      };
    });
  })();

  const topMenus: MenuItem[] = topMenusFromApi.length > 0
    ? topMenusFromApi
    : [
        { menuId: 'official', menuName: '공식', path: '/', level: 1, orderNo: 1, subMenus: [] },
        { menuId: 'community', menuName: '공동체', path: '/community', level: 1, orderNo: 2, subMenus: [] },
        { menuId: 'erp', menuName: 'ERP', path: '/erp', level: 1, orderNo: 3, subMenus: [] },
        { menuId: 'system', menuName: '시스템', path: '/system', level: 1, orderNo: 4, subMenus: [] },
      ];

  useEffect(() => {
    if (!mobileNavOpen) {
      document.body.classList.remove('mobile-nav-active');
      return;
    }
    document.body.classList.add('mobile-nav-active');
    return () => {
      document.body.classList.remove('mobile-nav-active');
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const toggleSubmenu = (menuId: string) => {
    setOpenedSubmenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  return (
    <header className="header sticky top-0 z-50 bg-white shadow-sm">
      {/* 헤더 상단 (로그인/회원가입 링크) */}
      <div className="header-top bg-gray-50 border-b border-gray-100">
        <div className="container desktop-only max-w-[1200px] mx-auto px-5 hidden md:block">
          <div className="header-top-links flex items-center gap-3 py-1.5 text-sm text-gray-600">
            <Link to="/">홈으로</Link>
            <span className="separator text-gray-300">|</span>
            {isAuthenticated ? (
              <>
                <span style={{ color: '#4CAF50', fontWeight: 500 }}>
                  {user?.userName ?? user?.userId ?? '사용자'}님 환영합니다
                </span>
                <span className="separator text-gray-300">|</span>
                <Link to="/mypage" className="hover:text-brand-primary transition-colors">마이페이지</Link>
                <span className="separator text-gray-300">|</span>
                <Link to="/community" className="hover:text-brand-primary transition-colors">커뮤니티</Link>
                <span className="separator text-gray-300">|</span>
                <Link to="/erp" className="hover:text-brand-primary transition-colors">ERP</Link>
                <span className="separator text-gray-300">|</span>
                <Link to="/system" className="hover:text-brand-primary transition-colors">시스템관리</Link>
                <span className="separator text-gray-300">|</span>
                <button type="button" onClick={clearAuth} className="hover:text-brand-primary transition-colors bg-transparent border-0 cursor-pointer text-sm text-inherit p-0">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="hover:text-brand-primary transition-colors">로그인</Link>
                <span className="separator text-gray-300">|</span>
                <Link to="/auth/register" className="hover:text-brand-primary transition-colors">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 헤더 메인 (로고 + GNB + 햄버거) */}
      <div className="header-main border-b border-gray-200">
        <div className={`container max-w-[1200px] mx-auto px-5 flex items-center gap-4${isErpRoute ? ' erp-wide max-w-full' : ''}`}>
          <Link to="/" className="logo flex-shrink-0" aria-label="다사랑교회 홈">
            <img src="/img/logo.png" alt="다사랑교회 로고" className="block h-full w-auto max-w-[360px] object-contain" />
          </Link>
          <nav
            className={`nav-main desktop-only hidden md:flex items-center gap-1 ml-auto${isErpRoute ? ' erp-menu' : ''}`}
            style={isErpRoute ? ({ ['--erp-menu-count' as string]: topMenus.length } as CSSProperties) : undefined}
          >
            {topMenus.map((menu) => {
              const subMenus = menu.subMenus ?? [];
              const href = menu.path || menu.menuUrl || '/';
              return (
                <div className="dropdown relative group" key={menu.menuId}>
                  <Link
                    to={href}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
                  >
                    {menu.menuName}
                  </Link>
                  {subMenus.length > 0 && (
                    <div className="dropdown-menu absolute top-full left-0 bg-white shadow-lg rounded-lg py-1 hidden group-hover:block z-50 min-w-36 border border-gray-100">
                      {subMenus.map((sub) => (
                        <Link
                          key={sub.menuId}
                          to={sub.path || sub.menuUrl || '/'}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-primary hover:bg-gray-50 whitespace-nowrap transition-colors"
                        >
                          {sub.menuName}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <button
            id="hamburger-btn"
            type="button"
            className={`hamburger mobile-only ml-auto${mobileNavOpen ? ' is-active' : ''}`}
            aria-label="메뉴 열기"
            aria-controls="mobile-nav"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
        </div>
      </div>

      {/* 모바일 오버레이 */}
      <div
        className={`mobile-nav-overlay${mobileNavOpen ? ' is-visible' : ''}`}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden={!mobileNavOpen}
      />

      {/* 모바일 내비게이션 패널 */}
      <nav id="mobile-nav" className={`mobile-nav${mobileNavOpen ? ' is-open' : ''}`}>
        <div className="mobile-nav-header">
          <Link to="/" className="mobile-logo">다사랑교회</Link>
        </div>
        <div className="mobile-nav-body">
          <ul className="mobile-menu-list">
            {topMenus.map((menu) => {
              const subMenus = menu.subMenus ?? [];
              const hasSubmenu = subMenus.length > 0;
              const isOpen = !!openedSubmenus[menu.menuId];
              return (
                <li
                  key={menu.menuId}
                  className={hasSubmenu ? `has-submenu${isOpen ? ' submenu-open' : ''}` : ''}
                >
                  <div className="menu-item-row">
                    <Link to={menu.path || menu.menuUrl || '/'}>{menu.menuName}</Link>
                    {hasSubmenu && (
                      <button
                        type="button"
                        className="submenu-toggle-btn"
                        onClick={() => toggleSubmenu(menu.menuId)}
                        aria-expanded={isOpen}
                      >
                        <span className="material-icons">{isOpen ? 'expand_less' : 'expand_more'}</span>
                      </button>
                    )}
                  </div>
                  {hasSubmenu && (
                    <ul className="submenu">
                      {subMenus.map((sub) => (
                        <li key={sub.menuId}>
                          <Link to={sub.path || sub.menuUrl || '/'}>{sub.menuName}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mobile-nav-footer">
          <div className="mobile-footer-top">
            {isAuthenticated ? (
              <>
                <Link to="/mypage">마이페이지</Link>
                <span className="footer-separator">|</span>
                <button
                  type="button"
                  onClick={clearAuth}
                  className="bg-transparent border-0 cursor-pointer text-inherit p-0"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login">로그인</Link>
                <span className="footer-separator">|</span>
                <Link to="/auth/register">회원가입</Link>
              </>
            )}
          </div>
          <div className="mobile-footer-select">
            <select className="family-site-select" defaultValue="" onChange={(event) => {
              if (event.target.value) {
                window.open(event.target.value, '_blank', 'noopener,noreferrer');
                event.target.value = '';
              }
            }}>
              <option value="">FAMILY SITE</option>
              <option value="http://busan.psh.or.kr">부산비전센터</option>
              <option value="http://ilsan.psh.or.kr">일산드림센터</option>
              <option value="https://twowings.or.kr">두날개교회</option>
              <option value="https://youtube.com">유튜브 채널</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
}