import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import { useMenu } from '../common/menu/menuHook';
import Sidebar from './Sidebar';
import { resolveHeroConfig } from './heroConfig';

export default function SubmenuLayout() {
  const location = useLocation();
  const { currentTopMenu, currentSubMenus } = useMenu();
  const [isHeroImageAvailable, setIsHeroImageAvailable] = useState(true);

  const heroConfig = resolveHeroConfig(location.pathname, currentTopMenu?.menuName ?? '');

  useEffect(() => {
    setIsHeroImageAvailable(true);
  }, [location.pathname, heroConfig.imageUrl]);

  return (
    <>
      {currentTopMenu && heroConfig.enabled && (
        <section className={`hero${heroConfig.compact ? ' hero--compact' : ''}`}>
          {heroConfig.imageUrl && isHeroImageAvailable && (
            <img
              src={heroConfig.imageUrl}
              alt=""
              className="hero-image"
              onError={() => setIsHeroImageAvailable(false)}
            />
          )}
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>{heroConfig.title}</h1>
            {heroConfig.subtitle && <p>{heroConfig.subtitle}</p>}
          </div>
        </section>
      )}
      <Breadcrumb />
      <main className="main-content">
        <Sidebar items={currentSubMenus} />
        <div className="content-area min-w-0">
          <Outlet />
        </div>
      </main>
    </>
  );
}